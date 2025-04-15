import { NextResponse } from 'next/server';

export function middleware(request) {
  // API route'larını kontrol et
  if (request.nextUrl.pathname.startsWith('/api/idea') || 
      request.nextUrl.pathname.startsWith('/api/vote')) {
    
    // Token varlığını kontrol et - middleware Next.js cookies API'sini kullanamıyor, 
    // doğrudan request.cookies'i kullanıyoruz
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

// Middleware'i hangi yollar için çalıştırılacağını tanımla
export const config = {
  matcher: ['/api/idea/:path*', '/api/vote/:path*'],
}; 