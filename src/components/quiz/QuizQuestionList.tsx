import React from 'react';
import type { Question, QuizType } from '../../types/quiz';
import { sanitizeHtml } from '../../lib/sanitizeHtml';

interface QuizQuestionListProps {
  questions: Question[];
  onJumpToQuestion: (index: number) => void;
  onBack: () => void;
  quizType: QuizType;
}

const QuizQuestionList: React.FC<QuizQuestionListProps> = ({ questions, onJumpToQuestion, onBack, quizType }) => {
  // Get status icon and color
  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'correct':
        return {
          icon: (
            <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          ),
          bgColor: 'bg-[#ECFDF5] dark:bg-[#10B981]/10',
          borderColor: 'border-[#10B981]/20 dark:border-[#10B981]/30',
          textColor: 'text-[#10B981] dark:text-[#34D399]'
        };
      case 'incorrect':
        return {
          icon: (
            <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ),
          bgColor: 'bg-[#FEF2F2] dark:bg-[#EF4444]/10',
          borderColor: 'border-[#EF4444]/20 dark:border-[#EF4444]/30',
          textColor: 'text-[#EF4444] dark:text-[#F87171]'
        };
      case 'skipped':
        return {
          icon: (
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          bgColor: 'bg-[#F3F4F6] dark:bg-gray-700/30',
          borderColor: 'border-gray-200 dark:border-gray-600',
          textColor: 'text-[#6B7280] dark:text-gray-400'
        };
      case 'partially-correct':
        return {
          icon: (
            <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          bgColor: 'bg-[#FEFCE8] dark:bg-[#F59E0B]/10',
          borderColor: 'border-[#F59E0B]/20 dark:border-[#F59E0B]/30',
          textColor: 'text-[#F59E0B] dark:text-[#FBBF24]'
        };
      default: // unanswered
        return {
          icon: (
            <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ),
          bgColor: 'bg-[#EBF5FF] dark:bg-[#2563EB]/10',
          borderColor: 'border-[#2563EB]/20 dark:border-[#2563EB]/30',
          textColor: 'text-[#2563EB] dark:text-[#60A5FA]'
        };
    }
  };
  
  // Group questions by status
  const groupedQuestions = {
    unanswered: questions.filter(q => !q.status || q.status === 'unanswered'),
    correct: questions.filter(q => q.status === 'correct'),
    incorrect: questions.filter(q => q.status === 'incorrect'),
    partiallyCorrect: questions.filter(q => q.status === 'partially-correct'),
    skipped: questions.filter(q => q.status === 'skipped')
  };
  
  // Determine if we can jump to questions
  const canJumpToQuestions = groupedQuestions.unanswered.length > 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#111827] dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          Sva pitanja ({questions.length})
        </h3>
        <button
          onClick={onBack}
          className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#6B7280] dark:text-gray-300 hover:bg-[#F3F4F6] dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Nazad
        </button>
      </div>
      
      {/* Unanswered questions */}
      {groupedQuestions.unanswered.length > 0 && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-[#111827] dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 flex items-center justify-center mr-2 text-[#2563EB]">
              {groupedQuestions.unanswered.length}
            </span>
            Neodgovorena pitanja
          </h4>
          <div className="space-y-4">
            {groupedQuestions.unanswered.map(question => {
              const statusInfo = getStatusInfo(question.status);
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} relative overflow-hidden transition-all hover:shadow-md`}
                  onClick={() => canJumpToQuestions && onJumpToQuestion(questions.findIndex(q => q.id === question.id))}
                  style={{ cursor: canJumpToQuestions ? 'pointer' : 'default' }}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-sm text-[#111827] dark:text-white">{questions.findIndex(q => q.id === question.id) + 1}</span>
                    </div>
                    <div>
                      <div 
                        className="text-[#111827] dark:text-white font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.question) }}
                      />
                      <div className="flex items-center">
                        <span className={`flex items-center text-sm font-medium ${statusInfo.textColor}`}>
                          {statusInfo.icon}
                          <span className="ml-1">Neodgovoreno</span>
                        </span>
                        {canJumpToQuestions && (
                          <span className="ml-auto text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                            Odgovori
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Incorrect questions */}
      {groupedQuestions.incorrect.length > 0 && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-[#111827] dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#FEF2F2] dark:bg-[#EF4444]/20 flex items-center justify-center mr-2 text-[#EF4444]">
              {groupedQuestions.incorrect.length}
            </span>
            Netačno odgovorena pitanja
          </h4>
          <div className="space-y-4">
            {groupedQuestions.incorrect.map(question => {
              const statusInfo = getStatusInfo(question.status);
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} relative overflow-hidden transition-all hover:shadow-md`}
                  onClick={() => canJumpToQuestions && onJumpToQuestion(questions.findIndex(q => q.id === question.id))}
                  style={{ cursor: canJumpToQuestions ? 'pointer' : 'default' }}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-sm text-[#111827] dark:text-white">{questions.findIndex(q => q.id === question.id) + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div 
                        className="text-[#111827] dark:text-white font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.question) }}
                      />
                      <div className="flex flex-col space-y-2">
                        <span className={`flex items-center text-sm font-medium ${statusInfo.textColor}`}>
                          {statusInfo.icon}
                          <span className="ml-1">Netačan odgovor</span>
                        </span>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600">
                          <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Tačan odgovor:</p>
                          <p className="text-[#111827] dark:text-white font-medium">{question.correctAnswer}</p>
                        </div>
                        {quizType === 'input' && question.userAnswer && (
                           <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Vaš odgovor:</p>
                            <p className="text-[#111827] dark:text-white font-medium">{question.userAnswer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Partially correct questions */}
      {groupedQuestions.partiallyCorrect.length > 0 && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-[#111827] dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#FEFCE8] dark:bg-[#F59E0B]/20 flex items-center justify-center mr-2 text-[#F59E0B]">
              {groupedQuestions.partiallyCorrect.length}
            </span>
            Delimično tačna pitanja
          </h4>
          <div className="space-y-4">
            {groupedQuestions.partiallyCorrect.map(question => {
              const statusInfo = getStatusInfo(question.status);
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} relative overflow-hidden transition-all hover:shadow-md`}
                  onClick={() => canJumpToQuestions && onJumpToQuestion(questions.findIndex(q => q.id === question.id))}
                  style={{ cursor: canJumpToQuestions ? 'pointer' : 'default' }}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-sm text-[#111827] dark:text-white">{questions.findIndex(q => q.id === question.id) + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div 
                        className="text-[#111827] dark:text-white font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.question) }}
                      />
                      <div className="flex flex-col space-y-2">
                        <span className={`flex items-center text-sm font-medium ${statusInfo.textColor}`}>
                          {statusInfo.icon}
                          <span className="ml-1">Delimično tačan odgovor</span>
                        </span>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600">
                          <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Tačan odgovor:</p>
                          <p className="text-[#111827] dark:text-white font-medium">{question.correctAnswer}</p>
                        </div>
                        {quizType === 'input' && question.userAnswer && (
                           <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Vaš odgovor:</p>
                            <p className="text-[#111827] dark:text-white font-medium">{question.userAnswer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Skipped questions */}
      {groupedQuestions.skipped.length > 0 && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-medium mb-4 text-[#111827] dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#F3F4F6] dark:bg-gray-600 flex items-center justify-center mr-2 text-[#6B7280] dark:text-gray-400">
              {groupedQuestions.skipped.length}
            </span>
            Preskočena pitanja
          </h4>
          <div className="space-y-4">
            {groupedQuestions.skipped.map(question => {
              const statusInfo = getStatusInfo(question.status);
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} relative overflow-hidden transition-all hover:shadow-md`}
                  onClick={() => canJumpToQuestions && onJumpToQuestion(questions.findIndex(q => q.id === question.id))}
                  style={{ cursor: canJumpToQuestions ? 'pointer' : 'default' }}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-sm text-[#111827] dark:text-white">{questions.findIndex(q => q.id === question.id) + 1}</span>
                    </div>
                    <div>
                      <div 
                        className="text-[#111827] dark:text-white font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.question) }}
                      />
                      <div className="flex items-center">
                        <span className={`flex items-center text-sm font-medium ${statusInfo.textColor}`}>
                          {statusInfo.icon}
                          <span className="ml-1">Preskočeno</span>
                        </span>
                        {canJumpToQuestions && (
                          <span className="ml-auto text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                            Odgovori
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Correct questions */}
      {groupedQuestions.correct.length > 0 && (
        <div className="p-6">
          <h4 className="text-lg font-medium mb-4 text-[#111827] dark:text-white flex items-center">
            <span className="w-6 h-6 rounded-full bg-[#ECFDF5] dark:bg-[#10B981]/20 flex items-center justify-center mr-2 text-[#10B981]">
              {groupedQuestions.correct.length}
            </span>
            Tačno odgovorena pitanja
          </h4>
          <div className="space-y-4">
            {groupedQuestions.correct.map(question => {
              const statusInfo = getStatusInfo(question.status);
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} relative overflow-hidden`}
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-sm text-[#111827] dark:text-white">{questions.findIndex(q => q.id === question.id) + 1}</span>
                    </div>
                    <div>
                      <div 
                        className="text-[#111827] dark:text-white font-medium mb-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(question.question) }}
                      />
                      <div className="flex flex-col space-y-2">
                        <span className={`flex items-center text-sm font-medium ${statusInfo.textColor}`}>
                          {statusInfo.icon}
                          <span className="ml-1">Tačan odgovor</span>
                        </span>
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-100 dark:border-gray-600">
                          <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Odgovor:</p>
                          <p className="text-[#111827] dark:text-white font-medium">{question.correctAnswer}</p>
                        </div>
                        {quizType === 'input' && question.userAnswer && (
                           <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-1">Vaš odgovor:</p>
                            <p className="text-[#111827] dark:text-white font-medium">{question.userAnswer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionList; 