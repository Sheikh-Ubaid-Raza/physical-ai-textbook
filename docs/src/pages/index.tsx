import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <div className={clsx(styles.heroContent)}>
              <div className={clsx(styles.heroText, styles.animateSlideInLeft)}>
                <div className={clsx(styles.heroBadge, styles.animateFloat)}>
                  <span>🤖 Advanced Robotics Curriculum</span>
                </div>
                <Heading as="h1" className={clsx(styles.heroTitle)}>
                  {siteConfig.title}
                </Heading>
                <p className={clsx(styles.heroSubtitle)}>{siteConfig.tagline}</p>
                <div className={clsx(styles.heroButtons)}>
                  <Link
                    className="button button--primary button--lg"
                    to="/docs">
                    Start Learning
                  </Link>
                </div>
              </div>
              <div className={clsx(styles.heroVisual, styles.animateSlideInRight)}>
                <div className={clsx(styles.robotIllustration)}>
                  <svg viewBox="0 0 300 300" className={clsx(styles.robotSvg, styles.animateFloat)}>
                    <defs>
                      <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9dadf6ff" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow" />
                        <feBlend in="SourceGraphic" in2="glow" mode="screen" />
                      </filter>
                    </defs>
                    <circle cx="150" cy="150" r="120" fill="url(#robotGradient)" filter="url(#glow)" opacity="0.1" />
                    <circle cx="150" cy="150" r="100" fill="url(#robotGradient)" opacity="0.2" />
                    <circle cx="150" cy="150" r="80" fill="url(#robotGradient)" opacity="0.3" />
                    <path d="M150 80 L180 120 L150 160 L120 120 Z" fill="url(#robotGradient)" />
                    <path d="M130 180 L170 180 L170 220 L130 220 Z" fill="url(#robotGradient)" opacity="0.8" />
                    <circle cx="140" cy="140" r="8" fill="white" />
                    <circle cx="160" cy="140" r="8" fill="white" />
                    <path d="M145 160 Q150 165 155 160" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function CurriculumOverview() {
  const weeks = [
    { number: 1, title: "Week 1-2", subtitle: "Physical AI Foundations", description: "Introduction to Physical AI concepts, machine learning for robotics, and foundational mathematics" },
    { number: 2, title: "Week 3-4", subtitle: "ROS 2 Architecture", description: "Robot Operating System 2 fundamentals, nodes, topics, services, and actions" },
    { number: 3, title: "Week 5-6", subtitle: "Humanoid Kinematics", description: "Forward and inverse kinematics, motion planning for humanoid robots" },
    { number: 4, title: "Week 7-8", subtitle: "Simulation Environments", description: "NVIDIA Isaac Sim, Gazebo, and Unity for robotics simulation" },
    { number: 5, title: "Week 9-10", subtitle: "Control Systems", description: "PID controllers, trajectory planning, and dynamic balance" },
    { number: 6, title: "Week 11-13", subtitle: "Advanced Applications", description: "Conversational robotics, human-robot interaction, and project development" },
  ];

  return (
    <section className={clsx(styles.features)}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <div className={clsx(styles.sectionHeader, styles.animateSlideInUp)}>
              <Heading as="h2" className={clsx(styles.sectionTitle)}>
                13-Week Comprehensive Curriculum
              </Heading>
              <p className={clsx(styles.sectionSubtitle)}>
                Master Physical AI & Humanoid Robotics through our structured learning path
              </p>
            </div>
            <div className="row">
              {weeks.map((week) => (
                <div key={week.number} className="col col--4 margin-bottom--lg">
                  <div className={clsx(styles.featureCard, styles.animateSlideInUp)}>
                    <div className={clsx(styles.featureNumber)}>
                      <span>{week.number}</span>
                    </div>
                    <Heading as="h3" className={clsx(styles.featureTitle)}>{week.title}</Heading>
                    <p className={clsx(styles.featureSubtitle)}>{week.subtitle}</p>
                    <p className={clsx(styles.featureDescription)}>{week.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdvancedFeatures() {
  const features = [
    {
      title: "Interactive Simulations",
      description: "Experience robotics in action with NVIDIA Isaac Sim and Gazebo environments",
      icon: "🎮"
    },
    {
      title: "Hands-on Projects",
      description: "Build real-world applications with humanoid robots and AI systems",
      icon: "🔧"
    },
    {
      title: "Industry Standards",
      description: "Learn with ROS 2, Python, C++, and cutting-edge robotics frameworks",
      icon: "🚀"
    }
  ];

  return (
    <section className={clsx(styles.advancedFeatures)}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--10 col--offset-1">
            <div className={clsx(styles.sectionHeader, styles.animateSlideInUp)}>
              <Heading as="h2" className={clsx(styles.sectionTitle)}>
                Advanced Learning Features
              </Heading>
              <p className={clsx(styles.sectionSubtitle)}>
                Comprehensive tools and resources to accelerate your robotics journey
              </p>
            </div>
            <div className="row">
              {features.map((feature, index) => (
                <div key={index} className="col col--4 margin-bottom--lg">
                  <div className={clsx(styles.advancedCard, styles.animateSlideInUp)}>
                    <div className={clsx(styles.featureIcon)}>
                      {feature.icon}
                    </div>
                    <Heading as="h3" className={clsx(styles.advancedTitle)}>{feature.title}</Heading>
                    <p className={clsx(styles.advancedDescription)}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "This curriculum transformed my understanding of robotics. The hands-on approach with real simulation environments is exceptional.",
      author: "Computer Science Student",
      role: "Graduate Student"
    },
    {
      quote: "The progression from basic concepts to advanced applications is perfectly structured. Highly recommended for serious learners.",
      author: "Engineering Professional",
      role: "Robotics Engineer"
    },
    {
      quote: "Best robotics textbook I've encountered. The integration of theory with practical implementation is outstanding.",
      author: "Academic Researcher",
      role: "PhD Candidate"
    }
  ];

  return (
    <section className={clsx(styles.testimonials)}>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className={clsx(styles.sectionHeader, styles.animateSlideInUp)}>
              <Heading as="h2" className={clsx(styles.sectionTitle)}>
                What Students Say
              </Heading>
              <p className={clsx(styles.sectionSubtitle)}>
                Join thousands of students mastering Physical AI & Robotics
              </p>
            </div>
            <div className={clsx(styles.testimonialSlider)}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className={clsx(styles.testimonialCard, styles.animateSlideInUp)}>
                  <div className={clsx(styles.testimonialQuote)}>
                    <span className={clsx(styles.quoteMark)}>“</span>
                    <p>{testimonial.quote}</p>
                  </div>
                  <div className={clsx(styles.testimonialAuthor)}>
                    <span className={clsx(styles.authorName)}>{testimonial.author}</span>
                    <span className={clsx(styles.authorRole)}>{testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className={clsx(styles.cta)}>
      <div className="container padding-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2 text--center">
            <Heading as="h2" className={clsx(styles.ctaTitle, styles.animateSlideInUp)}>
              Ready to Master Physical AI & Humanoid Robotics?
            </Heading>
            <p className={clsx(styles.ctaSubtitle)}>
              Start your journey with our comprehensive 13-week curriculum designed for Computer Science and Engineering students.
            </p>
            <div className={clsx(styles.ctaButtons)}>
              <Link
                className="button button--primary button--lg"
                to="/docs">
                Begin Your Learning Path
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Physical AI & Humanoid Robotics Textbook`}
      description="A comprehensive 13-week curriculum for Computer Science and Engineering students">
      <HomepageHeader />
      <main>
        <CurriculumOverview />
        <AdvancedFeatures />
        <Testimonials />
        <CallToAction />
      </main>
    </Layout>
  );
}
