from typing import List, Dict, Any, Optional
from models.chat import ChatSession, Message
from models.document import VectorDocument
from services.embedding_service import embedding_service
from services.vector_service import vector_service
from config.database import SessionLocal
from config.settings import settings
from sqlalchemy.orm import Session
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        # Initialize without global OpenAI configuration to avoid proxy issues
        pass

    def create_session(self, db: Session) -> ChatSession:
        """
        Create a new chat session
        """
        session = ChatSession()
        db.add(session)
        db.commit()
        db.refresh(session)
        logger.info(f"Created new chat session: {session.id}")
        return session

    def get_session(self, db: Session, session_id: str) -> Optional[ChatSession]:
        """
        Get a chat session by ID
        """
        # Validate that session_id is a proper UUID before querying
        import uuid
        try:
            uuid.UUID(session_id)
            return db.query(ChatSession).filter(ChatSession.id == session_id).first()
        except (ValueError, TypeError):
            # If session_id is not a valid UUID, return None
            return None

    def add_message(self, db: Session, session_id: str, role: str, content: str, context_used: Optional[str] = None) -> Message:
        """
        Add a message to a chat session
        """
        message = Message(
            session_id=session_id,
            role=role,
            content=content,
            context_used=context_used
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        logger.info(f"Added {role} message to session {session_id}")
        return message

    def get_session_messages(self, db: Session, session_id: str) -> List[Message]:
        """
        Get all messages for a session
        """
        return db.query(Message).filter(Message.session_id == session_id).order_by(Message.timestamp).all()

    async def generate_response(self, user_message: str, selected_text: Optional[str] = None, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a response using RAG (Retrieval Augmented Generation)
        """
        try:
            # Generate embedding for the user's query
            query_embedding = embedding_service.generate_embedding(user_message)

            # Search for relevant content in the vector database
            search_results = vector_service.search_vectors(query_embedding, top_k=5)

            # Check if we found any relevant content
            if not search_results or all(result["score"] < 0.1 for result in search_results):  # Adjust threshold as needed
                # No relevant content found, prepare a different context
                context_texts = []
                sources = []
                context = f"No relevant content found in the textbook for the question: {user_message}. Please provide a general response based on your knowledge."
            else:
                # Prepare context from search results
                context_texts = [result["text"] for result in search_results]
                sources = [
                    {
                        "title": result["metadata"].get("title", "Unknown"),
                        "path": result["metadata"].get("source_path", "Unknown"),
                        "relevance": result["score"]
                    }
                    for result in search_results
                ]
                context = f"Use the following context to answer the question: {'. '.join(context_texts)}"

            # Prepare the prompt for the AI model
            if selected_text:
                # If user has selected text, prioritize it in the context
                context = f"User has selected the following text: '{selected_text}'. Answer the question based ONLY on this selected text and the following context: {'. '.join(context_texts)}"
            else:
                # Otherwise, use the general context
                context = f"Use the following context to answer the question: {'. '.join(context_texts)}"

            # Create the full prompt
            full_prompt = f"{context}\n\nQuestion: {user_message}\n\nAnswer:"

            # Truncate the prompt if it's too long (OpenAI API has token limits)
            # This is a basic approach - in production, you'd want to count actual tokens
            max_prompt_length = 2000  # Adjust based on your API's limits
            if len(full_prompt) > max_prompt_length:
                # Truncate the context part to fit the question
                available_length = max_prompt_length - len(user_message) - len("\n\nQuestion: \n\nAnswer:")
                if available_length > 0:
                    context = context[:available_length]
                    full_prompt = f"{context}\n\nQuestion: {user_message}\n\nAnswer:"
                else:
                    # If even the question is too long, truncate it
                    full_prompt = f"Question: {user_message[:max_prompt_length]}\n\nAnswer:"

            # Configure OpenAI client to use OpenRouter with the Agents SDK
            import os
            from openai import AsyncOpenAI
            from agents import set_default_openai_client

            # Create custom OpenAI client for OpenRouter
            custom_client = AsyncOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.openrouter_api_key,
            )

            # Set the custom client as the default for the agents SDK
            set_default_openai_client(custom_client)

            # Import and create the agent
            from agents import Agent, Runner

            # Create an agent with the OpenRouter model
            agent = Agent(
                name="Physical AI Textbook Assistant",
                instructions="You are an AI assistant helping users with the Physical AI Textbook. Answer questions based on the provided context. Be helpful, accurate, and concise.",
                model=settings.openrouter_model,
            )

            # Run the agent with the full prompt
            response = await Runner.run(
                agent,
                full_prompt
            )

            # Extract the response
            ai_response = response.final_output

            logger.info(f"Generated response for session {session_id} with {len(search_results)} sources")

            return {
                "response": ai_response,
                "sources": sources,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise

    async def process_user_query(self, db: Session, message: str, session_id: Optional[str] = None, selected_text: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a user query end-to-end: create session if needed, add message, generate response
        """
        # Get or create session
        # Only try to get existing session if session_id is a valid UUID
        import uuid
        valid_session_id = None
        if session_id:
            try:
                uuid.UUID(session_id)
                valid_session_id = session_id
                session = self.get_session(db, session_id)
                if not session:
                    session = self.create_session(db)
                    session_id = str(session.id)
                else:
                    session_id = str(session.id)
            except (ValueError, TypeError):
                # If session_id is not a valid UUID, create a new session
                session = self.create_session(db)
                session_id = str(session.id)
        else:
            session = self.create_session(db)
            session_id = str(session.id)

        # Add user message to session
        self.add_message(db, session_id, "user", message, selected_text)

        # Generate AI response
        response_data = await self.generate_response(message, selected_text, session_id)

        # Add AI response to session
        self.add_message(db, session_id, "assistant", response_data["response"])

        # Return response with session ID
        response_data["sessionId"] = session_id
        return response_data

# Create a global instance of the chat service
chat_service = ChatService()