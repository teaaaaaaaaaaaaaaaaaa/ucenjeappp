import React, { useState } from 'react';
import type { Question, QuestionStatus } from '../../types/quiz';
import McqView from './McqView';
import InputView from './InputView';
import { sanitizeHtml } from '../../lib/sanitizeHtml';
import AddToCustomQuizModal from './AddToCustomQuizModal';
import { useQuiz } from '../../contexts/QuizContext';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (status: QuestionStatus, userAnswer?: string | string[]) => void;
  onSkip: () => void;
  onJumpToQuestion: (index: number) => void;
  allQuestions: Question[];
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onSkip,
  onJumpToQuestion,
  allQuestions,
}) => {
  const { addQuestionToCustomQuiz, getCustomQuizzes } = useQuiz();
  const isViewMultipleChoice = Array.isArray(question?.answers) && question.answers.length > 0;
  const [showJumpDialog, setShowJumpDialog] = useState(false);
  const [showAddToQuizModal, setShowAddToQuizModal] = useState(false);
  const [jumpToIndex, setJumpToIndex] = useState<string>('');
  
  const handleJump = () => {
    const index = parseInt(jumpToIndex);
    if (!isNaN(index) && index > 0 && index <= allQuestions.length) {
      onJumpToQuestion(index - 1); // Convert from 1-based to 0-based index
      setShowJumpDialog(false);
      setJumpToIndex('');
    }
  };

  const handleAddToQuiz = (quizId: string | null, newQuizName?: string) => {
    addQuestionToCustomQuiz(question, quizId, newQuizName);
    setShowAddToQuizModal(false);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Question header */}
        <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 dark:from-[#2563EB]/20 dark:to-[#10B981]/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] font-bold text-lg mr-4">
                {questionNumber}
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">Pitanje {questionNumber} od {totalQuestions}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium px-3 py-1 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]">
                {isViewMultipleChoice ? 'Ponuđeni odgovori' : 'Unos odgovora'}
              </div>
              <button
                onClick={() => setShowAddToQuizModal(true)}
                className="p-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Dodaj u custom kviz"
              >
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button 
                onClick={() => setShowJumpDialog(true)}
                className="p-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Idi na pitanje"
              >
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Question content */}
        <div className="p-8">
          <div className="mb-8">
            <div 
              className="text-xl font-medium text-[#111827] dark:text-white mb-2"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.question) }}
            />
          </div>
          
          {isViewMultipleChoice ? (
            <McqView question={question} onAnswer={onAnswer as (status: QuestionStatus, userAnswer: string[]) => void} onSkip={onSkip} />
          ) : (
            <InputView question={question} onAnswer={onAnswer} onSkip={onSkip} />
          )}
          
        </div>
      </div>
      
      {/* Jump to question dialog */}
      {showJumpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-[#111827] dark:text-white">Idi na pitanje</h3>
            <div className="mb-6">
              <label htmlFor="questionNumber" className="block text-sm font-medium text-[#6B7280] dark:text-gray-300 mb-2">
                Unesite broj pitanja (1-{totalQuestions}):
              </label>
              <input
                type="number"
                id="questionNumber"
                min="1"
                max={totalQuestions}
                value={jumpToIndex}
                onChange={(e) => setJumpToIndex(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowJumpDialog(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F3F4F6] dark:hover:bg-gray-700 transition-colors"
              >
                Odustani
              </button>
              <button
                onClick={handleJump}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors"
              >
                Idi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to custom quiz modal */}
      <AddToCustomQuizModal
        isOpen={showAddToQuizModal}
        onClose={() => setShowAddToQuizModal(false)}
        onAddToQuiz={handleAddToQuiz}
        customQuizzes={getCustomQuizzes()}
      />
    </div>
  );
};

export default QuizCard; 