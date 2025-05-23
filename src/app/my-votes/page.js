'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUserInfo } from '@/lib/auth';
import MyVoteCard from '@/components/MyVoteCard';

export default function MyVotesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Kullanıcı bilgisini kontrol et
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    const userInfo = getUserInfo();
    setUser(userInfo);
    
    // Kullanıcının oylarını getir
    fetchMyVotes();
  }, [router]);

  const fetchMyVotes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/vote/my-votes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Oylarınız alınamadı');
      }
      
      const data = await response.json();
      setVotes(data);
    } catch (err) {
      setError(err.message || 'Oylarınız yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-b from-purple-900 to-transparent h-64 relative">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-pink-600 rounded-full filter blur-3xl"></div>
          <div className="absolute top-32 right-32 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl"></div>
          <div className="absolute top-16 left-1/2 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl"></div>
        </div>
      </div>
    
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <header className="flex justify-between items-center mb-10">
          <Link href="/" className="text-3xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
            </svg>
            Fikir Oylama
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-white bg-purple-800/80 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{user.userName}</span>
              </div>
              
              <div className="flex gap-2">
                <Link 
                  href="/ideas"
                  className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-gray-700/80 transition-colors"
                >
                  Tüm Fikirler
                </Link>
                
                <Link 
                  href="/"
                  className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-gray-700/80 transition-colors"
                >
                  Ana Sayfa
                </Link>
              </div>
            </div>
          )}
        </header>

        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-8 mb-10">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Oylarım
          </h1>
          
          <p className="text-gray-300 mb-8">
            Şimdiye kadar oy verdiğiniz tüm fikirler burada listelenir. Farklı fikirlere göz atmak için "Tüm Fikirler" sayfasını ziyaret edebilirsiniz.
          </p>
          
          {error && (
            <div className="bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded">
              <p>{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : votes.length === 0 ? (
            <div className="text-center py-16 bg-gray-700/50 backdrop-blur-sm rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <div className="text-gray-300 text-lg">Henüz hiç fikre oy vermemişsiniz.</div>
              <Link 
                href="/ideas"
                className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-colors"
              >
                Fikirlere Göz At
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votes.map((vote, index) => (
                <MyVoteCard 
                  key={vote.ideaId}
                  vote={vote}
                  themeIndex={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 