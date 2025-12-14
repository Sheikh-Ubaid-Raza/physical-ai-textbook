# Physical AI & Humanoid Robotics Textbook

This repository contains the source code and content for the Physical AI & Humanoid Robotics textbook, built with Docusaurus.

## Project Structure

```
physical-ai-textbook/
├── docs/                    # Textbook content organized by modules and weeks
│   ├── module-01/           # Module 1: The Robotic Nervous System (ROS 2)
│   │   ├── week-01/
│   │   ├── week-02/
│   │   └── ...
│   ├── module-02/           # Module 2: The Digital Twin (Gazebo & Unity)
│   │   └── ...
│   ├── module-03/           # Module 3: The AI-Robot Brain (NVIDIA Isaac)
│   │   └── ...
│   └── module-04/           # Module 4: Vision-Language-Action (VLA)
│       └── ...
├── src/                     # Custom React components and Docusaurus theme
│   ├── components/          # Reusable components (LearningObjectives, etc.)
│   ├── css/                 # Custom styles
│   └── pages/               # Custom pages (404 page, etc.)
├── static/                  # Static assets
├── .github/workflows/       # GitHub Actions for deployment
├── docusaurus.config.ts     # Main Docusaurus configuration
├── sidebars.ts              # Navigation sidebar configuration
└── package.json             # Project dependencies and scripts
```

## Content Creation Process

### Adding New Chapters

1. Create a new `.mdx` file in the appropriate module/week directory:
   ```
   docs/module-0X/week-0X/your-chapter-title.mdx
   ```

2. Include the required frontmatter:
   ```md
   ---
   title: Your Chapter Title
   sidebar_label: Sidebar Label
   ---
   ```

3. Import and use the reusable components:
   ```md
   import LearningObjectives from '@site/src/components/LearningObjectives';
   import Prerequisites from '@site/src/components/Prerequisites';
   ```

4. Add learning objectives and prerequisites sections:
   ```md
   <LearningObjectives>
     <li>Learning objective 1</li>
     <li>Learning objective 2</li>
   </LearningObjectives>

   <Prerequisites>
     <li>Prerequisite 1</li>
     <li>Prerequisite 2</li>
   </Prerequisites>
   ```

### Reusable Components

- `LearningObjectives`: For listing learning objectives
- `Prerequisites`: For listing prerequisites
- Custom components can be added in `src/components/`

### Navigation

The sidebar navigation is configured in `sidebars.ts`. When adding new content:
1. Create the content file in the appropriate directory
2. Add the reference to `sidebars.ts` under the correct module/week category

## Development

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

The site is automatically deployed to GitHub Pages via the `deploy.yml` GitHub Actions workflow when changes are pushed to the `main` branch.

## Tech Stack

- **Framework**: Docusaurus v3
- **Language**: TypeScript
- **Content**: MDX
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## Contributing

1. Create your content in the appropriate module/week directory
2. Update the sidebar configuration if needed
3. Test locally with `npm start`
4. Submit a pull request

## License

This project is licensed under the MIT License.
