import React, { useState } from 'react';
import type { Question, QuestionStatus } from '../../types/quiz';
import { sanitizeHtml } from '../../lib/sanitizeHtml';

interface McqViewProps {
  question: Question;
  onAnswer: (status: QuestionStatus, userAnswer: string[]) => void;
  onSkip: () => void;
}

const McqView: React.FC<McqViewProps> = ({ question, onAnswer, onSkip }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerClick = (answer: string) => {
    if (showResult) return;

    setSelectedAnswers(prev => 
      prev.includes(answer) 
        ? prev.filter(a => a !== answer)
        : [...prev, answer]
    );
  };

  const handleSubmit = () => {
    if (selectedAnswers.length === 0 || showResult) return;

    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
    const correct = selectedAnswers.length === correctAnswers.length && selectedAnswers.every(answer => correctAnswers.includes(answer));
    
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      onAnswer(correct ? 'correct' : 'incorrect', selectedAnswers);
      setSelectedAnswers([]);
      setShowResult(false);
    }, 1500);
  };

  const handleIDontKnow = () => {
    if (showResult) return;
    setIsCorrect(false);
    setShowResult(true);
    setTimeout(() => {
      onAnswer('dont-know', []);
      setSelectedAnswers([]);
      setShowResult(false);
    }, 1500);
  };

  const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];

  return (
    <div>
      <div className="space-y-3 mb-6">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswers.includes(answer);
          const isCorrectAnswer = correctAnswers.includes(answer);

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                showResult
                  ? isCorrectAnswer
                    ? 'border-[#10B981] bg-[#ECFDF5] dark:bg-[#10B981]/10 text-[#10B981] dark:text-[#34D399]'
                    : isSelected
                      ? 'border-[#EF4444] bg-[#FEF2F2] dark:bg-[#EF4444]/10 text-[#EF4444] dark:text-[#F87171]'
                      : 'border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300'
                  : isSelected
                    ? 'border-[#2563EB] bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]'
                    : 'border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50'
              }`}
              onClick={() => handleAnswerClick(answer)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  showResult
                    ? isCorrectAnswer
                      ? 'bg-[#10B981]/20 text-[#10B981]'
                      : isSelected
                        ? 'bg-[#EF4444]/20 text-[#EF4444]'
                        : 'bg-gray-100 dark:bg-gray-700 text-[#6B7280] dark:text-gray-400'
                    : isSelected
                      ? 'bg-[#2563EB]/20 text-[#2563EB]'
                      : 'bg-gray-100 dark:bg-gray-700 text-[#6B7280] dark:text-gray-400'
                }`}>
                  {showResult ? (
                    isCorrectAnswer ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : isSelected ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    ) : (
                      <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                    )
                  ) : (
                    <span className="text-xs">{String.fromCharCode(65 + index)}</span>
                  )}
                </div>
                <div
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(answer) }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center flex-wrap gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0 || showResult}
          className={`flex-1 p-3 rounded-lg text-lg font-medium transition-all ${
            selectedAnswers.length === 0 || showResult
              ? 'bg-gray-100 dark:bg-gray-700 text-[#6B7280] dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white hover:shadow-lg'
          }`}
        >
          {showResult ? (
            <div className="flex items-center justify-center">
              {isCorrect ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-fadeIn" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tačan odgovor!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 animate-fadeIn" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Netačan odgovor!
                </>
              )}
            </div>
          ) : (
            'Potvrdi odgovor'
          )}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleIDontKnow}
            disabled={showResult}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-[#6B7280] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Ne znam
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={showResult}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-[#6B7280] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Preskoči
          </button>
        </div>
      </div>
    </div>
  );
};

export default McqView; 