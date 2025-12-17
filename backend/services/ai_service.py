import openai
import os
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")

        # Configure OpenAI to use OpenRouter
        openai.base_url = "https://openrouter.ai/api/v1"
        openai.api_key = self.api_key

    def call_openrouter_api(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        stream: bool = False
    ) -> Any:
        """Call OpenRouter API with specified parameters"""
        try:
            response = openai.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=stream
            )
            return response
        except Exception as e:
            print(f"Error calling OpenRouter API: {str(e)}")
            raise e

    def personalize_content(
        self,
        content: str,
        user_background: str,
        user_hardware: str,
        max_tokens: int = 1500
    ) -> str:
        """Personalize content based on user's background"""
        prompt = f"""
        You are an educational content personalization expert. Rewrite the following content to match the learning level and background of a user.

        User Background:
        - Software Level: {user_background}
        - Hardware Experience: {user_hardware}

        Original Content:
        {content}

        Instructions:
        1. Adapt the complexity of explanations to match the user's software background level
        2. Include relevant examples that connect to the user's hardware experience where applicable
        3. Maintain technical accuracy while making the content more accessible to the user's level
        4. Preserve all technical terms and code snippets exactly as they are
        5. Adjust the depth of explanations (more detailed for advanced users, more foundational for beginners)

        Personalized Content:
        """

        messages = [
            {"role": "system", "content": "You are an expert educational content personalization assistant. Your job is to adapt educational content to match the user's background and learning level while preserving technical accuracy."},
            {"role": "user", "content": prompt}
        ]

        response = self.call_openrouter_api(
            model="meta-llama/llama-3.1-70b-instruct",
            messages=messages,
            max_tokens=max_tokens
        )

        return response.choices[0].message.content

    def translate_to_urdu(
        self,
        content: str,
        preserve_technical_terms: bool = True,
        translation_mode: str = "script",  # "script" or "roman"
        max_tokens: int = 2000
    ) -> str:
        """Translate content to Urdu while preserving technical terms"""
        if preserve_technical_terms:
            prompt = f"""
            You are an expert technical translator. Translate the following technical documentation into professional Urdu.

            Guidelines:
            1. Translate all content to Urdu
            2. KEEP ALL technical terms (e.g., ROS 2, Node, Publisher, Subscriber, API, Latency, Docker, etc.) in English
            3. Explain technical concepts in natural Urdu but keep technical terminology in English
            4. Use proper Urdu script (not Roman Urdu)
            5. Maintain the structure and formatting of the original content
            6. Preserve code snippets exactly as they are

            Content to translate:
            {content}

            Urdu Translation (with technical terms preserved in English):
            """
        else:
            prompt = f"""
            You are an expert translator. Translate the following content into professional Urdu using proper Urdu script (not Roman Urdu).

            Content to translate:
            {content}

            Urdu Translation:
            """

        messages = [
            {"role": "system", "content": "You are an expert translator specializing in technical documentation. Translate content to Urdu while preserving technical terms in English and maintaining professional quality."},
            {"role": "user", "content": prompt}
        ]

        response = self.call_openrouter_api(
            model="qwen/qwen-2.5-72b-instruct",
            messages=messages,
            max_tokens=max_tokens
        )

        return response.choices[0].message.content