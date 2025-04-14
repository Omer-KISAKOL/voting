import { NextResponse } from 'next/server';
import https from 'https';

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

    // API URL'sini ortam değişkeninden al, yoksa varsayılan değeri kullan
    const apiBaseUrl = process.env.API_BASE_URL || 'https://localhost:7253';

    // SSL doğrulamasını devre dışı bırakan HTTP aracısı
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // API'ye istek gönder
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, password }),
      agent: httpsAgent // SSL doğrulamasını atla
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