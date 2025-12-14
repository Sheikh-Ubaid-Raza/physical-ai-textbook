# Data Model: Physical AI & Humanoid Robotics Textbook

## Entities

### Textbook Module
- **name**: String (required) - The module title (e.g., "The Robotic Nervous System")
- **moduleNumber**: Integer (required) - Sequential number (1-4)
- **description**: String (required) - Brief overview of the module content
- **weeks**: Array of Week entities (required) - Contains all weeks in the module

### Week
- **name**: String (required) - The week title (e.g., "Introduction to Physical AI")
- **weekNumber**: Integer (required) - Sequential number within the module (1-5)
- **module**: Reference to Textbook Module (required) - Links to parent module
- **chapters**: Array of Chapter entities (required) - Contains all chapters in the week

### Chapter
- **title**: String (required) - The chapter title
- **slug**: String (required) - URL-friendly identifier
- **content**: String (required) - The chapter content in MDX format
- **learningObjectives**: Array of strings - List of learning objectives
- **prerequisites**: Array of strings - Required knowledge before reading
- **week**: Reference to Week entity (required) - Links to parent week
- **createdAt**: Date (required) - Creation timestamp
- **updatedAt**: Date (required) - Last update timestamp

### Navigation Structure
- **title**: String (required) - Display title for navigation
- **type**: String (required) - Type of navigation item ("doc", "category", "link")
- **id**: String (required) - Unique identifier for the navigation item
- **items**: Array of Navigation Structure entities - Child navigation items
- **module**: Reference to Textbook Module (optional) - Links to associated module if applicable

## Relationships
- Textbook Module "has many" Weeks (one-to-many)
- Week "has many" Chapters (one-to-many)
- Chapter "belongs to" Week (many-to-one)
- Navigation Structure "has many" child Navigation Structure items (self-referencing)

## Validation Rules
- Module numbers must be between 1 and 4
- Week numbers must be between 1 and 5 (max per module)
- Chapter titles must be unique within a week
- Slugs must follow the format: "module-##-week-##-topic"
- Content must be in valid MDX format
- Learning objectives must contain at least one objective

## State Transitions
- Chapter: Draft → Review → Published → Archived
- Module: Not Started → In Progress → Complete → Archived