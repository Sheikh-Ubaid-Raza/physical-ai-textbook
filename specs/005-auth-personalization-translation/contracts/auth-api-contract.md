# Auth Service API Contract

## Base URL
`http://localhost:3001/api/auth` (Node.js Auth Service)

## User Registration
**Endpoint**: `POST /register`
**Description**: Register a new user with background information

### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "software_background": "Intermediate",
  "hardware_background": "Arduino",
  "learning_goal": "Learn to build autonomous robots using ROS2"
}
```

### Response (Success)
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Intermediate",
    "hardware_background": "Arduino",
    "learning_goal": "Learn to build autonomous robots using ROS2",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  },
  "session": {
    "token": "jwt-token-string",
    "expires_at": "2025-01-16T10:30:00Z"
  }
}
```

### Response (Error)
```json
{
  "error": "Validation error or user already exists",
  "details": "Specific error details"
}
```

## User Login
**Endpoint**: `POST /login`
**Description**: Authenticate user and return session token

### Request
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Response (Success)
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Intermediate",
    "hardware_background": "Arduino",
    "learning_goal": "Learn to build autonomous robots using ROS2"
  },
  "session": {
    "token": "jwt-token-string",
    "expires_at": "2025-01-16T10:30:00Z"
  }
}
```

## Get Current User
**Endpoint**: `GET /me`
**Description**: Get current authenticated user's profile
**Headers Required**: `Authorization: Bearer {token}`

### Response (Success)
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Intermediate",
    "hardware_background": "Arduino",
    "learning_goal": "Learn to build autonomous robots using ROS2",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

## Update User Profile
**Endpoint**: `PUT /profile`
**Description**: Update user's background information
**Headers Required**: `Authorization: Bearer {token}`

### Request
```json
{
  "software_background": "Advanced",
  "hardware_background": "RaspberryPi",
  "learning_goal": "Build advanced autonomous systems with computer vision"
}
```

### Response (Success)
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Advanced",
    "hardware_background": "RaspberryPi",
    "learning_goal": "Build advanced autonomous systems with computer vision",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

## User Logout
**Endpoint**: `POST /logout`
**Description**: Invalidate current user session
**Headers Required**: `Authorization: Bearer {token}`

### Response (Success)
```json
{
  "success": true
}
```