import type { Question } from "../types/quiz";

const SUBJECT_FILES: Record<string, string> = {
  'linux': '/data/linux.json',
  'linux-deep': '/data/linux-deep.json',
  'programming': '/data/programming.json',
  'marketing': '/data/marketing.json',
  'marketing-deep': '/data/marketing-deep.json',
};

/**
 * Fetches available quiz subjects from the data directory
 */
export const getAvailableSubjects = async (): Promise<string[]> => {
  try {
    return Object.keys(SUBJECT_FILES);
  } catch (error) {
    console.error('Error fetching available subjects:', error);
    throw new Error('Failed to fetch available subjects');
  }
};

/**
 * Loads questions for a specific subject from its JSON file
 */
export const loadQuestions = async (subject: string): Promise<Question[]> => {
  try {
    const filePath = SUBJECT_FILES[subject];
    if (!filePath) {
      throw new Error(`Subject '${subject}' not found.`);
    }
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${subject} questions from ${filePath}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our Question type
    const questions: Question[] = data.map((q: any, index: number) => ({
      id: q.id || index + 1,
      question: q.question,
      answers: q.answers || [],
      correctAnswer: q.correctAnswer
    }));
    
    return questions;
  } catch (error) {
    console.error(`Error loading ${subject} questions:`, error);
    throw new Error(`Failed to load ${subject} questions`);
  }
};

/**
 * Shuffles an array of questions using Fisher-Yates algorithm
 */
export const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}; 