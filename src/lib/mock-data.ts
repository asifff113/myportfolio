/**
 * Mock/Example data for development and testing
 * This file demonstrates the structure of each content type
 * Replace with actual Firebase data in production
 */

import {
  PersonalInfo,
  SkillCategory,
  EducationItem,
  ExperienceItem,
  Project,
  Achievement,
  Certificate,
  GalleryItem,
  Hobby,
  FutureGoal,
  Testimonial,
  BlogPost,
  ContactInfo,
  PortfolioContent,
} from "./content-types";

// ============================================================================
// PERSONAL INFO
// ============================================================================

export const mockPersonalInfo: PersonalInfo = {
  id: "personal-info",
  name: "Your Name", // TODO: Replace with your name
  headline: "Aspiring Tech Generalist & Creative Leader",
  shortBio:
    "I am a 3rd-year CSE student with a startup mindset and a passion for Open Source. I thrive on exploring diverse technologies, leading collaborative teams, and turning innovative ideas into reality.",
  longBio:
    "I am currently a 3rd-year Computer Science and Engineering student driven by an insatiable curiosity for the tech world. My journey isn't defined by a single niche but by a broad spectrum of interests that fuel my growth. I am deeply passionate about Web Development, Cybersecurity, AI/ML, and Data Science, while also exploring the realms of Android Development and Competitive Programming.\n\nBeyond the code, I am an active advocate for Open Source and believe in the power of community-driven innovation. I embrace the creative and strategic sides of technology, with a keen interest in Design, Marketing, and SEO. My ambition extends beyond just engineering; I possess a strong entrepreneurial spirit and a startup mentality, constantly looking for opportunities to solve real-world problems and build scalable businesses.\n\nI believe that a healthy mind lives in a healthy body, which is why I am an avid enthusiast of both indoor and outdoor sports. This active lifestyle complements my work, keeping me energized and focused. Coupled with strong communication skills, I thrive in collaborative environments, bridging the gap between technical complexities and human understanding.\n\nI may not claim to be an expert in every field just yet, but I am a dedicated learner who loves to connect the dots between different disciplines. Whether it's contributing to open-source projects, leading a team through a hackathon, or brainstorming the next big startup idea, I am always eager to explore, learn, and create.",
  profileImageUrl: "https://placehold.co/400x400/png?text=Profile", // TODO: Add your profile image
  resumeUrl: "/api/generate-cv", // Auto-generated PDF resume
  location: "Your City, Country",
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  currentStatus: "3rd Year CSE Student",
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/yourusername",
      username: "yourusername",
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/yourusername",
      username: "yourusername",
    },
    {
      platform: "Twitter",
      url: "https://twitter.com/yourusername",
      username: "@yourusername",
    },
    {
      platform: "Email",
      url: "mailto:your.email@example.com",
    },
  ],
  updatedAt: new Date().toISOString(),
};

// ============================================================================
// SKILLS
// ============================================================================

export const mockSkillCategories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    description: "Building beautiful and responsive user interfaces",
    order: 1,
    skills: [
      { name: "React", level: 90, yearsOfExperience: 3 },
      { name: "Next.js", level: 85, yearsOfExperience: 2 },
      { name: "TypeScript", level: 88, yearsOfExperience: 2.5 },
      { name: "Tailwind CSS", level: 92, yearsOfExperience: 2 },
      { name: "HTML/CSS", level: 95, yearsOfExperience: 4 },
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "Creating robust and scalable server-side applications",
    order: 2,
    skills: [
      { name: "Node.js", level: 85, yearsOfExperience: 3 },
      { name: "Python", level: 80, yearsOfExperience: 2 },
      { name: "Express.js", level: 82, yearsOfExperience: 2.5 },
      { name: "PostgreSQL", level: 78, yearsOfExperience: 2 },
      { name: "Firebase", level: 85, yearsOfExperience: 2 },
    ],
  },
  {
    id: "tools",
    name: "Tools & Technologies",
    description: "Development tools and platforms I work with",
    order: 3,
    skills: [
      { name: "Git", level: 88, yearsOfExperience: 4 },
      { name: "VS Code", level: 95, yearsOfExperience: 4 },
      { name: "Docker", level: 70, yearsOfExperience: 1.5 },
      { name: "Vercel", level: 90, yearsOfExperience: 2 },
      { name: "Figma", level: 75, yearsOfExperience: 2 },
    ],
  },
  {
    id: "soft-skills",
    name: "Soft Skills",
    description: "Professional and interpersonal capabilities",
    order: 4,
    skills: [
      { name: "Problem Solving", level: 90 },
      { name: "Team Collaboration", level: 88 },
      { name: "Communication", level: 85 },
      { name: "Time Management", level: 87 },
      { name: "Adaptability", level: 92 },
    ],
  },
];

// ============================================================================
// EDUCATION
// ============================================================================

export const mockEducation: EducationItem[] = [
  {
    id: "edu-1",
    institution: "University Name",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startDate: "2019-09-01",
    endDate: "2023-05-31",
    description:
      "Focused on software engineering, algorithms, and web development. Completed capstone project on building a full-stack e-commerce platform.",
    grade: "3.8 GPA",
    location: "City, State",
    order: 1,
  },
  {
    id: "edu-2",
    institution: "High School Name",
    degree: "High School Diploma",
    startDate: "2015-09-01",
    endDate: "2019-06-15",
    description: "Graduated with honors. Active in computer science club.",
    grade: "4.0 GPA",
    location: "City, State",
    order: 2,
  },
];

// ============================================================================
// EXPERIENCE
// ============================================================================

export const mockExperience: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Full Stack Developer",
    company: "Tech Company",
    companyUrl: "https://techcompany.com",
    location: "Remote",
    startDate: "2023-06-01",
    isCurrent: true,
    description:
      "• Developed and maintained web applications using React, Next.js, and Node.js\n• Collaborated with design team to implement responsive UI components\n• Optimized application performance, reducing load time by 40%\n• Mentored junior developers and conducted code reviews",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    type: "Full-time",
    order: 1,
  },
  {
    id: "exp-2",
    role: "Frontend Developer Intern",
    company: "Startup Inc.",
    location: "City, State",
    startDate: "2022-06-01",
    endDate: "2022-08-31",
    description:
      "• Built responsive web interfaces using React and Tailwind CSS\n• Integrated RESTful APIs and managed state with Redux\n• Participated in daily standups and sprint planning",
    technologies: ["React", "JavaScript", "Tailwind CSS", "Redux"],
    type: "Internship",
    order: 2,
  },
];

// ============================================================================
// PROJECTS
// ============================================================================

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    summary: "A full-featured online shopping platform with payment integration",
    description:
      "Built a complete e-commerce solution with product management, shopping cart, payment processing, and order tracking. Features include user authentication, admin dashboard, and responsive design.",
    imageUrl: "https://placehold.co/600x400/png?text=E-Commerce",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://ecommerce-demo.vercel.app",
    type: "Personal",
    featured: true,
    status: "Completed",
    startDate: "2023-01-01",
    endDate: "2023-04-30",
    order: 1,
  },
  {
    id: "proj-2",
    title: "Task Management App",
    slug: "task-manager",
    summary: "Collaborative task management tool with real-time updates",
    description:
      "A productivity app for teams to manage tasks, set deadlines, and track progress. Includes real-time collaboration, file attachments, and email notifications.",
    imageUrl: "https://placehold.co/600x400/png?text=Task+Manager",
    techStack: ["React", "Firebase", "Material-UI", "Node.js"],
    githubUrl: "https://github.com/yourusername/taskmanager",
    liveUrl: "https://taskmanager-demo.vercel.app",
    type: "Practice",
    featured: true,
    status: "Maintained",
    startDate: "2023-05-01",
    order: 2,
  },
  {
    id: "proj-3",
    title: "Weather Dashboard",
    slug: "weather-dashboard",
    summary: "Interactive weather forecasting application",
    description:
      "A beautiful weather app that displays current conditions and 7-day forecasts. Features location search, favorite locations, and weather alerts.",
    imageUrl: "https://placehold.co/600x400/png?text=Weather+App",
    techStack: ["React", "TypeScript", "OpenWeather API", "Chart.js"],
    githubUrl: "https://github.com/yourusername/weather",
    liveUrl: "https://weather-demo.vercel.app",
    type: "Personal",
    status: "Completed",
    order: 3,
  },
];

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export const mockAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Hackathon Winner",
    organization: "Tech Hackathon 2023",
    date: "2023-03-15",
    description: "1st place for building an AI-powered study assistant",
    category: "Competition",
    order: 1,
  },
  {
    id: "ach-2",
    title: "Dean's List",
    organization: "University Name",
    date: "2022-12-01",
    description: "Recognized for academic excellence (4 consecutive semesters)",
    category: "Recognition",
    order: 2,
  },
  {
    id: "ach-3",
    title: "Open Source Contributor",
    organization: "Various Projects",
    date: "2023-01-01",
    description: "Active contributor to popular open source projects on GitHub",
    category: "Recognition",
    order: 3,
  },
];

// ============================================================================
// CERTIFICATES
// ============================================================================

export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    title: "AWS Certified Developer - Associate",
    issuer: "Amazon Web Services",
    issuedDate: "2023-06-15",
    fileUrl: "#",
    credentialId: "ABC123XYZ",
    credentialUrl: "https://aws.amazon.com/verification",
    skills: ["AWS", "Cloud Computing", "Lambda", "DynamoDB"],
    order: 1,
  },
  {
    id: "cert-2",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta (via Coursera)",
    issuedDate: "2022-12-20",
    fileUrl: "#",
    skills: ["React", "JavaScript", "HTML/CSS", "UI/UX"],
    order: 2,
  },
];

// ============================================================================
// GALLERY
// ============================================================================

export const mockGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Tech Conference 2023",
    description: "Speaking at the annual developer conference",
    imageUrl: "https://placehold.co/600x400/png?text=Conference",
    category: "Events",
    date: "2023-09-15",
    order: 1,
  },
  {
    id: "gal-2",
    title: "Team Hackathon",
    description: "Winning team at the company hackathon",
    imageUrl: "https://placehold.co/600x400/png?text=Hackathon",
    category: "Work",
    order: 2,
  },
  {
    id: "gal-3",
    title: "Office Workspace",
    description: "My productive coding setup",
    imageUrl: "https://placehold.co/600x400/png?text=Workspace",
    category: "Personal",
    order: 3,
  },
];

// ============================================================================
// HOBBIES
// ============================================================================

export const mockHobbies: Hobby[] = [
  {
    id: "hobby-1",
    title: "Photography",
    description:
      "Capturing moments and landscapes through my lens. Love experimenting with different styles and techniques.",
    icon: "📷",
    order: 1,
  },
  {
    id: "hobby-2",
    title: "Open Source",
    description:
      "Contributing to open source projects and building tools for the developer community.",
    icon: "💻",
    order: 2,
  },
  {
    id: "hobby-3",
    title: "Gaming",
    description:
      "Enjoy strategy games and exploring virtual worlds. Also interested in game development.",
    icon: "🎮",
    order: 3,
  },
  {
    id: "hobby-4",
    title: "Reading",
    description:
      "Love reading tech blogs, sci-fi novels, and books on personal development.",
    icon: "📚",
    order: 4,
  },
];

// ============================================================================
// FUTURE GOALS
// ============================================================================

export const mockFutureGoals: FutureGoal[] = [
  {
    id: "goal-1",
    title: "Master Cloud Architecture",
    description:
      "Gain deep expertise in cloud platforms (AWS, Azure, GCP) and become a certified solutions architect.",
    targetDate: "2025-12-31",
    category: "Technical",
    status: "in_progress",
    order: 1,
  },
  {
    id: "goal-2",
    title: "Launch a SaaS Product",
    description:
      "Build and launch a successful software-as-a-service product that solves real problems for users.",
    targetDate: "2026-06-30",
    category: "Career",
    status: "planned",
    order: 2,
  },
  {
    id: "goal-3",
    title: "Contribute to Major Open Source Projects",
    description:
      "Become a core contributor to major open source projects and give back to the community.",
    targetDate: "2027-01-01",
    category: "Personal",
    status: "in_progress",
    order: 3,
  },
  {
    id: "goal-4",
    title: "Mentor Aspiring Developers",
    description:
      "Help newcomers learn programming through mentorship programs and educational content.",
    targetDate: "2025-06-01",
    category: "Personal",
    status: "in_progress",
    order: 4,
  },
];

// ============================================================================
// TESTIMONIALS
// ============================================================================

export const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "John Doe",
    role: "Senior Developer at Tech Corp",
    company: "Tech Corp",
    quote:
      "One of the most talented developers I've worked with. Their attention to detail and problem-solving skills are exceptional.",
    rating: 5,
    date: "2023-08-15",
    order: 1,
  },
  {
    id: "test-2",
    name: "Jane Smith",
    role: "Product Manager",
    company: "Startup Inc.",
    quote:
      "A pleasure to work with! Always delivers high-quality work on time and goes above and beyond to ensure project success.",
    rating: 5,
    date: "2023-07-20",
    order: 2,
  },
  {
    id: "test-3",
    name: "Mike Johnson",
    role: "Tech Lead",
    company: "Digital Agency",
    quote:
      "Excellent communication skills and technical expertise. Made significant contributions to our team's success.",
    rating: 5,
    date: "2023-06-10",
    order: 3,
  },
];

// ============================================================================
// BLOG POSTS
// ============================================================================

export const mockBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt:
      "Learn best practices for structuring large React applications that scale with your team and business needs.",
    content:
      "Full blog post content here... (This would be markdown or HTML in production)",
    coverImageUrl: "https://placehold.co/800x400/png?text=React+Scalable",
    author: "Your Name",
    publishedDate: "2023-09-01",
    tags: ["React", "JavaScript", "Architecture", "Best Practices"],
    readTime: 8,
    published: true,
    views: 1250,
    order: 1,
  },
  {
    id: "blog-2",
    title: "TypeScript Tips for Beginners",
    slug: "typescript-tips-for-beginners",
    excerpt:
      "Getting started with TypeScript? Here are essential tips to make your journey smoother.",
    content: "Full blog post content here...",
    coverImageUrl: "https://placehold.co/800x400/png?text=TypeScript+Tips",
    author: "Your Name",
    publishedDate: "2023-08-15",
    tags: ["TypeScript", "JavaScript", "Tutorial"],
    readTime: 5,
    published: true,
    views: 890,
    order: 2,
  },
];

// ============================================================================
// CONTACT INFO
// ============================================================================

export const mockContactInfo: ContactInfo = {
  id: "contact-info",
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  location: "Your City, Country",
  availability: "Available for freelance projects and opportunities",
  preferredContactMethod: "Email",
  responseTime: "Within 24 hours",
  socialLinks: mockPersonalInfo.socialLinks,
  enableContactForm: true,
  formSuccessMessage: "Thank you for your message! I'll get back to you soon.",
  formErrorMessage: "Something went wrong. Please try again or email me directly.",
};

// ============================================================================
// COMPLETE PORTFOLIO CONTENT
// ============================================================================

export const mockPortfolioContent: PortfolioContent = {
  personalInfo: mockPersonalInfo,
  skillCategories: mockSkillCategories,
  education: mockEducation,
  experience: mockExperience,
  projects: mockProjects,
  achievements: mockAchievements,
  certificates: mockCertificates,
  gallery: mockGallery,
  hobbies: mockHobbies,
  futureGoals: mockFutureGoals,
  testimonials: mockTestimonials,
  blogPosts: mockBlogPosts,
  contactInfo: mockContactInfo,
};

