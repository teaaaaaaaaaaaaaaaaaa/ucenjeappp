import type { Question } from '@/types/quiz';
import { fetchApi } from '@/lib/api';

const SUBJECT_FILES: Record<string, string> = {
  aros: '/data/aros.json',
  linux: '/data/linux.json',
  'linux-deep': '/data/linux-deep.json',
  marketing: '/data/marketing.json',
  'marketing-deep': '/data/marketing-deep.json',
  programming: '/data/programming.json',
  statistika: '/data/statistika.json',
  'statistika_test': '/data/statistika_test.json',
  'strukturepodataka_pitanja_sa_1testa': '/data/strukturepodataka_pitanja_sa_1testa.json',
  'strukturepodataka_pitanja_sa_2testa': '/data/strukturepodataka_pitanja_sa_2testa.json',
  'strukturepodataka_pitanja_sa_3testa': '/data/strukturepodataka_pitanja_sa_3testa.json',
  'strukturepodataka_pitanja_sa_4testa': '/data/strukturepodataka_pitanja_sa_4testa.json',
  'strukturepodataka_pitanja_sa_5testa': '/data/strukturepodataka_pitanja_sa_5testa.json',
};

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns A new, shuffled array.
 */
const shuffleArray = <T>(array: T[]): T[] => {
  // Create a copy to avoid modifying the original array
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Fetches available quiz subjects from the data directory
 */
export const getAvailableSubjects = async (): Promise<string[]> => {
  try {
    const subjects = [
      'aros',
      'linux',
      'linux-deep',
      'marketing',
      'marketing-deep',
      'programming',
      'statistika',
      'statistika_test',
      'strukturepodataka_pitanja_sa_1testa',
      'strukturepodataka_pitanja_sa_2testa',
      'strukturepodataka_pitanja_sa_3testa',
      'strukturepodataka_pitanja_sa_4testa',
      'strukturepodataka_pitanja_sa_5testa',
    ];
    return Promise.resolve(subjects);
  } catch (error) {
    console.error('Error fetching available subjects:', error);
    throw new Error('Failed to fetch available subjects');
  }
};

/**
 * Loads questions for a given subject and shuffles the answers for MCQ questions.
 */
export const loadQuestions = async (subject: string): Promise<Question[]> => {
  if (!SUBJECT_FILES[subject]) {
    throw new Error(`Subject '${subject}' not found.`);
  }

  try {
    const questions = await fetchApi<Question[]>(SUBJECT_FILES[subject]);

    // Shuffle answers for each question that has them
    return questions.map((question) => {
      if (question.answers && question.answers.length > 1) {
        return { ...question, answers: shuffleArray(question.answers) };
      }
      return question;
    });
  } catch (error) {
    console.error(`Error loading ${subject} questions:`, error);
    throw new Error(`Failed to load ${subject} questions`);
  }
};

/**
 * Shuffles an array of questions.
 * @param questions - The array of questions to shuffle.
 * @returns A new array with the questions shuffled.
 */
export const shuffleQuestions = (questions: Question[]): Question[] => {
  return shuffleArray(questions);
}; 