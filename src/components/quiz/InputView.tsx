import React, { useState } from 'react';
import type { Question, QuestionStatus } from '../../types/quiz';

interface InputViewProps {
  question: Question;
  onAnswer: (status: QuestionStatus, userAnswer?: string) => void;
  onSkip: () => void;
}

const InputView: React.FC<InputViewProps> = ({ question, onAnswer, onSkip }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsSubmitted(true);
  };

  const handleEvaluation = (status: QuestionStatus) => {
    onAnswer(status, inputValue);
    setInputValue('');
    setIsSubmitted(false);
  };
  
  const handleIDontKnow = () => {
    onAnswer('dont-know', ''); 
    setInputValue('');
    setIsSubmitted(false);
  };

  const handleSkip = () => {
    onSkip();
    setInputValue('');
    setIsSubmitted(false);
  }

  if (isSubmitted) {
    return (
      <div className="animate-fadeIn">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#6B7280] dark:text-gray-300">Vaš odgovor:</label>
            <div className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              {inputValue || <span className="text-gray-400">Niste uneli odgovor.</span>}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[#EBF5FF] dark:bg-[#2563EB]/10 border border-[#2563EB]/20">
            <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Tačan odgovor:</p>
            <p className="font-medium text-[#111827] dark:text-white">{question.correctAnswer}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-center font-medium mb-4 text-[#111827] dark:text-white">Ocenite svoj odgovor:</p>
          <div className="flex justify-center items-center flex-wrap gap-4">
            <button 
              onClick={() => handleEvaluation('correct')} 
              className="px-6 py-3 rounded-lg text-sm font-medium border border-green-500/50 text-green-600 bg-green-500/10 hover:bg-green-500/20 transition-all"
            >
              Tačno
            </button>
            <button 
              onClick={() => handleEvaluation('partially-correct')} 
              className="px-6 py-3 rounded-lg text-sm font-medium border border-yellow-500/50 text-yellow-600 bg-yellow-500/10 hover:bg-yellow-500/20 transition-all"
            >
              Delimično tačno
            </button>
            <button 
              onClick={() => handleEvaluation('incorrect')} 
              className="px-6 py-3 rounded-lg text-sm font-medium border border-red-500/50 text-red-600 bg-red-500/10 hover:bg-red-500/20 transition-all"
            >
              Netačno
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="answer" className="block text-sm font-medium mb-2 text-[#6B7280] dark:text-gray-300">
          Unesite vaš odgovor:
        </label>
        <input
          type="text"
          id="answer"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
          placeholder="Upišite odgovor ovde"
          autoComplete="off"
        />
      </div>
      
      <div className="flex items-center flex-wrap gap-4 mt-6">
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="flex-1 p-3 rounded-lg text-lg font-medium transition-all bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white hover:shadow-lg disabled:opacity-50"
        >
          Potvrdi odgovor
        </button>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleIDontKnow}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-[#6B7280] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Ne znam
          </button>
          
          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-[#6B7280] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Preskoči
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputView; 