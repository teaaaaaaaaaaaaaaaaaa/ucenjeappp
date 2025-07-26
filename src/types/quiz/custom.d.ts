import type { Question } from './index';

export interface CustomQuiz {
  id: string;
  name: string;
  subject: string;
  questions: Question[];
  createdAt: number;
  lastUpdatedAt: number;
}

export interface CustomQuizSummary {
    id: string;
    name: string;
    subject: string;
    questionsCount: number;
    createdAt: number;
    lastUpdatedAt: number;
} 