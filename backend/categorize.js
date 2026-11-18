/**
 * Category definitions and keyword weighting rules
 * Covers the 10 specified categories:
 * 1. Frontend Developer
 * 2. Backend Developer
 * 3. Full Stack Developer
 * 4. Software Developer
 * 5. Data Analyst
 * 6. Data Scientist
 * 7. UI/UX Designer
 * 8. Networking and IT Support
 * 9. Digital Marketing
 * 10. Other
 */

export const CATEGORY_DEFINITIONS = {
  "Frontend Developer": {
    keywords: [
      "react", "react.js", "reactjs", "vue", "vue.js", "vuejs", "angular", "angularjs",
      "html", "html5", "css", "css3", "sass", "scss", "tailwind", "tailwindcss",
      "bootstrap", "javascript", "typescript", "jquery", "redux", "next.js", "nextjs",
      "webpack", "vite", "responsive design", "frontend", "front-end", "web design",
      "dom manipulation", "storybook", "styled-components"
    ],
    weight: 1.0
  },
  "Backend Developer": {
    keywords: [
      "node.js", "nodejs", "express", "express.js", "nestjs", "django", "flask", "fastapi",
      "php", "laravel", "codeigniter", "symfony", "spring boot", "springboot", "java ee",
      "ruby on rails", "rails", "golang", "go lang", "asp.net", ".net core", "c# backend",
      "rest api", "restful api", "graphql", "microservices", "sql", "postgresql", "postgres",
      "mysql", "mongodb", "redis", "database design", "orm", "prisma", "hibernate"
    ],
    weight: 1.0
  },
  "Full Stack Developer": {
    keywords: [
      "full stack", "fullstack", "mern", "mean stack", "lamp stack", "jamstack",
      "frontend and backend", "client and server", "full-stack development"
    ],
    weight: 1.5
  },
  "Software Developer": {
    keywords: [
      "c++", "c#", "java", "object-oriented programming", "oop", "data structures",
      "algorithms", "system design", "git", "github", "gitlab", "ci/cd", "docker",
      "kubernetes", "software engineer", "software development", "unit testing",
      "integration testing", "agile", "scrum", "design patterns", "multithreading"
    ],
    weight: 0.9
  },
  "Data Analyst": {
    keywords: [
      "data analysis", "data analyst", "power bi", "tableau", "excel", "advanced excel",
      "sql queries", "reporting", "dashboard", "google data studio", "looker",
      "business intelligence", "bi", "data visualization", "kpi", "pivot tables",
      "vlookup", "data cleaning", "etl", "statistical analysis", "pandas"
    ],
    weight: 1.1
  },
  "Data Scientist": {
    keywords: [
      "data science", "data scientist", "machine learning", "deep learning", "nlp",
      "natural language processing", "computer vision", "tensorflow", "pytorch",
      "scikit-learn", "sklearn", "keras", "neural networks", "predictive modeling",
      "regression", "classification", "clustering", "ai", "artificial intelligence",
      "data modeling", "statistics", "python for data science", "big data", "spark", "hadoop"
    ],
    weight: 1.1
  },
  "UI/UX Designer": {
    keywords: [
      "ui", "ux", "ui/ux", "user interface", "user experience", "figma", "adobe xd",
      "sketch", "wireframe", "wireframing", "prototyping", "prototype", "user research",
      "usability testing", "design system", "information architecture", "interaction design",
      "mockups", "persona", "journey mapping", "visual design", "invision"
    ],
    weight: 1.2
  },
  "Networking and IT Support": {
    keywords: [
      "networking", "network engineer", "it support", "helpdesk", "technical support",
      "tcp/ip", "dns", "dhcp", "vpn", "cisco", "ccna", "ccnp", "firewall", "routers",
      "switches", "lan/wan", "active directory", "windows server", "linux administration",
      "system administration", "hardware troubleshooting", "desktop support", "troubleshooting"
    ],
    weight: 1.1
  },
  "Digital Marketing": {
    keywords: [
      "digital marketing", "seo", "search engine optimization", "sem", "google ads",
      "facebook ads", "meta ads", "social media marketing", "smm", "content marketing",
      "email marketing", "affiliate marketing", "google analytics", "conversion rate",
      "campaign management", "copywriting", "brand awareness", "growth hacking", "ppc"
    ],
    weight: 1.1
  }
};

/**
 * Categorizes extracted resume text
 * @param {string} rawText 
 * @returns {object} Categorization results including category, confidence, matched keywords
 */
export function categorizeResume(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length === 0) {
    return {
      category: "Other",
      confidence: 0,
      matchedKeywords: [],
      categoryScores: {}
    };
  }

  // Normalize text for word-boundary matching
  const lowerText = " " + rawText.toLowerCase().replace(/[\r\n\t]/g, " ") + " ";

  const categoryScores = {};
  const matchedByCategory = {};

  for (const [category, { keywords, weight }] of Object.entries(CATEGORY_DEFINITIONS)) {
    let score = 0;
    const matches = [];

    for (const kw of keywords) {
      // Escape special characters for regex matching
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Use boundary-safe matching
      const regex = new RegExp(`(^|[^a-zA-Z0-9#+.])${escaped}(?=[^a-zA-Z0-9#+.]|$)`, "gi");
      const count = (lowerText.match(regex) || []).length;

      if (count > 0) {
        matches.push(kw);
        // Diminishing returns for repeated mentions of the same keyword
        score += Math.min(count, 3) * 1.5;
      }
    }

    if (matches.length > 0) {
      score += matches.length * 2.0; // Bonus for breadth of relevant skill matches
    }

    categoryScores[category] = score * weight;
    matchedByCategory[category] = matches;
  }

  // Cross-category synergy:
  // If candidate has substantial frontend AND backend skill matches, boost Full Stack Developer
  const frontendScore = categoryScores["Frontend Developer"] || 0;
  const backendScore = categoryScores["Backend Developer"] || 0;
  if (frontendScore >= 5 && backendScore >= 5) {
    categoryScores["Full Stack Developer"] = (categoryScores["Full Stack Developer"] || 0) + (frontendScore + backendScore) * 0.45;
  }

  // Find top scoring category
  let bestCategory = "Other";
  let maxScore = 0;

  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  // Minimum threshold to prevent false classification on noisy text
  if (maxScore < 4.0) {
    return {
      category: "Other",
      confidence: 0,
      explanation: "Unable to find sufficient matching keywords to confidently classify this resume.",
      matchedKeywords: [],
      categoryScores
    };
  }

  // Calculate confidence percentage
  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  const confidence = Math.min(Math.round((maxScore / (totalScore || 1)) * 100) + 25, 96);

  // Collect matched keywords for the winning category + related notable skills
  const matchedKeywords = matchedByCategory[bestCategory] || [];

  return {
    category: bestCategory,
    confidence,
    matchedKeywords,
    allMatchedKeywords: matchedByCategory,
    categoryScores
  };
}
