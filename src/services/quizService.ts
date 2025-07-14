import type { Question } from "../types/quiz";

/**
 * Fetches available quiz subjects from the data directory
 */
export const getAvailableSubjects = async (): Promise<string[]> => {
  try {
    const subjects = ['linux', 'programming', 'linux-deep'];
    return subjects;
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
    const response = await fetch(`/data/${subject}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${subject} questions`);
    }
    
    const data = await response.json();
    
    // Transform data to match our Question type
    const questions: Question[] = data.map((q: any, index: number) => ({
      id: index + 1,
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