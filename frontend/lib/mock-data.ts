import type { LinkedInProfile } from "@/lib/types"

export const mockProfiles: LinkedInProfile[] = [
  {
    linkedinUrl: "https://www.linkedin.com/in/sarah-johnson-1234567890",
    name: "Sarah Johnson",
    headline: "Senior Software Engineer at Google | Full-Stack Developer | React & Node.js Expert",
    location: "San Francisco, CA",
    profileImage: "/placeholder.svg?height=100&width=100",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Google",
        duration: "2022 - Present",
        description: "Leading development of cloud-native applications",
        location: "Mountain View, CA",
      },
      {
        title: "Software Engineer",
        company: "Meta",
        duration: "2020 - 2022",
        description: "Developed React components for Facebook's main platform",
        location: "Menlo Park, CA",
      },
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "Master of Science in Computer Science",
        duration: "2018 - 2020",
      },
      {
        institution: "UC Berkeley",
        degree: "Bachelor of Science in Computer Science",
        duration: "2014 - 2018",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL"],
    projects: [
      {
        title: "E-commerce Platform",
        description: "Built a scalable e-commerce platform using React and Node.js",
        technologies: ["React", "Node.js", "MongoDB", "AWS"],
      },
    ],
    awards: [
      {
        title: "Employee of the Year",
        issuer: "Google",
        date: "2023",
        description: "Recognized for outstanding performance and leadership",
      },
    ],
    certifications: [
      {
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023",
        credentialId: "AWS-SA-2023-001",
      },
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Spanish", proficiency: "Conversational" },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/michael-chen-1234567890",
    name: "Michael Chen",
    headline: "Product Manager at Microsoft | AI & Machine Learning Enthusiast",
    location: "Seattle, WA",
    experience: [
      {
        title: "Senior Product Manager",
        company: "Microsoft",
        duration: "2021 - Present",
        description: "Leading AI product initiatives for Azure platform",
      },
      {
        title: "Product Manager",
        company: "Amazon",
        duration: "2019 - 2021",
        description: "Managed Alexa voice recognition features",
      },
    ],
    education: [
      {
        institution: "MIT",
        degree: "MBA",
        duration: "2017 - 2019",
      },
      {
        institution: "Carnegie Mellon University",
        degree: "Bachelor of Science in Computer Science",
        duration: "2013 - 2017",
      },
    ],
    skills: ["Product Management", "Machine Learning", "Python", "SQL", "Agile", "Scrum", "Data Analysis"],
    awards: [
      {
        title: "Innovation Award",
        issuer: "Microsoft",
        date: "2022",
        description: "For breakthrough AI product development",
      },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/emily-rodriguez-1234567890",
    name: "Emily Rodriguez",
    headline: "UX Designer at Apple | Design Systems Expert | Accessibility Advocate",
    location: "Cupertino, CA",
    experience: [
      {
        title: "Senior UX Designer",
        company: "Apple",
        duration: "2020 - Present",
        description: "Designing user experiences for iOS applications",
      },
      {
        title: "UX Designer",
        company: "Airbnb",
        duration: "2018 - 2020",
        description: "Worked on host and guest experience improvements",
      },
    ],
    education: [
      {
        institution: "Art Center College of Design",
        degree: "Master of Fine Arts in Interaction Design",
        duration: "2016 - 2018",
      },
    ],
    skills: ["UX Design", "UI Design", "Figma", "Sketch", "Prototyping", "User Research", "Accessibility"],
    projects: [
      {
        title: "iOS Accessibility Framework",
        description: "Developed comprehensive accessibility guidelines for iOS apps",
        technologies: ["Figma", "iOS", "Accessibility"],
      },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/david-kim-1234567890",
    name: "David Kim",
    headline: "Data Scientist at Netflix | Machine Learning Engineer | PhD in Statistics",
    location: "Los Gatos, CA",
    experience: [
      {
        title: "Senior Data Scientist",
        company: "Netflix",
        duration: "2021 - Present",
        description: "Building recommendation algorithms and content analysis models",
      },
      {
        title: "Data Scientist",
        company: "Spotify",
        duration: "2019 - 2021",
        description: "Developed music recommendation systems",
      },
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "PhD in Statistics",
        duration: "2015 - 2019",
      },
      {
        institution: "UCLA",
        degree: "Bachelor of Science in Mathematics",
        duration: "2011 - 2015",
      },
    ],
    skills: ["Python", "R", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "SQL", "Statistics"],
    publications: [
      {
        title: "Advanced Recommendation Systems for Streaming Platforms",
        publisher: "Journal of Machine Learning Research",
        date: "2022",
        description: "Research on improving recommendation accuracy",
      },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/lisa-wang-1234567890",
    name: "Lisa Wang",
    headline: "Marketing Director at Tesla | Growth Marketing Expert | MBA",
    location: "Austin, TX",
    experience: [
      {
        title: "Marketing Director",
        company: "Tesla",
        duration: "2022 - Present",
        description: "Leading global marketing campaigns for electric vehicles",
      },
      {
        title: "Senior Marketing Manager",
        company: "Uber",
        duration: "2020 - 2022",
        description: "Managed rider acquisition and retention campaigns",
      },
    ],
    education: [
      {
        institution: "Wharton School",
        degree: "MBA",
        duration: "2018 - 2020",
      },
      {
        institution: "University of Texas at Austin",
        degree: "Bachelor of Business Administration",
        duration: "2014 - 2018",
      },
    ],
    skills: ["Digital Marketing", "Growth Marketing", "Analytics", "SEO", "SEM", "Social Media", "Brand Management"],
    certifications: [
      {
        name: "Google Analytics Certified",
        issuer: "Google",
        date: "2023",
      },
      {
        name: "Facebook Marketing Professional",
        issuer: "Meta",
        date: "2022",
      },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/james-thompson-1234567890",
    name: "James Thompson",
    headline: "DevOps Engineer at Amazon | Cloud Infrastructure Specialist | Kubernetes Expert",
    location: "New York, NY",
    experience: [
      {
        title: "Senior DevOps Engineer",
        company: "Amazon",
        duration: "2021 - Present",
        description: "Managing cloud infrastructure for AWS services",
      },
      {
        title: "DevOps Engineer",
        company: "Netflix",
        duration: "2019 - 2021",
        description: "Implemented CI/CD pipelines and monitoring systems",
      },
    ],
    education: [
      {
        institution: "Georgia Tech",
        degree: "Master of Science in Computer Science",
        duration: "2017 - 2019",
      },
    ],
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "Python", "Linux", "Monitoring"],
    certifications: [
      {
        name: "AWS DevOps Engineer Professional",
        issuer: "Amazon Web Services",
        date: "2023",
      },
      {
        name: "Certified Kubernetes Administrator",
        issuer: "Cloud Native Computing Foundation",
        date: "2022",
      },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/anna-petrov-1234567890",
    name: "Anna Petrov",
    headline: "Research Scientist at OpenAI | PhD in Machine Learning | AI Safety Researcher",
    location: "San Francisco, CA",
    experience: [
      {
        title: "Research Scientist",
        company: "OpenAI",
        duration: "2022 - Present",
        description: "Conducting research on AI safety and alignment",
      },
      {
        title: "Research Intern",
        company: "DeepMind",
        duration: "2021 - 2022",
        description: "Worked on reinforcement learning algorithms",
      },
    ],
    education: [
      {
        institution: "MIT",
        degree: "PhD in Machine Learning",
        duration: "2018 - 2022",
      },
      {
        institution: "Moscow State University",
        degree: "Master of Science in Mathematics",
        duration: "2016 - 2018",
      },
    ],
    skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow", "PyTorch", "Research", "AI Safety"],
    publications: [
      {
        title: "Alignment Techniques for Large Language Models",
        publisher: "Nature Machine Intelligence",
        date: "2023",
        description: "Novel approaches to AI alignment",
      },
      {
        title: "Reinforcement Learning with Human Feedback",
        publisher: "ICML",
        date: "2022",
        description: "Improving RL through human preferences",
      },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Russian", proficiency: "Native" },
      { name: "German", proficiency: "Intermediate" },
    ],
  },
  {
    linkedinUrl: "https://www.linkedin.com/in/carlos-martinez-1234567890",
    name: "Carlos Martinez",
    headline: "Cybersecurity Analyst at IBM | Ethical Hacker | CISSP Certified",
    location: "Chicago, IL",
    experience: [
      {
        title: "Senior Cybersecurity Analyst",
        company: "IBM",
        duration: "2020 - Present",
        description: "Leading security assessments and incident response",
      },
      {
        title: "Security Consultant",
        company: "Deloitte",
        duration: "2018 - 2020",
        description: "Provided cybersecurity consulting for Fortune 500 companies",
      },
    ],
    education: [
      {
        institution: "University of Illinois at Chicago",
        degree: "Master of Science in Cybersecurity",
        duration: "2016 - 2018",
      },
    ],
    skills: ["Cybersecurity", "Penetration Testing", "Network Security", "Incident Response", "Python", "Linux"],
    certifications: [
      {
        name: "CISSP",
        issuer: "ISC2",
        date: "2021",
      },
      {
        name: "CEH",
        issuer: "EC-Council",
        date: "2020",
      },
    ],
  },
]
