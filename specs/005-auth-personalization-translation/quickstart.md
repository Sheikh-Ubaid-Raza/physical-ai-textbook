# Quickstart Guide: User Authentication, Content Personalization, and Urdu Translation

## Prerequisites
- Node.js 18+ installed
- Python 3.11+ installed
- Access to Neon Postgres database
- OpenRouter API key
- Docusaurus project set up

## Environment Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Update environment variables**:
   ```env
   # Database
   DATABASE_URL="your_neon_postgres_connection_string"

   # OpenRouter API
   OPENROUTER_API_KEY="your_openrouter_api_key"

   # Node.js Auth Service
   AUTH_SECRET="your_auth_secret_key"
   NODE_AUTH_PORT=3001

   # Python Backend
   PYTHON_BACKEND_PORT=8000
   ```

## Installation

### 1. Set up Node.js Auth Service
```bash
# Create auth-service directory
mkdir auth-service && cd auth-service

# Initialize Node.js project
npm init -y

# Install dependencies
npm install hono better-auth pg dotenv

# Install dev dependencies
npm install -D typescript @types/node tsx
```

### 2. Set up Python Backend Extensions
```bash
# Navigate to backend directory
cd backend

# Install additional dependencies (if not already installed)
pip install openai agents
```

### 3. Update Frontend Dependencies
```bash
# Navigate to project root
cd ..

# Install auth dependencies for Docusaurus
npm install @better-auth/react
```

## Database Setup

1. **Run database migrations** to add extended user fields:
   ```sql
   -- Add background fields to users table
   ALTER TABLE users
   ADD COLUMN IF NOT EXISTS software_background VARCHAR(20) CHECK (software_background IN ('Beginner', 'Intermediate', 'Advanced')),
   ADD COLUMN IF NOT EXISTS hardware_background VARCHAR(20) CHECK (hardware_background IN ('None', 'Arduino', 'RaspberryPi')),
   ADD COLUMN IF NOT EXISTS learning_goal TEXT;
   ```

## Running the Services

### 1. Start Auth Service
```bash
cd auth-service
npx tsx src/index.ts
```

### 2. Start Python Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 3. Start Docusaurus Frontend
```bash
cd ..
npm start
```

## API Endpoints

### Auth Service (http://localhost:3001)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Python Backend (http://localhost:8000)
- `POST /api/v1/personalize` - Content personalization
- `POST /api/v1/translate` - Urdu translation
- `GET /api/v1/health` - Health check

## Frontend Integration

### 1. Add Auth Context
The AuthModal and SmartToolbar components will be integrated into the Docusaurus documentation pages to provide authentication and personalization features.

### 2. Smart Toolbar Features
- ✨ Personalize Chapter button
- 🌐 Urdu Translation button
- AuthModal for login/register with background information

## Testing

1. **Register a new user** with background information
2. **Navigate to a textbook chapter**
3. **Try the personalization feature** - content should adapt to user's software background
4. **Try the Urdu translation feature** - content should be translated while preserving technical terms

## Troubleshooting

- **Auth service not connecting to database**: Verify DATABASE_URL is correctly set in auth-service/.env
- **AI services not working**: Check that OPENROUTER_API_KEY is properly configured
- **Frontend not communicating with auth service**: Verify CORS settings and auth service URL in frontend components