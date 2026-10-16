/**
 * ============================================================================
 * SHIVAKANT KURMI — PORTFOLIO MASTER DATA REFERENCE
 * All verified links, personal details, skills, and 12 projects
 * Compatible with both standalone file:// execution and module bundlers
 * ============================================================================
 */

(function(global) {
  'use strict';

  const PERSONAL_INFO = {
    name: "Shivakant Kurmi",
    role: "Computer Science Engineer (Gaming Technology)",
    subtitle: "Full-Stack Engineer • Game Developer • AI Systems Builder",
    email: "shivakantkurmi49@gmail.com",
    phone: "+91 7067103207",
    phoneFormatted: "+91 7067103207",
    location: "Damoh, Madhya Pradesh, India",
    university: "Vellore Institute of Technology (VIT Bhopal), MP",
    degree: "B.Tech, Computer Science & Engineering (Gaming Technology)",
    cgpa: "9.83 / 10.0",
    duration: "2023 – 2027",
    scholarship: "Selected for prestigious STARS Scheme (Academic Excellence)",
    bio: "Computer Science & Gaming Technology undergraduate at VIT Bhopal with a 9.83 CGPA, selected for the prestigious STARS Scheme. Conquered 1000+ problems on LeetCode (Knight Badge, Global Rank: 22,987, Top 5% globally) and 1000+ problems on GeeksforGeeks (Institute Rank 4/3856), with 5★ in C++ on HackerRank. Experienced in architecting scalable full-stack applications (MERN, PostgreSQL), cloud-ready systems (AWS Certified Cloud Practitioner), 3D games (Unity & C#), and Generative AI pipelines (Gemini API, RAG, FAISS)."
  };

  const SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/shivakant-kurmi-15339428a",
    github: "https://github.com/shivakantkurmi",
    email: "mailto:shivakantkurmi49@gmail.com",
    phone: "tel:+917067103207",
    resumePdf: "Shivakant_Kurmi_Resume.pdf",
    portfolioRepo: "https://github.com/shivakantkurmi/Portfolio"
  };

  const CODING_PROFILES = [
    {
      platform: "LeetCode",
      badge: "Knight Badge",
      stat: "Global Rank: 22,987 | 1000+ Solved",
      rank: "22,987",
      solved: "1000+",
      percentile: "Top 5% Worldwide",
      color: "#ffa116",
      url: "https://leetcode.com/u/Shivakant_kurmi/"
    },
    {
      platform: "GeeksforGeeks",
      badge: "Institute Rank 4",
      stat: "Institute Rank: 4 / 3856 | 1000+ Solved",
      rank: "4 / 3856",
      solved: "1000+",
      percentile: "Campus Top Ranker",
      color: "#2f8d46",
      url: "https://www.geeksforgeeks.org/user/shivakant_kurmi_23bcg10140/"
    },
    {
      platform: "HackerRank",
      badge: "5★ C++",
      stat: "5-Star Gold in C++ & Problem Solving",
      rank: "5-Star Gold",
      solved: "Problem Solving",
      percentile: "Gold Tier",
      color: "#00ea64",
      url: "https://www.hackerrank.com/profile/shivakantkurmi49"
    }
  ];

  const STATS_METRICS = [
    { metric: "12+", label: "PROJECTS BUILT", sub: "Web, Games, AR & AI" },
    { metric: "22,987", label: "LEETCODE GLOBAL RANK", sub: "Knight Badge • 1000+ Solved" },
    { metric: "4 / 3856", label: "GFG INSTITUTE RANK", sub: "1000+ Problems Solved" },
    { metric: "9.83", label: "CGPA / 10.0", sub: "VIT Bhopal STARS Scholar" }
  ];

  const SKILLS_LIST = [
    { name: "C++", cat: "PROGRAMMING", icon: "⚡", desc: "STL architecture, memory management, algorithms, and 1000+ competitive programming trials conquered.", app: "Competitive Programming (5★ HackerRank, Knight LeetCode)" },
    { name: "JavaScript", cat: "PROGRAMMING", icon: "🌐", desc: "ES6+ asynchronous architecture, event-driven reactive logic, and WebGL 3D canvas rendering.", app: "Full-Stack Web Platforms & 3D Interactive Interfaces" },
    { name: "Python", cat: "PROGRAMMING", icon: "🐍", desc: "Primary language for ML automation, OpenCV computer vision, FAISS vector search, and Gemini API pipelines.", app: "EduMentor AI, Automated Attendance System" },
    { name: "C#", cat: "GAME DEV", icon: "🎯", desc: "Clean object-oriented gameplay architecture, state machines, coroutines, and Unity engine scripting.", app: "Survival Arena, Pew Pew Waves, Speedway Saga" },
    { name: "React JS", cat: "FULL STACK", icon: "⚛️", desc: "Component architecture, custom hooks, virtual DOM optimization, state management, and high-performance UI.", app: "CloudFlow, Fix-It-Now, My-Campus, Expense Tracker" },
    { name: "Node JS", cat: "FULL STACK", icon: "🟢", desc: "Scalable asynchronous backends, RESTful microservices, WebSocket event streaming, and secure auth.", app: "CloudFlow, Fix-It-Now, My-Campus, Quest-Forge" },
    { name: "Express JS", cat: "FULL STACK", icon: "🚀", desc: "Modular API routing, middleware pipelines, JWT auth tokens, and secure rate-limited endpoints.", app: "MERN Stack Platforms" },
    { name: "MongoDB", cat: "FULL STACK", icon: "🍃", desc: "NoSQL document modeling, indexing, aggregation pipelines, and high-availability cloud persistence.", app: "Fix-It-Now, My-Campus, AI Expense Tracker" },
    { name: "PostgreSQL", cat: "FULL STACK", icon: "🐘", desc: "ACID-compliant relational database modeling, foreign keys, complex joins, and query optimization.", app: "CloudFlow Project Management" },
    { name: "Socket.IO", cat: "FULL STACK", icon: "🔄", desc: "Real-time bidirectional event-based communication for live chats, task updates, and notifications.", app: "CloudFlow Real-time Collaboration" },
    { name: "Tailwind CSS", cat: "FRONTEND", icon: "🎨", desc: "Utility-first CSS framework for clean, responsive, mobile-first design and modern component styling.", app: "My-Campus, EduMentor AI" },
    { name: "HTML 5", cat: "FRONTEND", icon: "📄", desc: "Semantic structure, responsive layouts, Canvas 2D/3D APIs, and web accessibility standards.", app: "All Web Applications" },
    { name: "CSS 3", cat: "FRONTEND", icon: "✨", desc: "Custom properties, flexbox/grid architectures, 3D perspective transforms, animations, and glassmorphism.", app: "All Web & Spatial Interfaces" },
    { name: "Unity", cat: "GAME DEV", icon: "🎮", desc: "3D physics engines, dynamic NavMesh AI, weapon systems, player controllers, and cross-platform compilation.", app: "Survival Arena, Pew Pew Waves, Speedway Saga" },
    { name: "Vuforia (AR)", cat: "AR / XR", icon: "👓", desc: "Augmented Reality tracking, image target recognition, and interactive 3D spatial projections.", app: "AR Anatomy, AR Solar System Simulation" },
    { name: "Game Design", cat: "GAME DEV", icon: "🕹️", desc: "Gameplay loop design, combat mechanics, difficulty balancing, and level flow design.", app: "Action FPS & Arcade Games" },
    { name: "Generative AI", cat: "AI / ML", icon: "🧠", desc: "Prompt engineering, Gemini 1.5 Flash API integration, LLM agent workflows, and contextual grounding.", app: "EduMentor AI (Microsoft & AICTE Internship)" },
    { name: "RAG & FAISS", cat: "AI / ML", icon: "🔍", desc: "Retrieval-Augmented Generation, dense vector similarity search, and semantic knowledge retrieval.", app: "EduMentor AI, Fix-It-Now AI Assistant" },
    { name: "OpenCV & ML", cat: "AI / ML", icon: "👁️", desc: "Computer vision image processing, Haar cascades, facial recognition (93% accuracy), and ML classification.", app: "Automated Attendance System, Fix-It-Now ML" },
    { name: "AWS Cloud", cat: "CLOUD / TOOLS", icon: "☁️", desc: "AWS Certified Cloud Practitioner: EC2, RDS, S3, CloudFront, Load Balancer, and VPC architectures.", app: "CloudFlow AWS Deployment" },
    { name: "Git & GitHub", cat: "CLOUD / TOOLS", icon: "🐙", desc: "Distributed version control, branching strategies, code reviews, and open-source collaboration.", app: "All 12 Production Repositories" },
    { name: "REST APIs", cat: "CLOUD / TOOLS", icon: "🔗", desc: "Standardized JSON contracts, HTTP verbs, secure status codes, and API documentation.", app: "All Full-Stack Microservices" },
    { name: "Canva", cat: "DESIGN / TOOLS", icon: "📐", desc: "UI wireframing, presentation deck creation, graphics production, and visual branding.", app: "UI/UX & Project Presentations" }
  ];

  const PROJECTS_LIST = [
    {
      id: "cloudflow",
      num: "01",
      name: "CloudFlow",
      subtitle: "Project Management Platform",
      category: "WEB / FULL-STACK",
      icon: "☁️",
      desc: "Unified project management platform with Kanban boards, role-based access control (RBAC), real-time Socket.IO comments, drag-and-drop tasks, and AWS-ready architecture (EC2, RDS, S3, CloudFront, Load Balancer).",
      tech: ["React", "Node.js", "PostgreSQL", "AWS", "Socket.IO"],
      github: "https://github.com/shivakantkurmi/CloudFlow",
      live: "",
      liveStatus: "In Development"
    },
    {
      id: "fixitnow",
      num: "02",
      name: "Fix-It-Now",
      subtitle: "Civic Issue Reporting Platform",
      category: "WEB / FULL-STACK",
      icon: "🛠️",
      desc: "MERN-based grievance resolution portal featuring ML complaint prioritization, RAG-based AI assistant, admin dashboard with heatmaps, and secure rate-limited APIs.",
      tech: ["React", "Node.js", "MongoDB", "ML", "RAG AI"],
      github: "https://github.com/shivakantkurmi/Fix-It-Now",
      live: "https://fix-it-now-six.vercel.app/",
      liveStatus: "Live Demo"
    },
    {
      id: "mycampus",
      num: "03",
      name: "My-Campus",
      subtitle: "Campus Life Management Platform",
      category: "WEB / FULL-STACK",
      icon: "🏫",
      desc: "Campus platform with RBAC for 150+ users (Student/Faculty/Admin), QR Attendance, Notes Sharing, and Faculty Search (300+ records). Reduced attendance time by 66%, DB latency by 60%.",
      tech: ["React", "Express.js", "Tailwind CSS", "MongoDB"],
      github: "https://github.com/shivakantkurmi/My-Campus",
      live: "https://my-campus-frontend.vercel.app",
      liveStatus: "Live Demo"
    },
    {
      id: "questforge",
      num: "04",
      name: "Quest-Forge",
      subtitle: "Gamified Learning Platform",
      category: "WEB / FULL-STACK",
      icon: "⚔️",
      desc: "Gamified full-stack platform where developers solve coding challenges, complete technical learning modules, and practice AI-powered mock interviews — built with a dark-fantasy RPG aesthetic.",
      tech: ["React", "Node.js", "AI", "Express"],
      github: "https://github.com/shivakantkurmi/QuestForge",
      live: "",
      liveStatus: "In Development"
    },
    {
      id: "edumentor",
      num: "05",
      name: "EduMentor AI",
      subtitle: "AI Study Tool & Mentorship Platform",
      category: "AI / ML",
      icon: "🎓",
      desc: "Personalized AI study tool developed during a national AI internship under Microsoft & AICTE. Built using RAG, FAISS vector search, and Gemini 1.5 Flash API to generate custom study plans, quizzes, and learning materials.",
      tech: ["React", "Gemini 1.5 Flash API", "Tailwind CSS", "FAISS", "RAG"],
      github: "https://github.com/shivakantkurmi/Edumentor-AI",
      live: "",
      liveStatus: "In Development"
    },
    {
      id: "expense",
      num: "06",
      name: "AI Expense Tracker",
      subtitle: "Personal Finance & Analytics App",
      category: "WEB / FULL-STACK",
      icon: "📊",
      desc: "Full-stack MERN app for personal finance management with AI-powered insights, automatic transaction categorization, and Chart.js data visualizations.",
      tech: ["React", "MongoDB", "Express.js", "Chart.js"],
      github: "https://github.com/shivakantkurmi/AI-Expense-Tracker",
      live: "https://ai-expense-tracker-frontend.vercel.app/",
      liveStatus: "Live Demo"
    },
    {
      id: "survivalarena",
      num: "07",
      name: "Survival Arena: Cyborg Showdown",
      subtitle: "FPS Action Game",
      category: "GAME DEVELOPMENT",
      icon: "🤖",
      desc: "First-person action shooter in Unity with dynamic enemy AI, health and weapon inventory system, and NavMesh-based tactical pathfinding.",
      tech: ["Unity", "C#", "Game Dev", "NavMesh"],
      github: "https://github.com/shivakantkurmi/Survival-Arena---Cyborg-Showdown.git",
      live: "",
      liveStatus: "Repo Available"
    },
    {
      id: "pewpewwaves",
      num: "08",
      name: "Pew Pew Waves",
      subtitle: "Low-Poly FPS Game",
      category: "GAME DEVELOPMENT",
      icon: "🔫",
      desc: "Low-poly first-person shooter with four distinct maps: Adventure, City, Practice Area, and Warland, featuring wave-based combat mechanics.",
      tech: ["Unity", "Game Dev", "C#"],
      github: "https://github.com/shivakantkurmi/Pew-Pew-Waves",
      live: "",
      liveStatus: "Repo Available"
    },
    {
      id: "speedwaysaga",
      num: "09",
      name: "Speedway Saga",
      subtitle: "Android Dodge Game",
      category: "GAME DEVELOPMENT",
      icon: "🏎️",
      desc: "Fast-paced Android game — dodge traffic and collect diamonds on a never-ending highway with responsive mobile touch controls.",
      tech: ["Unity", "Android", "Game Dev", "C#"],
      github: "https://github.com/shivakantkurmi/Speedway-Saga",
      live: "",
      liveStatus: "Repo Available"
    },
    {
      id: "aranatomy",
      num: "10",
      name: "AR Anatomy",
      subtitle: "Educational Augmented Reality App",
      category: "AUGMENTED REALITY",
      icon: "🫀",
      desc: "AR application using Vuforia Engine & Unity to project 3D anatomical structures onto physical marker targets for interactive medical education.",
      tech: ["Unity", "AR", "Vuforia", "C#"],
      github: "https://github.com/shivakantkurmi/AR-Anatomy",
      live: "",
      liveStatus: "Repo Available"
    },
    {
      id: "arsolarsystem",
      num: "11",
      name: "AR Solar System Simulation",
      subtitle: "Educational Augmented Reality App",
      category: "AUGMENTED REALITY",
      icon: "🪐",
      desc: "Immersive AR application that brings the Solar System into physical room space using Unity and Vuforia target tracking.",
      tech: ["Unity", "AR", "Vuforia", "C#"],
      github: "https://github.com/shivakantkurmi/AR-Solar-System-Simulation-App.git",
      live: "",
      liveStatus: "Repo Available"
    },
    {
      id: "attendance",
      num: "12",
      name: "Automated Attendance System",
      subtitle: "Face Recognition ML App",
      category: "AI / ML",
      icon: "📷",
      desc: "Facial recognition-based attendance system with 93% accuracy using Python, OpenCV, Haar Cascades, and Pandas automated report logging.",
      tech: ["Python", "OpenCV", "Machine Learning", "Pandas"],
      github: "https://github.com/shivakantkurmi/Face-Recognition.git",
      live: "",
      liveStatus: "Repo Available"
    }
  ];

  const EXPERIENCE_EDUCATION = [
    {
      period: "APR 2025 – MAY 2025",
      role: "AI Intern",
      org: "Microsoft Initiative with Edunet Foundation & AICTE",
      details: "Selected for a national 4-week AI internship under Microsoft & AICTE. Built EduMentor AI using Gemini 1.5 Flash API, FAISS vector search, and RAG pipelines for personalized study generation."
    },
    {
      period: "2023 – 2027",
      role: "B.Tech, Computer Science & Engineering (Gaming Technology)",
      org: "Vellore Institute of Technology (VIT Bhopal), MP",
      details: "CGPA: 9.83 / 10.0. Selected for the prestigious STARS Scheme (academic excellence). Core coursework: DSA, MERN Stack, AWS Cloud, Unity Game Development."
    },
    {
      period: "2025",
      role: "AWS Certified Cloud Practitioner",
      org: "Amazon Web Services (AWS)",
      details: "Certified in foundational cloud computing and core AWS infrastructure services (EC2, RDS, S3, CloudFront, Load Balancers)."
    },
    {
      period: "2023",
      role: "Class XII — Higher Secondary",
      org: "Govt. HSS Hinota Kalan Hatta, Damoh, MP (MP Board)",
      details: "Score: 95% | Honored as DISTRICT TOPPER with the highest marks in Damoh district."
    },
    {
      period: "2021",
      role: "Class X — High School",
      org: "Govt. High School Bhainsa Hatta, Damoh, MP (MP Board)",
      details: "Score: 95% | MP Board."
    }
  ];

  const AWARDS_ACHIEVEMENTS = [
    {
      title: "BeHackFest — 3rd Place",
      subtitle: "Individual Category",
      issuer: "Hackathon organized by Bloom Energy",
      icon: "🥉"
    },
    {
      title: "District Topper — MP Board 2023",
      subtitle: "95% Aggregate Score",
      issuer: "Achieved highest marks in Damoh District in Higher Secondary Examinations",
      icon: "🏆"
    },
    {
      title: "LeetCode Knight Badge",
      subtitle: "Global Rank: 22,987 (Top 5% Globally)",
      issuer: "1000+ Algorithmic Problems Solved on LeetCode",
      icon: "⚔️"
    },
    {
      title: "GeeksforGeeks Institute Rank 4 / 3856",
      subtitle: "Rank #4 in VIT Bhopal",
      issuer: "1000+ Algorithmic Problems Solved on GeeksforGeeks",
      icon: "🌟"
    },
    {
      title: "HackerRank 5★ C++",
      subtitle: "Five-Star Rating",
      issuer: "Problem Solving & C++ Language Proficiency",
      icon: "⭐"
    },
    {
      title: "AWS Certified Cloud Practitioner",
      subtitle: "Cloud Computing Certification",
      issuer: "Amazon Web Services (AWS)",
      icon: "☁️"
    },
    {
      title: "STARS Scheme — VIT Bhopal University",
      subtitle: "Academic Excellence (CGPA 9.83)",
      issuer: "Special Training for Academic Research & Studies scholarship",
      icon: "🎖️"
    }
  ];

  const VOLUNTEERING = [
    {
      role: "Student Volunteer",
      event: "Cognizant Campus Drive",
      org: "VIT Bhopal University",
      desc: "Assisted in coordinating, scheduling, and conducting technical evaluation rounds for the Cognizant campus recruitment drive at VIT Bhopal."
    },
    {
      role: "Core Member",
      event: "VRGC Club (VIT Reality & Gaming Club)",
      org: "VIT Bhopal University",
      desc: "Actively contributing to technical workshops, game development game jams, and virtual reality showcases at VIT Bhopal."
    }
  ];

  const PORTFOLIO_DATA = {
    PERSONAL_INFO,
    SOCIAL_LINKS,
    CODING_PROFILES,
    STATS_METRICS,
    SKILLS_LIST,
    PROJECTS_LIST,
    EXPERIENCE_EDUCATION,
    AWARDS_ACHIEVEMENTS,
    VOLUNTEERING
  };

  global.PORTFOLIO_DATA = PORTFOLIO_DATA;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PORTFOLIO_DATA;
  }
})(typeof window !== 'undefined' ? window : this);
