'use client';

// Renk temaları
const colorThemes = [
  { 
    bg: 'bg-gradient-to-br from-green-400 to-teal-500', 
    border: 'border-teal-300',
    icon: 'text-teal-400'
  },
  { 
    bg: 'bg-gradient-to-br from-purple-400 to-indigo-500', 
    border: 'border-indigo-300',
    icon: 'text-indigo-400'
  },
  { 
    bg: 'bg-gradient-to-br from-red-400 to-rose-500', 
    border: 'border-rose-300',
    icon: 'text-rose-400'
  },
  { 
    bg: 'bg-gradient-to-br from-amber-400 to-orange-500', 
    border: 'border-orange-300',
    icon: 'text-orange-400'
  },
  { 
    bg: 'bg-gradient-to-br from-blue-400 to-cyan-500', 
    border: 'border-cyan-300',
    icon: 'text-cyan-400'
  },
  { 
    bg: 'bg-gradient-to-br from-pink-400 to-fuchsia-500', 
    border: 'border-fuchsia-300',
    icon: 'text-fuchsia-400'
  }
];

export default function MyVoteCard({ vote, themeIndex }) {
  // Seçilen temayı belirle
  const theme = colorThemes[themeIndex % colorThemes.length];

  return (
    <div className={`${theme.bg} p-1 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105 duration-300`}>
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-5 h-full">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full ${theme.border} border-2 flex items-center justify-center bg-gray-900`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme.icon}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white ml-3">{vote.title}</h3>
        </div>
        
        <p className="text-gray-300 mb-4">{vote.description}</p>
        
        <div className="text-xs font-medium text-white/70 flex justify-end">
          <div className="bg-white/10 px-3 py-1 rounded-full">
            Fikir #{vote.ideaId}
          </div>
        </div>
      </div>
    </div>
  );
} 