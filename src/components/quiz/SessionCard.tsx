import React from 'react';
import type { SessionSummary } from '../../types/quiz';
import { formatDistanceToNow } from 'date-fns';

interface SessionCardProps {
  session: SessionSummary;
  onClick: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onRename: (sessionId: string, newName: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onClick, onDelete, onRename }) => {
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [newName, setNewName] = React.useState(session.name);
  
  // Calculate percentage completed
  const percentageCompleted = session.percentageCorrect;
  
  // Determine the status color based on completion percentage
  const getStatusColor = () => {
    if (session.isCompleted) {
      if (percentageCompleted >= 80) return 'bg-[#10B981] dark:bg-[#10B981]';
      if (percentageCompleted >= 60) return 'bg-[#2563EB] dark:bg-[#2563EB]';
      if (percentageCompleted >= 40) return 'bg-[#F59E0B] dark:bg-[#F59E0B]';
      return 'bg-[#EF4444] dark:bg-[#EF4444]';
    }
    return 'bg-[#6B7280] dark:bg-gray-500';
  };
  
  const handleRename = () => {
    if (newName.trim() && newName !== session.name) {
      onRename(session.id, newName.trim());
    }
    setIsRenaming(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(session.name);
      setIsRenaming(false);
    }
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
      onClick={() => !isRenaming && onClick(session.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isRenaming ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename();
                    }}
                    className="p-2 rounded-md bg-[#10B981] text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewName(session.name);
                      setIsRenaming(false);
                    }}
                    className="p-2 rounded-md bg-[#EF4444] text-white ml-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <h3 className="font-bold text-lg text-[#111827] dark:text-white">{session.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                  className="ml-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-[#6B7280] dark:text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
              </div>
            )}
            <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 capitalize">{session.subject}</p>
          </div>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            session.type === 'multiple-choice' 
              ? 'bg-[#EBF5FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]' 
              : 'bg-[#F3F4F6] dark:bg-gray-700 text-[#6B7280] dark:text-gray-400'
          }`}>
            {session.type === 'multiple-choice' ? 'Ponuđeni odgovori' : 'Unos odgovora'}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-[#6B7280] dark:text-gray-400">Napredak</span>
              <span className="text-sm font-medium text-[#111827] dark:text-white">
                {session.completedCount} / {session.questionsCount} ({Math.round(percentageCompleted)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-[#E5E7EB] dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStatusColor()}`} 
                style={{ width: `${percentageCompleted}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#ECFDF5] dark:bg-[#10B981]/10 border border-[#10B981]/20 dark:border-[#10B981]/30 rounded-lg p-2 text-center">
              <p className="text-xs text-[#6B7280] dark:text-gray-400">Tačno</p>
              <p className="font-bold text-[#10B981] dark:text-[#34D399]">{session.correctAnswers}</p>
            </div>
            <div className="bg-[#FEF2F2] dark:bg-[#EF4444]/10 border border-[#EF4444]/20 dark:border-[#EF4444]/30 rounded-lg p-2 text-center">
              <p className="text-xs text-[#6B7280] dark:text-gray-400">Netačno</p>
              <p className="font-bold text-[#EF4444] dark:text-[#F87171]">{session.incorrectAnswers}</p>
            </div>
            <div className="bg-[#F3F4F6] dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center">
              <p className="text-xs text-[#6B7280] dark:text-gray-400">Preskočeno</p>
              <p className="font-bold text-[#6B7280] dark:text-gray-400">{session.skippedQuestions}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-[#F9FAFB] dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <span className="text-xs text-[#6B7280] dark:text-gray-400">
          {formatDistanceToNow(new Date(session.lastUpdatedAt), { addSuffix: true })}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(session.id);
          }}
          className="p-2 rounded-md hover:bg-[#FEF2F2] dark:hover:bg-[#EF4444]/10 text-[#EF4444] dark:text-[#F87171]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SessionCard; 