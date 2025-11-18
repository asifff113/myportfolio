-- Import Mock Data into Supabase
-- Run this AFTER running supabase-rls-fix.sql
-- This will populate your database with the mock data from your website

-- First, make sure admin user exists (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE email = 'roosvermeulen4690@gmail.com') THEN
    INSERT INTO admins (email, role) VALUES ('roosvermeulen4690@gmail.com', 'super_admin');
  END IF;
END $$;

-- Personal Info (singleton table - only one record)
INSERT INTO personal_info (
  name, headline, short_bio, long_bio, profile_image_url, resume_url,
  location, email, phone, current_status, social_links
) VALUES (
  'Your Name',
  'Full Stack Developer & Creative Problem Solver',
  'I''m a passionate developer who loves building beautiful, functional web applications. With expertise in modern web technologies, I create solutions that make a difference.',
  'I''m a full-stack developer with a passion for creating elegant solutions to complex problems. My journey in tech started with curiosity and has evolved into a career focused on building impactful applications.

I specialize in modern web technologies including React, Next.js, TypeScript, and Node.js. I believe in writing clean, maintainable code and creating user experiences that delight.

When I''m not coding, you''ll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.',
  '/images/profile.jpg',
  '/resume.pdf',
  'Your City, Country',
  'your.email@example.com',
  '+1 (555) 123-4567',
  'Open to opportunities',
  '[
    {"platform": "GitHub", "url": "https://github.com/yourusername", "username": "yourusername"},
    {"platform": "LinkedIn", "url": "https://linkedin.com/in/yourusername", "username": "yourusername"},
    {"platform": "Twitter", "url": "https://twitter.com/yourusername", "username": "@yourusername"},
    {"platform": "Email", "url": "mailto:your.email@example.com"}
  ]'::jsonb
);

-- Skills (multiple records - grouped by category in the UI)
INSERT INTO skills (category, name, level, "order") VALUES
  ('Frontend Development', 'React', 90, 1),
  ('Frontend Development', 'Next.js', 85, 2),
  ('Frontend Development', 'TypeScript', 88, 3),
  ('Frontend Development', 'Tailwind CSS', 92, 4),
  ('Frontend Development', 'HTML/CSS', 95, 5),
  ('Backend Development', 'Node.js', 85, 6),
  ('Backend Development', 'Python', 80, 7),
  ('Backend Development', 'Express.js', 82, 8),
  ('Backend Development', 'PostgreSQL', 78, 9),
  ('Backend Development', 'Firebase', 85, 10),
  ('Tools & Technologies', 'Git', 88, 11),
  ('Tools & Technologies', 'VS Code', 95, 12),
  ('Tools & Technologies', 'Docker', 70, 13),
  ('Tools & Technologies', 'Vercel', 90, 14),
  ('Tools & Technologies', 'Figma', 75, 15),
  ('Soft Skills', 'Problem Solving', 90, 16),
  ('Soft Skills', 'Team Collaboration', 88, 17),
  ('Soft Skills', 'Communication', 85, 18),
  ('Soft Skills', 'Time Management', 87, 19),
  ('Soft Skills', 'Adaptability', 92, 20);

-- Education
INSERT INTO education (institution, degree, field, start_date, end_date, description, grade, achievements, "order") VALUES
  ('University Name', 'Bachelor of Science', 'Computer Science', '2019-09-01', '2023-05-31', 
   'Focused on software engineering, algorithms, and web development. Completed capstone project on building a full-stack e-commerce platform.', 
   '3.8 GPA', ARRAY['Capstone Project: E-commerce Platform', 'Dean''s List 2022'], 1),
  ('High School Name', 'High School Diploma', 'General Studies', '2015-09-01', '2019-06-15', 
   'Graduated with honors. Active in computer science club.', 
   '4.0 GPA', ARRAY['Valedictorian', 'Computer Science Club President'], 2);

-- Experience
INSERT INTO experience (company, position, start_date, end_date, description, responsibilities, technologies, "order") VALUES
  ('Tech Company', 'Full Stack Developer', '2023-06-01', NULL,
   'Developing and maintaining web applications using modern tech stack.',
   ARRAY['Developed web applications using React and Next.js', 'Collaborated with design team on UI components', 'Optimized application performance by 40%', 'Mentored junior developers'],
   ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'], 1),
  ('Startup Inc.', 'Frontend Developer Intern', '2022-06-01', '2022-08-31',
   'Built responsive web interfaces and integrated APIs.',
   ARRAY['Built responsive UI with React and Tailwind CSS', 'Integrated RESTful APIs', 'Managed state with Redux', 'Participated in agile development'],
   ARRAY['React', 'JavaScript', 'Tailwind CSS', 'Redux'], 2);

-- Projects
INSERT INTO projects (title, description, long_description, image_url, technologies, category, github_url, demo_url, featured, "order") VALUES
  ('E-Commerce Platform',
   'A full-featured online shopping platform with payment integration',
   'Built a complete e-commerce solution with product management, shopping cart, payment processing, and order tracking. Features include user authentication, admin dashboard, and responsive design.',
   '/images/projects/ecommerce.jpg',
   ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
   'Web Development',
   'https://github.com/yourusername/ecommerce',
   'https://ecommerce-demo.vercel.app',
   true, 1),
  ('Task Management App',
   'Collaborative task management tool with real-time updates',
   'A productivity app for teams to manage tasks, set deadlines, and track progress. Includes real-time collaboration, file attachments, and email notifications.',
   '/images/projects/taskmanager.jpg',
   ARRAY['React', 'Firebase', 'Material-UI', 'Node.js'],
   'Web Development',
   'https://github.com/yourusername/taskmanager',
   'https://taskmanager-demo.vercel.app',
   true, 2),
  ('Weather Dashboard',
   'Interactive weather forecasting application',
   'A beautiful weather app that displays current conditions and 7-day forecasts. Features location search, favorite locations, and weather alerts.',
   '/images/projects/weather.jpg',
   ARRAY['React', 'TypeScript', 'OpenWeather API', 'Chart.js'],
   'Web Development',
   'https://github.com/yourusername/weather',
   'https://weather-demo.vercel.app',
   false, 3);

-- Achievements
INSERT INTO achievements (title, description, date, icon, category, "order") VALUES
  ('Hackathon Winner', '1st place at Tech Hackathon 2023 for building an AI-powered study assistant', '2023-03-15', '🏆', 'Competition', 1),
  ('Dean''s List', 'Recognized for academic excellence (4 consecutive semesters)', '2022-12-01', '🎓', 'Academic', 2),
  ('Open Source Contributor', 'Active contributor to popular open source projects on GitHub', '2023-01-01', '💻', 'Community', 3);

-- Certificates
INSERT INTO certificates (title, issuer, date, image_url, credential_url, "order") VALUES
  ('AWS Certified Developer - Associate', 'Amazon Web Services', '2023-06-15', '/certificates/aws-cert.pdf', 
   'https://aws.amazon.com/verification', 1),
  ('Meta Front-End Developer Professional Certificate', 'Meta (via Coursera)', '2022-12-20', '/certificates/meta-cert.pdf',
   'https://coursera.org/verify/certificate', 2);

-- Gallery
INSERT INTO gallery (title, description, image_url, category, "order") VALUES
  ('Tech Conference 2023', 'Speaking at the annual developer conference', '/images/gallery/conference.jpg', 'Events', 1),
  ('Team Hackathon', 'Winning team at the company hackathon', '/images/gallery/hackathon.jpg', 'Work', 2),
  ('Office Workspace', 'My productive coding setup', '/images/gallery/workspace.jpg', 'Personal', 3);

-- Hobbies
INSERT INTO hobbies (name, description, icon, "order") VALUES
  ('Photography', 'Capturing moments and landscapes through my lens. Love experimenting with different styles and techniques.', '📷', 1),
  ('Open Source', 'Contributing to open source projects and building tools for the developer community.', '💻', 2),
  ('Gaming', 'Enjoy strategy games and exploring virtual worlds. Also interested in game development.', '🎮', 3),
  ('Reading', 'Love reading tech blogs, sci-fi novels, and books on personal development.', '📚', 4);

-- Future Goals
INSERT INTO future_goals (title, description, target_date, category, status, "order") VALUES
  ('Master Cloud Architecture', 
   'Gain deep expertise in cloud platforms (AWS, Azure, GCP) and become a certified solutions architect.',
   '2025-12-31', 'Technical', 'in_progress', 1),
  ('Launch a SaaS Product',
   'Build and launch a successful software-as-a-service product that solves real problems for users.',
   '2027-06-30', 'Career', 'planned', 2),
  ('Contribute to Major Open Source Projects',
   'Become a core contributor to major open source projects and give back to the community.',
   '2030-12-31', 'Personal', 'in_progress', 3),
  ('Mentor Aspiring Developers',
   'Help newcomers learn programming through mentorship programs and educational content.',
   NULL, 'Personal', 'in_progress', 4);

-- Testimonials
INSERT INTO testimonials (name, position, company, content, rating, "order") VALUES
  ('John Doe', 'Senior Developer', 'Tech Corp',
   'One of the most talented developers I''ve worked with. Their attention to detail and problem-solving skills are exceptional.',
   5, 1),
  ('Jane Smith', 'Product Manager', 'Startup Inc.',
   'A pleasure to work with! Always delivers high-quality work on time and goes above and beyond to ensure project success.',
   5, 2),
  ('Mike Johnson', 'Tech Lead', 'Digital Agency',
   'Excellent communication skills and technical expertise. Made significant contributions to our team''s success.',
   5, 3);

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image_url, author, published_at, tags, published) VALUES
  ('Building Scalable React Applications', 'building-scalable-react-applications',
   'Learn best practices for structuring large React applications that scale with your team and business needs.',
   'Full blog post content here... (This would be markdown or HTML in production)',
   '/images/blog/react-scalable.jpg', 'Your Name', '2023-09-01',
   ARRAY['React', 'JavaScript', 'Architecture', 'Best Practices'], true),
  ('TypeScript Tips for Beginners', 'typescript-tips-for-beginners',
   'Getting started with TypeScript? Here are essential tips to make your journey smoother.',
   'Full blog post content here...',
   '/images/blog/typescript-tips.jpg', 'Your Name', '2023-08-15',
   ARRAY['TypeScript', 'JavaScript', 'Tutorial'], true);

-- Contact Info
INSERT INTO contact_info (
  email, phone, address, availability, social_links
) VALUES (
  'your.email@example.com',
  '+1 (555) 123-4567',
  'Your City, Country',
  'Available for freelance projects and opportunities',
  '[
    {"platform": "GitHub", "url": "https://github.com/yourusername", "username": "yourusername"},
    {"platform": "LinkedIn", "url": "https://linkedin.com/in/yourusername", "username": "yourusername"},
    {"platform": "Twitter", "url": "https://twitter.com/yourusername", "username": "@yourusername"},
    {"platform": "Email", "url": "mailto:your.email@example.com"}
  ]'::jsonb
);
