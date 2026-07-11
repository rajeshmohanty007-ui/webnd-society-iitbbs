export interface Member {
  id: string;
  name: string;
  role: string;
  category: 'executive' | 'core' | 'alumni';
  imageSeed: string; // Used to generate or render unique cyber-gold aesthetic portraits
  image?: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  description: string;
  imageSeed: string; // seed for unique visual background generative canvas
  tags: string[];
  github?: string;
  demo?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  details: string;
}
