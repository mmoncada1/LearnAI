export interface LearningStage {
  title: string;
  description: string;
  resources: Resource[];
  completed?: boolean;
}

export interface Resource {
  title: string;
  url: string;
  type?: 'video' | 'article' | 'course' | 'documentation' | 'practice';
  duration?: string;
  completed?: boolean;
}

export interface LearningPath {
  id?: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  stages: LearningStage[];
  description: string;
  progress?: number;
  startedAt?: string;
  lastAccessedAt?: string;
  isActive?: boolean;
}

export interface GeneratePathRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment?: string;
  priorExperience?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserProgress {
  userId: string;
  learningPaths: LearningPath[];
  completedResources: string[];
  totalHoursSpent: number;
  skillsLearned: string[];
  streakDays: number;
  lastActivityAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}
