import { useQuiz as useQuizContext } from '../contexts/QuizContext';

/**
 * Custom hook for accessing quiz functionality.
 * This is a simple re-export of the context hook for now,
 * but can be extended with additional functionality in the future.
 */
const useQuiz = () => {
  return useQuizContext();
};

export default useQuiz; 