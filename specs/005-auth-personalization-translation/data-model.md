# Data Model: User Authentication, Content Personalization, and Urdu Translation

## User Entity

**Description**: Represents a registered user with background information for personalization

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (String, Unique, Required): User's email address
- `name` (String, Required): User's display name
- `password_hash` (String, Required): Hashed password for authentication
- `software_background` (Enum: "Beginner"|"Intermediate"|"Advanced", Required): User's software experience level
- `hardware_background` (Enum: "None"|"Arduino"|"RaspberryPi", Required): User's hardware experience
- `learning_goal` (Text, Optional): User's learning objectives
- `created_at` (DateTime, Required): Account creation timestamp
- `updated_at` (DateTime, Required): Last update timestamp
- `is_active` (Boolean, Default: true): Account active status

**Validation Rules**:
- Email must be valid email format
- Password must be at least 8 characters with complexity requirements
- software_background and hardware_background must be from the defined enum values

## UserSession Entity

**Description**: Represents an authenticated user session

**Fields**:
- `id` (UUID, Primary Key): Unique session identifier
- `user_id` (UUID, Foreign Key): Reference to the user
- `token` (String, Unique, Required): Session token for authentication
- `expires_at` (DateTime, Required): Token expiration timestamp
- `created_at` (DateTime, Required): Session creation timestamp
- `last_accessed_at` (DateTime, Required): Last access timestamp

**Validation Rules**:
- Token must be unique across all sessions
- expires_at must be in the future
- Session is invalid after expiration

## PersonalizedContent Entity

**Description**: Represents chapter content that has been personalized for a specific user

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for personalized content
- `user_id` (UUID, Foreign Key): Reference to the user who requested personalization
- `chapter_id` (String, Required): Identifier for the original chapter
- `original_content` (Text, Required): The original chapter content
- `personalized_content` (Text, Required): The personalized version of the content
- `personalization_level` (String, Required): The level of personalization applied (based on user's software_background)
- `created_at` (DateTime, Required): Timestamp when personalization was created
- `expires_at` (DateTime, Optional): When the personalized content expires and should be regenerated

**Validation Rules**:
- User must be authenticated to create personalized content
- Personalized content must be different from original content
- Cannot create duplicate personalization for same user/chapter combination within cache period

## TranslatedContent Entity

**Description**: Represents chapter content that has been translated to Urdu

**Fields**:
- `id` (UUID, Primary Key): Unique identifier for translated content
- `user_id` (UUID, Foreign Key): Reference to the user who requested translation
- `chapter_id` (String, Required): Identifier for the original chapter
- `original_content` (Text, Required): The original English chapter content
- `translated_content` (Text, Required): The Urdu translation of the content
- `translation_mode` (String, Default: "script"): Mode of translation (script/roman)
- `technical_terms_preserved` (JSON, Optional): List of technical terms preserved in English
- `created_at` (DateTime, Required): Timestamp when translation was created
- `expires_at` (DateTime, Optional): When the translation expires and should be regenerated

**Validation Rules**:
- User must be authenticated to create translation
- Translated content must be in Urdu script
- Technical terms must be preserved in English
- Cannot create duplicate translation for same user/chapter combination within cache period

## State Transitions

### User Registration Flow
1. User provides email, password, and background information
2. System validates input and creates User entity with hashed password
3. System sends verification email (optional future enhancement)
4. User account becomes active upon verification

### Personalization Request Flow
1. Authenticated user requests content personalization
2. System retrieves user's background information
3. System applies personalization algorithm based on user's software_background
4. System creates PersonalizedContent entity and returns personalized content

### Translation Request Flow
1. Authenticated user requests Urdu translation
2. System validates user authentication
3. System applies translation with technical term preservation
4. System creates TranslatedContent entity and returns translated content