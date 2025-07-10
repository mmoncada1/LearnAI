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
}

export interface LearningPath {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  stages: LearningStage[];
  description: string;
}

export interface GeneratePathRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment?: string;
  priorExperience?: string;
}
