import React, { useState } from 'react';
import type { CustomQuizSummary } from '../../types/quiz/custom';
import Button from '../ui/Button';

interface AddToCustomQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToQuiz: (quizId: string | null, newQuizName?: string) => void;
  customQuizzes: CustomQuizSummary[];
}

const AddToCustomQuizModal: React.FC<AddToCustomQuizModalProps> = ({ isOpen, onClose, onAddToQuiz, customQuizzes }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<string>('new');
  const [newQuizName, setNewQuizName] = useState('');

  const handleSubmit = () => {
    if (selectedQuiz === 'new' && newQuizName.trim()) {
      onAddToQuiz(null, newQuizName.trim());
    } else if (selectedQuiz !== 'new') {
      onAddToQuiz(selectedQuiz);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-[#111827] dark:text-white">Dodaj u custom kviz</h3>
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="quiz-select" className="block text-sm font-medium text-[#6B7280] dark:text-gray-300 mb-2">
              Izaberi postojeći ili napravi novi kviz:
            </label>
            <select
              id="quiz-select"
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            >
              <option value="new">-- Novi Kviz --</option>
              {customQuizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>{quiz.name}</option>
              ))}
            </select>
          </div>

          {selectedQuiz === 'new' && (
            <div>
              <label htmlFor="new-quiz-name" className="block text-sm font-medium text-[#6B7280] dark:text-gray-300 mb-2">
                Naziv novog kviza:
              </label>
              <input
                type="text"
                id="new-quiz-name"
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                placeholder="Unesite naziv..."
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F3F4F6] dark:hover:bg-gray-700 transition-colors"
          >
            Odustani
          </button>
          <Button
            onClick={handleSubmit}
            disabled={(selectedQuiz === 'new' && !newQuizName.trim())}
          >
            Dodaj
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddToCustomQuizModal; 