export interface Question {
  id: number;
  question: string;
  answers: string[]; // Empty array if it's an input question
  correctAnswer: string | string[];
  status?: QuestionStatus;
  userAnswer?: any;
  timestamp?: number;
}

export type QuestionStatus = 'correct' | 'incorrect' | 'unanswered' | 'skipped' | 'partially-correct' | 'dont-know';

export interface QuizSession {
  id: string;
  name: string;
  subject: string;
  type: QuizType;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  partiallyCorrectAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  remainingQuestions: Question[];
  createdAt: number;
  lastUpdatedAt: number;
  isCompleted: boolean;
}

export type QuizType = 'multiple-choice' | 'input' | 'manual' | 'custom';

export interface QuizSettings {
  subject: string;
  type: QuizType;
  questionRange: [number, number];
  name?: string;
}

export interface SessionSummary {
  id: string;
  name: string;
  subject: string;
  type: QuizType;
  questionsCount: number;
  correctAnswers: number;
  partiallyCorrectAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  completedCount: number;
  percentageCorrect: number;
  createdAt: number;
  lastUpdatedAt: number;
  isCompleted: boolean;
} 