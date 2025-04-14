'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isAuthenticated, getUserInfo, removeTokenCookie } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const userInfo = getUserInfo();
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    removeTokenCookie();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-white">Fikir Oylama</h1>
          {!loading && (
            <div className="flex gap-4 items-center">
              {user ? (
                <>
                  <div className="text-white bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
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
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          )}
        </header>

        <main className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Fikirler için Güçlü Bir Platform
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Fikirlerinizi paylaşın, topluluk oylamasıyla en iyi fikirleri keşfedin 
              ve yeni düşüncelerin gelişimine katkıda bulunun.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-700 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg">Fikirlerinizi kolayca paylaşın</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-700 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg">Diğer fikirlere oy verin</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-700 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg">En popüler fikirleri keşfedin</p>
              </div>
            </div>

            <div className="mt-10">
              {user ? (
                <Link 
                  href="/ideas" 
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  Fikirlere Göz At
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-lg"
                >
                  Hemen Başla
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white p-8 rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-10 w-full bg-purple-100 rounded-lg"></div>
                <div className="h-24 w-full bg-purple-100 rounded-lg"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-green-100 rounded-full"></div>
                  <div className="h-8 flex-1 bg-green-100 rounded-lg"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
                  <div className="h-8 flex-1 bg-blue-100 rounded-lg"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-pink-100 rounded-full"></div>
                  <div className="h-8 flex-1 bg-pink-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
