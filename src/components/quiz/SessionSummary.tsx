import React from 'react';
import type { QuizSession } from '../../types/quiz';
import { formatDistanceToNow } from 'date-fns';

interface SessionSummaryProps {
  session: QuizSession;
  onContinue: () => void;
  onNewSession: () => void;
  onShowAllQuestions: () => void;
  onRetryIncorrect: () => void;
  showAllQuestions?: boolean;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  session,
  onContinue,
  onNewSession,
  onShowAllQuestions,
  onRetryIncorrect,
  showAllQuestions = false
}) => {
  const { correctAnswers, incorrectAnswers, skippedQuestions, partiallyCorrectAnswers, questions, lastUpdatedAt } = session;
  const hasRemainingQuestions = questions.some(q => q.status === 'unanswered');
  const total = questions.length;
  const percentageCorrect = total > 0 ? Math.round(((correctAnswers + (partiallyCorrectAnswers || 0) * 0.5) / total) * 100) : 0;
  
  // Determine success level and message
  let successMessage = "Odličan rezultat! Pravi si stručnjak!";
  let icon = (
    <svg className="w-16 h-16 text-[#10B981] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
    </svg>
  );
  
  if (percentageCorrect < 40) {
    successMessage = "Ima prostora za napredak. Ne odustaj!";
    icon = (
      <svg className="w-16 h-16 text-[#EF4444] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    );
  } else if (percentageCorrect < 70) {
    successMessage = "Dobar rezultat! Nastavi da učiš!";
    icon = (
      <svg className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
      </svg>
    );
  } else if (percentageCorrect < 90) {
    successMessage = "Sjajan rezultat! Skoro si tu!";
    icon = (
      <svg className="w-16 h-16 text-[#2563EB] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>
    );
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] p-8 text-white text-center">
          <div className="inline-block relative mb-4">
            {icon}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold">{session.name}</h2>
          <p className="text-sm mt-2 text-white/80">
            Poslednja aktivnost: {formatDistanceToNow(new Date(lastUpdatedAt), { addSuffix: true })}
          </p>
        </div>
        
        {/* Main content */}
        <div className="p-8 space-y-8">
          {/* Score circle */}
          <div className="flex justify-center">
            <div className="relative">
              <svg className="w-44 h-44" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#E5E7EB" 
                  strokeWidth="10" 
                  className="dark:opacity-20"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="10" 
                  strokeDasharray={`${percentageCorrect * 2.83} ${283 - percentageCorrect * 2.83}`} 
                  strokeDashoffset="70.75" 
                  className="animate-checkmark"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#10B981]">{percentageCorrect}%</span>
                  <p className="text-sm text-[#6B7280] dark:text-gray-400">Uspešnost</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Success message */}
          <p className="text-center font-medium text-lg text-[#111827] dark:text-white">{successMessage}</p>
          
          {/* Stats */}
          <div className={`grid grid-cols-${partiallyCorrectAnswers > 0 ? '5' : '4'} gap-4`}>
            <div className="bg-[#F9FAFB] dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 rounded-lg p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-gray-400">Ukupno pitanja</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">{total}</p>
            </div>
            
            <div className="bg-[#ECFDF5] dark:bg-[#10B981]/10 border border-[#10B981]/20 dark:border-[#10B981]/30 rounded-lg p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-gray-400">Tačnih odgovora</p>
              <p className="text-2xl font-bold text-[#10B981] dark:text-[#34D399]">{correctAnswers}</p>
            </div>
            
            {partiallyCorrectAnswers > 0 && (
              <div className="bg-[#FEFCE8] dark:bg-[#F59E0B]/10 border border-[#F59E0B]/20 dark:border-[#F59E0B]/30 rounded-lg p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-[#6B7280] dark:text-gray-400">Delimično tačnih</p>
                <p className="text-2xl font-bold text-[#F59E0B] dark:text-[#FBBF24]">{partiallyCorrectAnswers}</p>
              </div>
            )}
            
            <div className="bg-[#FEF2F2] dark:bg-[#EF4444]/10 border border-[#EF4444]/20 dark:border-[#EF4444]/30 rounded-lg p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-gray-400">Netačnih odgovora</p>
              <p className="text-2xl font-bold text-[#EF4444] dark:text-[#F87171]">{incorrectAnswers}</p>
            </div>
            
            <div className="bg-[#F3F4F6] dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg p-5 text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-sm text-[#6B7280] dark:text-gray-400">Preskočenih</p>
              <p className="text-2xl font-bold text-[#6B7280] dark:text-gray-400">{skippedQuestions}</p>
            </div>
          </div>
          
          {/* Remaining questions info */}
          {hasRemainingQuestions ? (
            <div className="bg-[#EBF5FF] dark:bg-[#2563EB]/10 rounded-lg p-5 border border-[#2563EB]/20 dark:border-[#2563EB]/30">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#111827] dark:text-white">Preostala pitanja: {questions.filter(q => q.status === 'unanswered').length}</p>
                  <p className="text-sm text-[#6B7280] dark:text-gray-400">
                    Možete nastaviti sa preostalim pitanjima da biste usavršili svoje znanje.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#ECFDF5] dark:bg-[#10B981]/10 border border-[#10B981]/20 dark:border-[#10B981]/30 rounded-lg p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="font-medium text-[#111827] dark:text-white">Čestitamo! Uspešno ste odgovorili na sva pitanja.</p>
            </div>
          )}
        </div>
        
        {/* Footer with buttons */}
        <div className="p-6 bg-[#F9FAFB] dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4">
          {hasRemainingQuestions && !showAllQuestions && (
            <button 
              onClick={onContinue}
              className="flex-1 p-4 rounded-lg text-white bg-[#2563EB] hover:bg-[#1D4ED8] font-medium transition-all shadow-md flex items-center justify-center button-hover"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Nastavi sa preostalim pitanjima
            </button>
          )}
          
          {!hasRemainingQuestions && incorrectAnswers > 0 && !showAllQuestions && (
            <button
              onClick={onRetryIncorrect}
              className="flex-1 p-4 rounded-lg text-white bg-[#EF4444] hover:bg-[#DC2626] font-medium transition-all shadow-md flex items-center justify-center button-hover"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Pokreni netačna pitanja
            </button>
          )}
          
          {!showAllQuestions && (
            <button 
              onClick={onShowAllQuestions}
              className="flex-1 p-4 rounded-lg font-medium transition-all shadow-md flex items-center justify-center bg-white dark:bg-gray-700 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#2563EB]/30 hover:bg-[#EBF5FF] dark:hover:bg-[#2563EB]/10 button-hover"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              Prikaži sva pitanja
            </button>
          )}
          
          <button 
            onClick={onNewSession}
            className={`flex-1 p-4 rounded-lg font-medium transition-all shadow-md flex items-center justify-center ${
              !showAllQuestions && hasRemainingQuestions 
                ? 'bg-white dark:bg-gray-700 text-[#6B7280] dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-[#F3F4F6] dark:hover:bg-gray-600 button-hover'
                : 'text-white bg-[#2563EB] hover:bg-[#1D4ED8] button-hover'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Nova sesija
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary; 