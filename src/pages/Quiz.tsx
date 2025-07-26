import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuizCard from '../components/quiz/QuizCard';
import SessionSummary from '../components/quiz/SessionSummary';
import QuizQuestionList from '../components/quiz/QuizQuestionList.tsx';
import useQuiz from '../hooks/useQuiz';
import Loader from '../components/shared/Loader';

// Subject emoji mapping
const subjectEmojis: Record<string, string> = {
  linux: '🐧',
  programming: '💻',
  default: '📚'
};

const Quiz: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isSessionMode = location.pathname === '/quiz/session';
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  const { 
    activeSession, 
    loading, 
    error, 
    answerQuestion, 
    skipQuestion,
    jumpToQuestion,
    resetSession, 
    getCurrentQuestion,
    getAllQuestions,
    getProgress,
    initializeRetrySession
  } = useQuiz();
  
  const [currentQuestion, setCurrentQuestion] = useState(getCurrentQuestion());
  
  useEffect(() => {
    if (!loading && !error) {
      if (isSessionMode && !activeSession) {
        navigate('/');
        return;
      }
      
      if (!isSessionMode && !activeSession && subject) {
        navigate(`/setup/${subject}`);
        return;
      }
    }
  }, [activeSession, loading, error, subject, navigate, isSessionMode]);
  
  useEffect(() => {
    if (activeSession) {
      setCurrentQuestion(getCurrentQuestion());
    }
  }, [activeSession, getCurrentQuestion]);

  const handleContinue = () => {
    setShowAllQuestions(false);
  };
  
  const handleNewSession = () => {
    resetSession();
    if (isSessionMode) {
      navigate('/');
    } else if (subject) {
      navigate(`/setup/${subject}`);
    } else {
      navigate('/');
    }
  };
  
  const handleRetryIncorrect = async () => {
    if (activeSession) {
      await initializeRetrySession(activeSession.id);
      // The context will set a new active session, and useEffect will navigate
    }
  };
  
  const getEmoji = (subjectName: string | undefined) => {
    if (!subjectName) return subjectEmojis.default;
    return subjectEmojis[subjectName] || subjectEmojis.default;
  };
  
  const currentSubject = isSessionMode && activeSession ? activeSession.subject : subject;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="inline-block mb-6 relative">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center relative z-10">
              <span className="text-4xl">{getEmoji(currentSubject)}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#10B981]/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
          </div>
          <Loader size="lg" className="my-4" variant="primary" />
          <p className="text-[#6B7280] dark:text-gray-300 mt-4">Učitavanje kviza...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 text-center border-l-4 border-[#EF4444] animate-fadeIn">
          <svg className="w-16 h-16 text-[#EF4444] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-xl font-bold mb-2 text-[#111827] dark:text-white">Greška</h2>
          <p className="mb-6 text-[#6B7280] dark:text-gray-300">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all shadow-md flex items-center justify-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Nazad na početnu
          </button>
        </div>
      </div>
    );
  }
  
  if (!activeSession) {
    // This case should ideally be handled by the useEffect redirect, but it's a good fallback.
    return <Loader />;
  }
  
  const allQuestions = getAllQuestions();
  const progress = getProgress();
  
  if (activeSession.isCompleted || !currentQuestion || showAllQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {showAllQuestions ? (
            <div className="mt-8 animate-fadeIn">
              <QuizQuestionList 
                questions={allQuestions}
                quizType={activeSession.type}
                onJumpToQuestion={(index: number) => {
                  if (!activeSession.isCompleted) {
                    jumpToQuestion(index);
                    setShowAllQuestions(false);
                  }
                }}
                onBack={() => setShowAllQuestions(false)}
              />
            </div>
          ) : (
            <SessionSummary
              session={activeSession}
              onContinue={handleContinue}
              onNewSession={handleNewSession}
              onShowAllQuestions={() => setShowAllQuestions(true)}
              onRetryIncorrect={handleRetryIncorrect}
              showAllQuestions={showAllQuestions}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-full px-5 py-3 flex justify-between items-center shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] dark:bg-gray-700 flex items-center justify-center relative z-10">
                <span className="text-xl">{getEmoji(currentSubject)}</span>
              </div>
              <h1 className="font-bold text-lg capitalize text-[#111827] dark:text-white">{currentSubject}</h1>
              <span className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]">
                {activeSession.type === 'multiple-choice' ? 'Ponuđeni odgovori' : activeSession.type === 'input' ? 'Unos odgovora' : 'Ručni izbor'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-[#10B981] dark:text-[#34D399] font-medium">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {progress.correct}
              </div>
              <div className="flex items-center text-[#EF4444] dark:text-[#F87171] font-medium">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                {progress.incorrect}
              </div>
              <div className="flex items-center text-[#6B7280] dark:text-gray-400 font-medium">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {progress.skipped}
              </div>
              <button 
                onClick={() => setShowAllQuestions(true)} 
                className="ml-2 p-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Prikaži sva pitanja"
              >
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
              <button 
                onClick={handleNewSession} 
                className="p-2 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Prekini kviz"
              >
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-8 mt-6">
            <div className="flex justify-between items-center mb-2 text-sm px-1">
              <span className="text-[#6B7280] dark:text-gray-300">Pitanje {progress.completed + 1} od {progress.total}</span>
              <span className="font-medium text-[#111827] dark:text-white">{Math.round((progress.completed / progress.total) * 100)}%</span>
            </div>
            
            <div className="w-full h-2 bg-[#E5E7EB] dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] animate-progress" 
                style={{ 
                  width: `${(progress.completed / progress.total) * 100}%`,
                  '--progress-width': `${(progress.completed / progress.total) * 100}%`
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
        
        <div className="animate-slideInUp">
          <QuizCard
            question={currentQuestion}
            questionNumber={activeSession.questions.findIndex(q => q.id === currentQuestion.id) + 1}
            totalQuestions={activeSession.questions.length}
            onAnswer={answerQuestion}
            onSkip={skipQuestion}
            onJumpToQuestion={jumpToQuestion}
            allQuestions={getAllQuestions()}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz; 