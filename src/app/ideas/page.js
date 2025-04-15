'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUserInfo } from '@/lib/auth';
import IdeaCard from '@/components/IdeaCard';

export default function IdeasPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Kullanıcı bilgisini kontrol et
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const userInfo = getUserInfo();
    setUser(userInfo);
    
    // Fikirleri getir
    fetchIdeas();
  }, [router, refreshKey]);

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fikirleri getir
      const ideasResponse = await fetch('/api/idea', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!ideasResponse.ok) {
        const errorData = await ideasResponse.json();
        throw new Error(errorData.message || 'Fikirler alınamadı');
      }
      
      // Fikirler verisini al
      const ideasData = await ideasResponse.json();
      
      // Fikirleri ID'ye göre büyükten küçüğe sırala
      const sortedIdeas = [...ideasData].sort((a, b) => b.id - a.id);
      
      // Sıralanmış fikirleri göster, sonra oy sayılarını eklemeyi dene
      setIdeas(sortedIdeas);
      
      try {
        // Oy sayılarını getirmeyi dene
        const votesResponse = await fetch('/api/vote/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        // Oy sayıları başarıyla alındıysa, fikirleri güncelle
        if (votesResponse.ok) {
          const votesData = await votesResponse.json();
          
          // Fikirler ile oy sayılarını eşleştir
          const ideasWithVotes = ideasData.map(idea => {
            // Oy sayısı verisi içinde fikir ID'sine sahip olanı bul
            const voteInfo = votesData.find(vote => vote.ideaId === idea.id);
            
            // Oy sayısını ekle (varsa)
            return {
              ...idea,
              voteCount: voteInfo ? voteInfo.voteCount : 0
            };
          });
          
          // Oy sayılarını ekledikten sonra fikirleri ID'ye göre büyükten küçüğe sırala
          const sortedIdeasWithVotes = [...ideasWithVotes].sort((a, b) => b.id - a.id);
          setIdeas(sortedIdeasWithVotes);
        } else {
          console.log("Oy sayıları alınamadı, ama fikirler gösteriliyor");
        }
      } catch (voteErr) {
        // Oy sayıları alınırken hata olsa bile, fikirler gösteriliyor
        console.error("Oy sayıları alınırken hata:", voteErr);
      }
    } catch (err) {
      setError(err.message || 'Fikirler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (ideaId) => {
    // Fikirleri yeniden getir
    setRefreshKey(old => old + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="text-3xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
            </svg>
            Fikir Oylama
          </Link>
          
          {user && (
            <div className="flex items-center gap-4 mr-2">
              <div className="text-white bg-indigo-700 px-4 py-2 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{user.userName}</span>
                {user.role === "Admin" && (
                  <span className="ml-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                
                <Link 
                  href="/my-votes"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  Oylarım
                </Link>
                
                <Link 
                  href="/"
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Ana Sayfa
                </Link>
              </div>
            </div>
          )}
        </header>

        <main>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Tüm Fikirler</h1>
            
            {user && user.role === 'Admin' && (
              <Link
                href="/ideas/create"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Yeni Fikir Ekle
              </Link>
            )}
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-white text-lg">Henüz hiç fikir eklenmemiş.</div>
              {user && user.role === 'Admin' && (
                <Link 
                  href="/ideas/create"
                  className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-colors"
                >
                  İlk Fikri Ekle
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea, index) => (
                <IdeaCard 
                  key={idea.id}
                  idea={idea}
                  userRole={user?.role}
                  onVote={handleVote}
                  themeIndex={index}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 