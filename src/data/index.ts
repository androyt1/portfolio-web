export interface Project {
  id: string;
  title: string;
  cat: string;
  year: string;
  desc: string;
  tags: string[];
  color: string;
  link: string;
  /**
   * Unsplash permanent URL — no API key needed.
   * Format: https://images.unsplash.com/photo-{ID}?w=900&q=80&auto=format&fit=crop
   * Each ID was hand-picked to match the project's visual context.
   */
  image: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Pidgin Debt Tracker",
    cat: "Mobile · AI · Nigeria",
    year: "2024",
    desc: "AI-powered finance app for Nigerian market women — Pidgin English voice recognition via fine-tuned Whisper, OCR receipt scanning, biometric auth, and a banking-grade UI built with React Native + Supabase.",
    tags: ["React Native", "TypeScript", "Supabase", "Whisper AI", "Gemini"],
    color: "#E84B1A",
    link: "https://github.com/andrewdev/pidgin-debt-tracker",
    // Hand holding phone — mobile finance / payments feel
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "AI Kanban Board",
    cat: "Web · Fullstack",
    year: "2024",
    desc: "Intelligent task management powered by OpenAI. Natural language task creation, auto-categorisation, and smart prioritisation with real-time Supabase sync.",
    tags: ["React", "Tailwind CSS", "OpenAI API", "Supabase"],
    color: "#94D82D",
    link: "https://github.com/andrewdev/ai-kanban",
    // Colourful code on monitor — dev / AI tooling
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Photo Reel",
    cat: "Mobile · Video Export",
    year: "2024",
    desc: "Animated slideshow app that exports MP4 videos for WhatsApp Status. Smooth Reanimated 2 transitions and FFmpeg-powered rendering optimised for everyday African mobile users.",
    tags: ["React Native", "FFmpeg", "Reanimated 2", "TypeScript"],
    color: "#4FACF7",
    link: "https://github.com/andrewdev/photo-reel",
    // Camera / video production — creative media
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "E-Commerce Developer",
    cat: "Enterprise · Fintech",
    year: "2022–23",
    desc: "Led frontend development of a high-traffic e-commerce platforms — scalable component libraries, Core Web Vitals optimisation, and feature delivery at scale for millions of users.",
    tags: ["React", "TypeScript", "AWS", "Micro-frontends"],
    color: "#F7C948",
    link: "https://github.com/andrewdev",
    // Laptop on clean desk — enterprise / professional
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=80&auto=format&fit=crop",
  },
];

export const SKILLS: SkillGroup[] = [
  {
    label: "Frontend",
    items: [
      "React",
      "TypeScript",
      "Next.js 15",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "React Native",
    ],
  },
  {
    label: "AI / ML",
    items: [
      "LangChain",
      "LangGraph",
      "RAG Systems",
      "OpenAI API",
      "Fine-tuning",
      "scikit-learn",
      "Python",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Supabase",
      "AWS Lambda",
      "DynamoDB",
      "API Gateway",
      "PostgreSQL",
    ],
  },
  {
    label: "Tools",
    items: ["AWS CDK", "Figma", "Git", "Docker", "Vercel", "FFmpeg"],
  },
];

export const MARQUEE_ITEMS: string[] = [
  "React",
  "TypeScript",
  "LangChain",
  "Python",
  "AWS",
  "RAG Systems",
  "Next.js",
  "Supabase",
  "LangGraph",
  "React Native",
  "Node.js",
  "GSAP",
  "Tailwind CSS",
  "OpenAI",
];

/**
 * Contact section background — London city / architecture aerial shot
 * Unsplash photo by Benjamin Davies (free to use)
 */
export const LONDON_IMAGE =
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1400&q=75&auto=format&fit=crop";
