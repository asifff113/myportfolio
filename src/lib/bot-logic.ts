import { PortfolioContent, Skill, Project, ExperienceItem } from "./content-types";

/**
 * Simple rule-based AI for the portfolio chatbot
 * Analyzes user input and returns relevant information from the portfolio content
 */
export function generateBotResponse(query: string, content: PortfolioContent): string {
  const lowerQuery = query.toLowerCase();

  // 1. Greetings
  if (lowerQuery.match(/^(hi|hello|hey|greetings|sup|yo)/)) {
    return `Hello! I'm ${content.personalInfo?.name || "the developer"}'s AI assistant. I can tell you about their skills, projects, experience, and more. What would you like to know?`;
  }

  // 2. Skills / Tech Stack (Prioritize over generic "about")
  if (lowerQuery.includes("skill") || lowerQuery.includes("stack") || lowerQuery.includes("technology") || lowerQuery.includes("technologies") || lowerQuery.includes("coding") || lowerQuery.includes("programming") || lowerQuery.includes("languages")) {
    const categories = content.skillCategories || [];
    
    // Safety check: Ensure categories is an array
    if (!Array.isArray(categories)) {
      return "I'm having trouble accessing my skills data right now. Please check the Skills section directly.";
    }

    // Get all skills safely
    const allSkills = categories.flatMap(cat => cat.skills || []);
    
    // 1. Try to find primary skills first
    let displaySkills = allSkills
      .filter(skill => skill && skill.isPrimary)
      .map(skill => skill.name);
    
    // 2. If no primary skills, take the top skills from the first few categories
    if (displaySkills.length === 0) {
      displaySkills = allSkills
        .slice(0, 8) // Show more skills (up to 8)
        .map(skill => skill.name);
    }

    // 3. If still no skills found
    if (displaySkills.length === 0) {
      return "I have experience with various technologies, but I can't list them right now. Please check the Skills section for the full list.";
    }
    
    const skillString = displaySkills.join(", ");
    return `My technical expertise includes: ${skillString}, and more. You can check the Skills section for a full breakdown!`;
  }

  // 3. About / Bio
  if (lowerQuery.includes("about") || lowerQuery.includes("who are you") || lowerQuery.includes("who is") || lowerQuery.includes("tell me")) {
    return content.personalInfo?.shortBio || `I am an AI assistant for ${content.personalInfo?.name || "the developer"}, a ${content.personalInfo?.headline || "developer"}.`;
  }

  // 4. Specific Skill Query (e.g., "Do you know React?")
  // We'll search through all skills
  const categories = content.skillCategories || [];
  if (Array.isArray(categories)) {
    const allSkills = categories.flatMap(cat => cat.skills || []);
    const foundSkill = allSkills.find(skill => skill && skill.name && lowerQuery.includes(skill.name.toLowerCase()));
    
    if (foundSkill) {
      return `Yes, I have experience with ${foundSkill.name}. ${foundSkill.description || ""} It's one of my ${foundSkill.isPrimary ? "primary" : "secondary"} skills.`;
    }
  }

  // 5. Projects
  if (lowerQuery.includes("project") || lowerQuery.includes("work") || lowerQuery.includes("portfolio") || lowerQuery.includes("built") || lowerQuery.includes("created") || lowerQuery.includes("developed")) {
    const projects = content.projects || [];
    if (projects.length > 0) {
      const projectNames = projects.slice(0, 5).map(p => p.title).join(", ");
      return `I've worked on several exciting projects, including: ${projectNames}. Would you like to know details about a specific one?`;
    }
    return "I have worked on various projects. Check out the Projects section for details.";
  }

  // 6. Experience / Job
  if (lowerQuery.includes("experience") || lowerQuery.includes("job") || lowerQuery.includes("company") || lowerQuery.includes("companies") || lowerQuery.includes("career") || lowerQuery.includes("history")) {
    const experience = content.experience || [];
    const latestJob = experience[0];
    if (latestJob) {
      return `Currently (or most recently), I worked as a ${latestJob.role} at ${latestJob.company}. I have ${experience.length} roles in my history. Check out the Experience section for the full timeline.`;
    }
    return "I have worked in various roles in the tech industry. Check out the Experience section for details.";
  }

  // 7. Contact
  if (lowerQuery.includes("contact") || lowerQuery.includes("email") || lowerQuery.includes("reach") || lowerQuery.includes("hire") || lowerQuery.includes("touch") || lowerQuery.includes("message")) {
    return `You can reach me at ${content.personalInfo?.email || "my email"}. I'm always open to discussing new opportunities!`;
  }

  // 8. Location
  if (lowerQuery.includes("location") || lowerQuery.includes("where are you") || lowerQuery.includes("live")) {
    return `I am currently based in ${content.personalInfo?.location || "an undisclosed location"}.`;
  }

  // 9. Education
  if (lowerQuery.includes("education") || lowerQuery.includes("study") || lowerQuery.includes("university") || lowerQuery.includes("college") || lowerQuery.includes("degree") || lowerQuery.includes("qualification") || lowerQuery.includes("background") || lowerQuery.includes("school")) {
    if (content.education && content.education.length > 0) {
      const latest = content.education[0];
      return `I studied ${latest.degree} at ${latest.institution}. You can see my full academic background in the Education section.`;
    }
    return "I have a background in computer science and technology. Check out the Education section for details.";
  }

  // 10. Certifications
  if (lowerQuery.includes("certificate") || lowerQuery.includes("certification") || lowerQuery.includes("certified")) {
    if (content.certificates && content.certificates.length > 0) {
      const certNames = content.certificates.slice(0, 3).map(c => c.title).join(", ");
      return `I hold certifications in: ${certNames}. Check the Certificates section to see them all!`;
    }
    return "I am constantly learning and upgrading my skills. Check the Certificates section for my credentials.";
  }

  // 11. Achievements / Awards
  if (lowerQuery.includes("achievement") || lowerQuery.includes("award") || lowerQuery.includes("winning") || lowerQuery.includes("won")) {
    if (content.achievements && content.achievements.length > 0) {
      const topAchievement = content.achievements[0];
      return `One of my proudest achievements is: ${topAchievement.title}. I have listed more in the Achievements section.`;
    }
    return "I strive for excellence in my work. You can view my accomplishments in the Achievements section.";
  }

  // 12. Hobbies / Interests
  if (lowerQuery.includes("hobby") || lowerQuery.includes("hobbies") || lowerQuery.includes("fun") || lowerQuery.includes("interest") || lowerQuery.includes("free time")) {
    if (content.hobbies && content.hobbies.length > 0) {
      const hobbyNames = content.hobbies.map(h => h.title).join(", ");
      return `When I'm not coding, I enjoy: ${hobbyNames}.`;
    }
    return "I enjoy exploring new technologies and creative pursuits in my free time.";
  }

  // 13. Blog / Writing
  if (lowerQuery.includes("blog") || lowerQuery.includes("article") || lowerQuery.includes("write") || lowerQuery.includes("writing") || lowerQuery.includes("post")) {
    if (content.blogPosts && content.blogPosts.length > 0) {
      const latestPost = content.blogPosts[0];
      return `Yes, I write about tech! My latest post is titled "${latestPost.title}". You can read it in the Blog section.`;
    }
    return "I haven't published any blog posts yet, but stay tuned!";
  }

  // 14. Social Media
  if (lowerQuery.includes("github") || lowerQuery.includes("linkedin") || lowerQuery.includes("twitter") || lowerQuery.includes("social") || lowerQuery.includes("instagram")) {
    if (content.personalInfo?.socialLinks && content.personalInfo.socialLinks.length > 0) {
      const platforms = content.personalInfo.socialLinks.map(l => l.platform).join(", ");
      return `You can find me on: ${platforms}. The links are in the Hero section and Footer.`;
    }
    return "You can find my social media links in the contact section.";
  }

  // 15. Resume / CV
  if (lowerQuery.includes("resume") || lowerQuery.includes("cv") || lowerQuery.includes("download")) {
    if (content.personalInfo?.resumeUrl) {
      return "Yes, you can download my Resume/CV from the Hero section at the top of the page.";
    }
    return "My resume is available upon request. Please contact me via email.";
  }

  // 16. Testimonials
  if (lowerQuery.includes("testimonial") || lowerQuery.includes("reference") || lowerQuery.includes("recommendation") || lowerQuery.includes("review")) {
    if (content.testimonials && content.testimonials.length > 0) {
      return `I have received ${content.testimonials.length} testimonials from colleagues and clients. You can read them in the Testimonials section.`;
    }
    return "I value feedback from my peers and clients. Check out the Testimonials section.";
  }

  // 17. Future Goals
  if (lowerQuery.includes("goal") || lowerQuery.includes("future") || lowerQuery.includes("plan") || lowerQuery.includes("aim")) {
    if (content.futureGoals && content.futureGoals.length > 0) {
      const nextGoal = content.futureGoals[0];
      return `I am currently working towards: ${nextGoal.title}. Check the Goals section to see my roadmap!`;
    }
    return "I am always setting new goals for my professional growth.";
  }

  // Default fallback
  return "That's an interesting question! While I'm just a simple AI, you can find more detailed information by exploring the different sections of this portfolio. Try asking about my skills, projects, or experience!";
}
