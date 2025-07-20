import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Question, QuizSession, QuizType, QuizSettings, SessionSummary, QuestionStatus } from '../types/quiz';
import type { UnknownQuestionStat } from '../types/stats';
import { loadQuestions } from '../services/quizService';
import { v4 as uuidv4 } from 'uuid';

interface QuizContextType {
  activeSession: QuizSession | null;
  allSessions: SessionSummary[];
  unknownQuestionStats: UnknownQuestionStat[];
  loading: boolean;
  error: string | null;
  initializeSession: (settings: QuizSettings) => Promise<void>;
  initializeRetrySession: (sessionId: string) => Promise<void>;
  answerQuestion: (status: QuestionStatus, userAnswer?: string | string[]) => void;
  skipQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  resetSession: () => void;
  deleteSession: (sessionId: string) => void;
  continueSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newName: string) => void;
  resetUnknownStats: () => void;
  resetUnknownStatsForSubject: (subject: string) => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => { completed: number; total: number; correct: number; incorrect: number; skipped: number; partiallyCorrect: number };
  getSessions: (subject?: string) => SessionSummary[];
  getAllQuestions: () => Question[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const SESSIONS_STORAGE_KEY = 'quiz_sessions';
const UNKNOWN_STATS_KEY = 'unknown_question_stats';

// Generate a default session name based on subject and type
const generateSessionName = (subject: string, type: QuizType): string => {
  const typeNames = {
    'multiple-choice': 'Ponuđeni odgovori',
    'input': 'Unos odgovora',
    'manual': 'Ručni izbor'
  };
  
  const date = new Date();
  const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  return `${subject.charAt(0).toUpperCase() + subject.slice(1)} - ${typeNames[type]} (${formattedDate} ${formattedTime})`;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [allSessions, setAllSessions] = useState<QuizSession[]>([]);
  const [unknownQuestionStats, setUnknownQuestionStats] = useState<UnknownQuestionStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load sessions and stats from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (savedSessions) {
        setAllSessions(JSON.parse(savedSessions));
      }
      const savedStats = localStorage.getItem(UNKNOWN_STATS_KEY);
      if (savedStats) {
        setUnknownQuestionStats(JSON.parse(savedStats));
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
    }
  }, []);
  
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allSessions));
    } catch (err) {
      console.error('Error saving sessions to localStorage:', err);
    }
  }, [allSessions]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(UNKNOWN_STATS_KEY, JSON.stringify(unknownQuestionStats));
    } catch (err) {
      console.error('Error saving stats to localStorage:', err);
    }
  }, [unknownQuestionStats]);
  
  // Track incorrect/don't-know answers
  const trackUnknownQuestion = (question: Question, type: 'incorrect' | 'dont-know') => {
    setUnknownQuestionStats(prevStats => {
      const existingStatIndex = prevStats.findIndex(s => s.questionId === question.id && s.subject === activeSession?.subject);
      
      if (existingStatIndex !== -1) {
        // Update existing stat
        const updatedStats = [...prevStats];
        const existingStat = updatedStats[existingStatIndex];
        updatedStats[existingStatIndex] = {
          ...existingStat,
          incorrectCount: type === 'incorrect' ? existingStat.incorrectCount + 1 : existingStat.incorrectCount,
          dontKnowCount: type === 'dont-know' ? existingStat.dontKnowCount + 1 : existingStat.dontKnowCount,
          lastIncorrectTimestamp: Date.now(),
        };
        return updatedStats;
      } else {
        // Add new stat
        const newStat: UnknownQuestionStat = {
          questionId: question.id,
          subject: activeSession!.subject,
          questionText: question.question,
          incorrectCount: type === 'incorrect' ? 1 : 0,
          dontKnowCount: type === 'dont-know' ? 1 : 0,
          lastIncorrectTimestamp: Date.now(),
        };
        return [...prevStats, newStat];
      }
    });
  };

  // Initialize a new quiz session
  const initializeSession = async (settings: QuizSettings) => {
    setLoading(true);
    setError(null);
    
    try {
      // Load questions for the selected subject
      const allQuestions = await loadQuestions(settings.subject);
      
      // Filter questions based on the quiz type
      let eligibleQuestions = allQuestions;
      
      if (settings.type === 'multiple-choice') {
        // For multiple choice, only use questions with answers
        eligibleQuestions = allQuestions.filter(q => q.answers.length > 0);
      } else if (settings.type === 'input') {
        // For input, use all questions
        eligibleQuestions = allQuestions;
      }
      
      const [start, end] = settings.questionRange;

      if (eligibleQuestions.length < end) {
        throw new Error(`Nedovoljno pitanja za izabrani opseg. Dostupno: ${eligibleQuestions.length}, a traženo do ${end}.`);
      }
      
      // Select the requested number of questions (no shuffling)
      const selectedQuestions = eligibleQuestions.slice(start - 1, end);
      
      // Create a new session
      const newSession: QuizSession = {
        id: uuidv4(),
        name: settings.name || generateSessionName(settings.subject, settings.type),
        subject: settings.subject,
        type: settings.type,
        questions: selectedQuestions.map(q => ({ ...q, status: 'unanswered' })),
        currentQuestionIndex: 0,
        correctAnswers: 0,
        partiallyCorrectAnswers: 0,
        incorrectAnswers: 0,
        skippedQuestions: 0,
        remainingQuestions: [...selectedQuestions],
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        isCompleted: false
      };
      
      // Set as active session and add to all sessions
      setActiveSession(newSession);
      setAllSessions(prev => [...prev, newSession]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri inicijalizaciji kviza');
    } finally {
      setLoading(false);
    }
  };
  
  const initializeRetrySession = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    const sourceSession = allSessions.find(s => s.id === sessionId);
    if (!sourceSession) {
      setError("Original session not found");
      setLoading(false);
      return;
    }

    try {
      const incorrectQuestions = sourceSession.questions
        .filter(q => q.status === 'incorrect' || q.status === 'partially-correct')
        .map(q => ({ ...q, status: 'unanswered' as QuestionStatus, userAnswer: undefined }));

      if (incorrectQuestions.length === 0) {
        setError("No incorrect questions to retry.");
        setLoading(false);
        return;
      }

      const newSession: QuizSession = {
        id: uuidv4(),
        name: `Pokušaj ponovo - ${sourceSession.name}`,
        subject: sourceSession.subject,
        type: sourceSession.type,
        questions: incorrectQuestions,
        currentQuestionIndex: 0,
        correctAnswers: 0,
        partiallyCorrectAnswers: 0,
        incorrectAnswers: 0,
        skippedQuestions: 0,
        remainingQuestions: [...incorrectQuestions],
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        isCompleted: false
      };

      setActiveSession(newSession);
      setAllSessions(prev => [...prev, newSession]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri ponovnom pokretanju kviza');
    } finally {
      setLoading(false);
    }
  };
  
  // Answer the current question
  const answerQuestion = (status: QuestionStatus, userAnswer?: string | string[]) => {
    if (!activeSession) return;
    
    // Get the current question
    const currentQuestion = activeSession.questions[activeSession.currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Track incorrect answers for the "Ovo ne znaš" feature
    if (status === 'incorrect' || status === 'dont-know') {
      trackUnknownQuestion(currentQuestion, status);
    }

    // Update the question status
    const updatedQuestion = {
      ...currentQuestion,
      status: status,
      userAnswer: userAnswer,
      timestamp: Date.now()
    };
    
    // Update the questions array with the new status
    const updatedQuestions = activeSession.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    
    // Find the index of the next unanswered question
    const nextQuestionIndex = updatedQuestions.findIndex((q, index) => 
      index > activeSession.currentQuestionIndex && q.status === 'unanswered'
    );
    
    // Update session
    const updatedSession: QuizSession = {
      ...activeSession,
      questions: updatedQuestions,
      currentQuestionIndex: nextQuestionIndex, // -1 if no more unanswered questions
      correctAnswers: status === 'correct' 
        ? activeSession.correctAnswers + 1 
        : activeSession.correctAnswers,
      partiallyCorrectAnswers: status === 'partially-correct'
        ? activeSession.partiallyCorrectAnswers + 1
        : activeSession.partiallyCorrectAnswers,
      incorrectAnswers: (status === 'incorrect' || status === 'dont-know')
        ? activeSession.incorrectAnswers + 1 
        : activeSession.incorrectAnswers,
      lastUpdatedAt: Date.now(),
      isCompleted: nextQuestionIndex === -1
    };
    
    // Update active session and all sessions
    setActiveSession(updatedSession);
    setAllSessions(prev => 
      prev.map(session => session.id === updatedSession.id ? updatedSession : session)
    );
  };
  
  // Skip the current question
  const skipQuestion = () => {
    if (!activeSession) return;
    
    // Get the current question
    const currentQuestion = activeSession.questions[activeSession.currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Update the question status
    const updatedQuestion = {
      ...currentQuestion,
      status: 'skipped' as QuestionStatus,
      timestamp: Date.now()
    };
    
    // Update the questions array with the new status
    const updatedQuestions = activeSession.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    
    // Find the next question to ask (either unanswered or skipped)
    let nextQuestionIndex = -1;
    let searched = 0;
    let currentIndex = activeSession.currentQuestionIndex;

    while (searched < updatedQuestions.length) {
      currentIndex = (currentIndex + 1) % updatedQuestions.length;
      if (updatedQuestions[currentIndex].status === 'unanswered') {
        nextQuestionIndex = currentIndex;
        break;
      }
      searched++;
    }
    
    // Update session
    const updatedSession: QuizSession = {
      ...activeSession,
      questions: updatedQuestions,
      currentQuestionIndex: nextQuestionIndex, // -1 if no more unanswered questions
      skippedQuestions: activeSession.skippedQuestions + 1,
      lastUpdatedAt: Date.now(),
      isCompleted: nextQuestionIndex === -1
    };
    
    // Update active session and all sessions
    setActiveSession(updatedSession);
    setAllSessions(prev => 
      prev.map(session => session.id === updatedSession.id ? updatedSession : session)
    );
  };
  
  // Jump to a specific question
  const jumpToQuestion = (index: number) => {
    if (!activeSession || index < 0 || index >= activeSession.questions.length) return;
    
    const updatedSession: QuizSession = {
      ...activeSession,
      currentQuestionIndex: index,
      lastUpdatedAt: Date.now()
    };
    
    setActiveSession(updatedSession);
    setAllSessions(prev => 
      prev.map(session => session.id === updatedSession.id ? updatedSession : session)
    );
  };
  
  // Reset the active session
  const resetSession = () => {
    setActiveSession(null);
  };
  
  // Delete a session
  const deleteSession = (sessionId: string) => {
    // If it's the active session, reset it
    if (activeSession && activeSession.id === sessionId) {
      resetSession();
    }
    
    // Remove from all sessions
    setAllSessions(prev => prev.filter(session => session.id !== sessionId));
  };
  
  // Rename a session
  const renameSession = (sessionId: string, newName: string) => {
    // Update in all sessions
    setAllSessions(prev => 
      prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            name: newName,
            lastUpdatedAt: Date.now()
          };
        }
        return session;
      })
    );
    
    // If it's the active session, update it too
    if (activeSession && activeSession.id === sessionId) {
      setActiveSession({
        ...activeSession,
        name: newName,
        lastUpdatedAt: Date.now()
      });
    }
  };
  
  // Continue an existing session
  const continueSession = (sessionId: string) => {
    const session = allSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
    }
  };
  
  // Reset all unknown stats
  const resetUnknownStats = () => {
    setUnknownQuestionStats([]);
  };
  
  const resetUnknownStatsForSubject = (subject: string) => {
    setUnknownQuestionStats(prev => prev.filter(stat => stat.subject !== subject));
  };
  
  // Get the current question
  const getCurrentQuestion = () => {
    if (!activeSession || activeSession.currentQuestionIndex === -1) return null;
    return activeSession.questions[activeSession.currentQuestionIndex];
  };
  
  // Get all questions in the active session
  const getAllQuestions = () => {
    if (!activeSession) return [];
    return activeSession.questions;
  };
  
  // Get progress information
  const getProgress = () => {
    if (!activeSession) {
      return { completed: 0, total: 0, correct: 0, incorrect: 0, skipped: 0, partiallyCorrect: 0 };
    }
    
    const { questions, correctAnswers, incorrectAnswers, skippedQuestions, partiallyCorrectAnswers } = activeSession;
    const total = questions.length;
    const completed = correctAnswers + incorrectAnswers + skippedQuestions + partiallyCorrectAnswers;
    
    return {
      completed,
      total,
      correct: correctAnswers,
      incorrect: incorrectAnswers,
      skipped: skippedQuestions,
      partiallyCorrect: partiallyCorrectAnswers
    };
  };
  
  // Get sessions, optionally filtered by subject
  const getSessions = (subject?: string): SessionSummary[] => {
    const sessions = allSessions
      .filter(session => !subject || session.subject === subject)
      .map(session => {
        const { questions, correctAnswers, incorrectAnswers, skippedQuestions, partiallyCorrectAnswers } = session;
        const total = questions.length;
        const completed = correctAnswers + incorrectAnswers + skippedQuestions + partiallyCorrectAnswers;
        const percentageCorrect = total > 0 ? Math.round(((correctAnswers + partiallyCorrectAnswers * 0.5) / total) * 100) : 0;
        
        return {
          id: session.id,
          name: session.name,
          subject: session.subject,
          type: session.type,
          questionsCount: total,
          correctAnswers,
          partiallyCorrectAnswers,
          incorrectAnswers,
          skippedQuestions,
          completedCount: completed,
          percentageCorrect,
          createdAt: session.createdAt,
          lastUpdatedAt: session.lastUpdatedAt,
          isCompleted: session.isCompleted
        };
      })
      .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt); // Sort by last updated, newest first
      
    return sessions;
  };
  
  const contextValue: QuizContextType = {
    activeSession,
    allSessions: allSessions.map(session => {
      const { questions, correctAnswers, incorrectAnswers, skippedQuestions, partiallyCorrectAnswers } = session;
      const total = questions.length;
      const completed = correctAnswers + incorrectAnswers + skippedQuestions + partiallyCorrectAnswers;
      const percentageCorrect = total > 0 ? Math.round(((correctAnswers + partiallyCorrectAnswers * 0.5) / total) * 100) : 0;
      
      return {
        id: session.id,
        name: session.name,
        subject: session.subject,
        type: session.type,
        questionsCount: total,
        correctAnswers,
        partiallyCorrectAnswers,
        incorrectAnswers,
        skippedQuestions,
        completedCount: completed,
        percentageCorrect,
        createdAt: session.createdAt,
        lastUpdatedAt: session.lastUpdatedAt,
        isCompleted: session.isCompleted
      };
    }),
    unknownQuestionStats,
    loading,
    error,
    initializeSession,
    initializeRetrySession,
    answerQuestion,
    skipQuestion,
    jumpToQuestion,
    resetSession,
    deleteSession,
    continueSession,
    renameSession,
    resetUnknownStats,
    resetUnknownStatsForSubject,
    getCurrentQuestion,
    getProgress,
    getSessions,
    getAllQuestions
  };
  
  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export default useQuiz; 