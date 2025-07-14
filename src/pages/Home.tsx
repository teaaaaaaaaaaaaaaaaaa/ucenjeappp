import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionCard from '../components/quiz/SessionCard';
import Button from '../components/ui/Button';
import useQuiz from '../hooks/useQuiz';
import Loader from '../components/shared/Loader';
import { getAvailableSubjects } from '../services/quizService';
import UnknownStats from '../components/stats/UnknownStats';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getSessions, continueSession, deleteSession, renameSession } = useQuiz();
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch available subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjects = await getAvailableSubjects();
        setAvailableSubjects(subjects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);
  
  // Get sessions for the selected subject
  const sessions = getSessions(selectedSubject || undefined);
  
  // Handle continue session
  const handleContinueSession = (sessionId: string) => {
    continueSession(sessionId);
    navigate('/quiz/session');
  };
  
  // Handle delete session
  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };
  
  // Handle rename session
  const handleRenameSession = (sessionId: string, newName: string) => {
    renameSession(sessionId, newName);
  };
  
  // Handle navigate to setup
  const handleNavigateToSetup = (subject: string) => {
    navigate(`/setup/${subject}`);
  };
  
  // Get emoji for subject
  const getEmoji = (subject: string) => {
    const emojis: Record<string, string> = {
      linux: '🐧',
      'linux-deep': '🐧',
      programming: '💻',
      default: '📚'
    };
    
    return emojis[subject] || emojis.default;
  };
  
  // Get display name for subject
  const getSubjectDisplayName = (subject: string) => {
    if (subject === 'linux-deep') {
      return 'Linux Deep';
    }
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="inline-block mb-6 relative">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center relative z-10">
              <span className="text-4xl">📚</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#10B981]/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
          </div>
          <Loader size="lg" className="my-4" variant="primary" />
          <p className="text-[#6B7280] dark:text-gray-300 mt-4">Učitavanje aplikacije...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#EEF2FF] dark:from-[#111827] dark:to-[#1F2937] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-block mb-6 relative">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center relative z-10">
              <span className="text-4xl">🧠</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#10B981]/20 rounded-full blur-xl opacity-70 animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white mb-2">Dobrodošli u Kviz Aplikaciju</h1>
          <p className="text-[#6B7280] dark:text-gray-300">Izaberite temu i započnite novi kviz ili nastavite sa postojećom sesijom.</p>
        </div>
        
        {/* Subject selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Izaberite temu
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedSubject(null)}
                className={`p-4 rounded-lg border transition-all flex items-center ${
                  selectedSubject === null
                    ? 'border-[#2563EB] bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]'
                    : 'border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-[#111827] dark:text-white mb-1">Sve teme</h3>
                  <p className="text-xs text-[#6B7280] dark:text-gray-400">
                    {sessions.length} {sessions.length === 1 ? 'sesija' : sessions.length > 1 && sessions.length < 5 ? 'sesije' : 'sesija'}
                  </p>
                </div>
              </button>
              
              {availableSubjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`p-4 rounded-lg border transition-all flex items-center ${
                    selectedSubject === subject
                      ? 'border-[#2563EB] bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]'
                      : 'border-gray-200 dark:border-gray-700 text-[#6B7280] dark:text-gray-300 hover:bg-[#F9FAFB] dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#EBF5FF] dark:bg-[#2563EB]/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-2xl">{getEmoji(subject)}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#111827] dark:text-white mb-1 capitalize">{getSubjectDisplayName(subject)}</h3>
                    <p className="text-xs text-[#6B7280] dark:text-gray-400">
                      {getSessions(subject).length} {getSessions(subject).length === 1 ? 'sesija' : getSessions(subject).length > 1 && getSessions(subject).length < 5 ? 'sesije' : 'sesija'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            
            {selectedSubject && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={() => handleNavigateToSetup(selectedSubject)}
                  className="bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Novi kviz
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {selectedSubject ? `${getSubjectDisplayName(selectedSubject)} sesije` : 'Sve sesije'}
            </h2>
          </div>
          
          <div className="p-6">
            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => (
                  <SessionCard 
                    key={session.id}
                    session={session}
                    onClick={handleContinueSession}
                    onDelete={handleDeleteSession}
                    onRename={handleRenameSession}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F3F4F6] dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#111827] dark:text-white mb-2">Nema sesija</h3>
                <p className="text-[#6B7280] dark:text-gray-400 mb-6">
                  {selectedSubject 
                    ? `Nema sačuvanih sesija za temu ${getSubjectDisplayName(selectedSubject)}.` 
                    : 'Nema sačuvanih sesija. Započnite novi kviz da biste kreirali sesiju.'}
                </p>
                
                {selectedSubject && (
                  <Button 
                    onClick={() => handleNavigateToSetup(selectedSubject)}
                    className="bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Započni prvi kviz
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* "Ovo ne znaš" Stats Section */}
        <UnknownStats />
      </div>
    </div>
  );
};

export default Home; 