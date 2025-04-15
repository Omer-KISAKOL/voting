'use client';

import { useState } from 'react';

// Renk temaları
const colorThemes = [
  { 
    bg: 'bg-gradient-to-br from-purple-400 to-indigo-500', 
    button: 'from-indigo-600 to-purple-700',
    hover: 'from-indigo-700 to-purple-800',
    light: 'bg-indigo-100 text-indigo-800'
  },
  { 
    bg: 'bg-gradient-to-br from-blue-400 to-teal-500', 
    button: 'from-teal-600 to-blue-700',
    hover: 'from-teal-700 to-blue-800',
    light: 'bg-teal-100 text-teal-800'
  },
  { 
    bg: 'bg-gradient-to-br from-pink-400 to-rose-500', 
    button: 'from-rose-600 to-pink-700',
    hover: 'from-rose-700 to-pink-800',
    light: 'bg-rose-100 text-rose-800'
  },
  { 
    bg: 'bg-gradient-to-br from-orange-400 to-amber-500', 
    button: 'from-amber-600 to-orange-700',
    hover: 'from-amber-700 to-orange-800',
    light: 'bg-amber-100 text-amber-800'
  },
  { 
    bg: 'bg-gradient-to-br from-green-400 to-emerald-500', 
    button: 'from-emerald-600 to-green-700',
    hover: 'from-emerald-700 to-green-800',
    light: 'bg-emerald-100 text-emerald-800'
  }
];

export default function IdeaCard({ idea, userRole, onVote, themeIndex }) {
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Seçilen temayı belirle, ideaId'ye göre rotasyon yaparak
  const theme = colorThemes[themeIndex % colorThemes.length];

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    setError('');
    setVoteSuccess(false);
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ideaId: idea.id }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Oy verme işlemi başarısız');
      }
      
      setVoteSuccess(true);
      
      // Parent bileşeni bilgilendir
      if (onVote) {
        onVote(idea.id);
      }
      
      // 2 saniye sonra başarı mesajını gizle
      setTimeout(() => {
        setVoteSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Oy verme sırasında bir hata oluştu');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 duration-300 ${theme.bg}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{idea.title}</h3>
          
          {userRole === 'Admin' && (
            <div className={`px-3 py-1 rounded-full ${theme.light} flex items-center gap-1`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="font-semibold">{idea.voteCount || 0}</span>
            </div>
          )}
        </div>
        <p className="text-white/90 mb-6">{idea.description}</p>
        
        <div className="mt-auto">
          <div>
            {error && (
              <div className="text-red-200 text-sm mb-2 bg-red-900/20 p-2 rounded">
                {error}
              </div>
            )}
            
            {voteSuccess && (
              <div className="text-green-200 text-sm mb-2 bg-green-900/20 p-2 rounded">
                Oyunuz başarıyla kaydedildi!
              </div>
            )}
            
            <button
              onClick={handleVote}
              disabled={isVoting}
              className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${theme.button} hover:${theme.hover} text-white font-medium transition-all
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
            >
              {isVoting ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              )}
              {isVoting ? 'Oy Veriliyor...' : 'Oy Ver'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 