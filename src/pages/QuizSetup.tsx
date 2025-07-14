import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import useQuiz from '../hooks/useQuiz';
import Loader from '../components/shared/Loader';
import { loadQuestions } from '../services/quizService';
import { Slider } from '@/components/ui/Slider';

const QuizSetup: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { initializeSession, loading, error } = useQuiz();
  
  const [quizType, setQuizType] = useState<'multiple-choice' | 'input'>('multiple-choice');
  const [questionRange, setQuestionRange] = useState<[number, number]>([1, 10]);
  const [sessionName, setSessionName] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState<{mcq: number, input: number, total: number}>({mcq: 0, input: 0, total: 0});
  const [maxQuestions, setMaxQuestions] = useState(20);
  
  useEffect(() => {
    async function fetchQuestionCounts() {
      if (subject) {
        try {
          const allQuestions = await loadQuestions(subject);
          const mcqQuestions = allQuestions.filter(q => q.answers.length > 0);
          setAvailableQuestions({ 
            mcq: mcqQuestions.length, 
            input: allQuestions.length, 
            total: allQuestions.length 
          });
        } catch (e) {
          console.error("Failed to load questions for count", e);
        }
      }
    }
    fetchQuestionCounts();
  }, [subject]);
  
  useEffect(() => {
    const currentMax = quizType === 'multiple-choice' ? availableQuestions.mcq : availableQuestions.input;
    setMaxQuestions(currentMax > 0 ? currentMax : 20);
    if (questionRange[1] > currentMax && currentMax > 0) {
      setQuestionRange([questionRange[0], currentMax]);
    }
    if (questionRange[0] > currentMax && currentMax > 0) {
      setQuestionRange([1, currentMax]);
    }
  }, [quizType, availableQuestions, questionRange]);
  
  const handleRangeChange = (value: number[]) => {
    if (value.length === 2) {
      setQuestionRange([value[0], value[1]]);
    }
  };
  
  // Generate default session name when subject or quiz type changes
  useEffect(() => {
    if (subject) {
      const typeNames = {
        'multiple-choice': 'Ponuđeni odgovori',
        'input': 'Unos odgovora'
      };
      
      const date = new Date();
      const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      const displayName = subject === 'linux-deep' ? 'Linux Deep' : subject.charAt(0).toUpperCase() + subject.slice(1);
      setSessionName(`${displayName} - ${typeNames[quizType]} (${formattedDate} ${formattedTime})`);
    }
  }, [subject, quizType]);
  
  // Get emoji for subject
  const getEmoji = (subjectName: string | undefined) => {
    const emojis: Record<string, string> = {
      linux: '🐧',
      'linux-deep': '🐧',
      programming: '💻',
      default: '📚'
    };
    
    if (!subjectName) return emojis.default;
    return emojis[subjectName] || emojis.default;
  };
  
  // Handle start quiz
  const handleStartQuiz = async () => {
    if (!subject) return;
    
    try {
      await initializeSession({
        subject,
        type: quizType,
        questionRange: questionRange,
        name: sessionName.trim()
      });
      
      navigate('/quiz/' + subject);
    } catch (err) {
      console.error('Error starting quiz:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-block mb-6 relative">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center relative z-10">
              <span className="text-4xl">{getEmoji(subject)}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#10B981]/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-2 capitalize">
            {subject === 'linux-deep' ? 'Linux Deep' : subject} Kviz
          </h1>
          <p className="text-[#6B7280] dark:text-gray-300">
            Podesite parametre kviza pre početka
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 rounded-md bg-[#FEF2F2] dark:bg-[#EF4444]/10 border border-[#EF4444]/20 dark:border-[#EF4444]/30 text-[#EF4444] dark:text-[#F87171]">
                {error}
              </div>
            )}
            
            <div className="space-y-8">
              {/* Session Name */}
              <div>
                <label htmlFor="session-name" className="block text-sm font-medium mb-2 text-[#111827] dark:text-white">
                  Naziv sesije
                </label>
                <input
                  type="text"
                  id="session-name"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                  placeholder="Unesite naziv sesije"
                />
              </div>
              
              {/* Quiz Type */}
              <div>
                <label className="block text-sm font-medium mb-4 text-[#111827] dark:text-white">
                  Tip pitanja
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setQuizType('multiple-choice')}
                    className={`p-4 rounded-lg border transition-all flex items-center ${
                      quizType === 'multiple-choice'
                        ? 'border-[#2563EB] bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]'
                        : 'border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-[#111827] dark:text-white mb-1">Ponuđeni odgovori</h3>
                      <p className="text-xs text-[#6B7280] dark:text-gray-400">
                        {availableQuestions.mcq} pitanja
                      </p>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setQuizType('input')}
                    className={`p-4 rounded-lg border transition-all flex items-center ${
                      quizType === 'input'
                        ? 'border-[#2563EB] bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]'
                        : 'border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-[#111827] dark:text-white mb-1">Unos odgovora</h3>
                      <p className="text-xs text-[#6B7280] dark:text-gray-400">
                        {availableQuestions.input} pitanja
                      </p>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Question Range Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="question-range" className="block text-sm font-medium text-[#111827] dark:text-white">
                    Opseg pitanja (max: {maxQuestions})
                  </label>
                  <span className="bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {questionRange[0]} - {questionRange[1]}
                  </span>
                </div>
                
                <div className="my-4">
                    <Slider
                        defaultValue={questionRange}
                        value={questionRange}
                        onValueChange={handleRangeChange}
                        min={1}
                        max={maxQuestions}
                        step={1}
                        minStepsBetweenThumbs={1}
                        disabled={maxQuestions === 0}
                    />
                </div>
              </div>
              
              {/* Warning if there are not enough questions */}
              {maxQuestions === 0 && (
                <div className="p-4 rounded-lg bg-[#FEF2F2] dark:bg-[#EF4444]/10 border border-[#EF4444]/20 dark:border-[#EF4444]/30 flex items-start">
                  <svg className="w-5 h-5 text-[#EF4444] mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-sm text-[#EF4444] dark:text-[#F87171]">
                    Nedovoljno pitanja za izabrani tip kviza. Molimo izaberite drugi tip ili temu.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 bg-[#F9FAFB] dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg font-medium transition-all border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F3F4F6] dark:hover:bg-gray-600 flex items-center justify-center sm:flex-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Nazad
            </button>
            
            <Button 
              onClick={handleStartQuiz}
              disabled={loading || maxQuestions === 0 || !sessionName.trim()}
              className="px-6 py-3 rounded-lg font-medium transition-all bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white hover:shadow-lg flex items-center justify-center sm:flex-1"
            >
              {loading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Učitavanje...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                  Pokreni kviz
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup; 