# Quickstart Guide: Physical AI & Humanoid Robotics Textbook

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- GitHub account for deployment

## Setup Instructions

### 1. Clone or Initialize Repository
```bash
# If starting fresh
mkdir physical-ai-textbook
cd physical-ai-textbook
git init

# If cloning existing repository
git clone <repository-url>
cd physical-ai-textbook
```

### 2. Install Docusaurus
```bash
npm init -y
npm install @docusaurus/core@latest @docusaurus/preset-classic@latest @mdx-js/react@latest
```

### 3. Initialize Docusaurus Project
```bash
npx create-docusaurus@latest website classic --typescript
```

### 4. Configure for GitHub Pages
Update `docusaurus.config.ts` with GitHub Pages settings:
- Set `organizationName` to your GitHub username
- Set `projectName` to your repository name
- Set `deploymentBranch` to `gh-pages`

### 5. Create Curriculum Structure
```bash
mkdir -p docs/module-{01..04}/week-{01..05}
```

### 6. Install Additional Dependencies
```bash
npm install @docusaurus/module-type-aliases @docusaurus/types
npm install --save-dev typescript
```

### 7. Start Development Server
```bash
npm run start
```

## Key Configuration Files

### docusaurus.config.ts
Main configuration file for site metadata, themes, and plugins.

### sidebars.ts
Defines the navigation structure for the textbook content.

### package.json
Contains project dependencies and scripts.

## Deployment
1. Commit all changes to the `main` branch
2. Push to GitHub
3. GitHub Actions will automatically build and deploy to GitHub Pages
4. Site will be available at `https://<username>.github.io/<repository-name>`

## Content Creation
1. Create MDX files in the appropriate module/week directories
2. Follow the template structure with learning objectives
3. Use Mermaid diagrams for technical illustrations
4. Test locally before committing