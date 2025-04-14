import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userName, email, password, isAdmin = false } = body;

    // Eksik parametreleri kontrol et
    if (!userName || !email || !password) {
      return NextResponse.json(
        { message: 'Kullanıcı adı, e-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // API'ye istek gönder
    const response = await fetch('https://localhost:7253/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify({ userName, email, password, isAdmin }),
    });

    // API'den gelen yanıtı al
    const data = await response.json();

    // API yanıtı başarılı değilse hata döndür
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Kayıt başarısız' },
        { status: response.status }
      );
    }

    // Başarılı kayıt, oluşturulan kullanıcı bilgilerini döndür
    return NextResponse.json(data);
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 