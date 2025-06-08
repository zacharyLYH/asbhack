export interface LinkedInProfile {
    linkedinUrl: string
    name?: string
    headline?: string
    location?: string
    profileImage?: string
    experience?: Experience[]
    education?: Education[]
    skills?: string[]
    projects?: Project[]
    awards?: Award[]
    publications?: Publication[]
    patents?: Patent[]
    certifications?: Certification[]
    languages?: Language[]
    volunteerExperience?: VolunteerExperience[]
  }
  
  export interface Experience {
    title: string
    company: string
    duration: string
    description?: string
    location?: string
  }
  
  export interface Education {
    institution: string
    degree: string
    field?: string
    duration: string
    description?: string
  }
  
  export interface Project {
    title: string
    description?: string
    duration?: string
    technologies?: string[]
    url?: string
  }
  
  export interface Award {
    title: string
    issuer: string
    date: string
    description?: string
  }
  
  export interface Publication {
    title: string
    publisher: string
    date: string
    description?: string
    url?: string
  }
  
  export interface Patent {
    title: string
    patentNumber: string
    date: string
    description?: string
  }
  
  export interface Certification {
    name: string
    issuer: string
    date: string
    expiryDate?: string
    credentialId?: string
    url?: string
  }
  
  export interface Language {
    name: string
    proficiency: string
  }
  
  export interface VolunteerExperience {
    role: string
    organization: string
    duration: string
    description?: string
  }
  