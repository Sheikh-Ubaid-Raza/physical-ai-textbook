import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Bridging the gap between the digital brain and the physical body',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://sheikh-ubaid-raza.github.io',
  baseUrl: '/physical-ai-textbook/',

  organizationName: 'Sheikh-Ubaid-Raza',
  projectName: 'physical-ai-and-humanoid-robotics',

  markdown: {
  hooks: {
    onBrokenMarkdownLinks: 'warn',
   },
 },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://ai-rative-book-backend-production.up.railway.app',
    apiKey: process.env.REACT_APP_API_KEY || '',
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true, // We handle this in user profile dropdown
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI Textbook',
      logo: {
        alt: 'Physical AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Book',
        },
        {
          href: 'https://github.com/Sheikh-Ubaid-Raza/Physical-AI-and-Humanoid-Robotics',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'Modules',
          position: 'left',
          items: [
            {
              label: 'Module 1: ROS 2 Fundamentals',
              to: '/docs/module1/week1-intro-physical-ai',
            },
            {
              label: 'Module 2: Gazebo Simulation',
              to: '/docs/module2/week6-gazebo',
            },
            {
              label: 'Module 3: NVIDIA Isaac',
              to: '/docs/module3/week8-isaac',
            },
            {
              label: 'Module 4: Conversational Robotics',
              to: '/docs/module4/week13-conversational-robotics',
            },
          ],
        },
      ],
      
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course',
          items: [
            {
              label: 'Introduction',
              to: '/docs',
            },
            {
              label: 'Module 1: ROS 2',
              to: '/docs/module1/week1-intro-physical-ai',
            },
            {
              label: 'Module 2: Simulation',
              to: '/docs/module2/week6-gazebo',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'AgentiousAI Website',
              href: 'https://agentiousai.vercel.app/',
            },
            {
              label: 'AgentiousAI LinkedIn',
              href: 'https://www.linkedin.com/company/agentiousai',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Sheikh-Ubaid-Raza/physical-ai-textbook',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook. Built for learners.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
