export type Experiment = {
  slug: string;
  title: string;
  dateLabel: string;
  logoUrl: string;
  categories: string[];
  summary: string;
  problem: string;
  observation: string;
  hypothesis: string;
  experiment: string;
  outcome: string;
  reflection: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
};

export type Presentation = {
  id: string;
  title: string;
  description: string;
  date?: string;
  course?: {
    name: string;
    url?: string;
  };
  videoUrl?: string;
  deckUrl?: string;
  thumbnailUrl?: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count?: number;
  open_issues_count?: number;
  description?: string | null;
  homepage?: string | null;
  language: string | null;
  updated_at: string;
};

export type GithubProfileStats = {
  public_repos: number;
  followers: number;
  following: number;
};
