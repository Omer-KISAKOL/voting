import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userName, password } = body;

    // Eksik parametreleri kontrol et
    if (!userName || !password) {
      return NextResponse.json(
        { message: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // API'ye istek gönder
    const response = await fetch('https://localhost:7253/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
    });

    // API'den gelen yanıtı al
    const data = await response.json();

    // API yanıtı başarılı değilse hata döndür
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Giriş başarısız' },
        { status: response.status }
      );
    }

    // Başarılı giriş, token ve kullanıcı bilgilerini döndür
    return NextResponse.json(data);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 