import { NextResponse } from 'next/server';
import https from 'https';
import { cookies } from 'next/headers';

// Fikirleri getirme (GET) işlemi
export async function GET(request) {
  try {
    // API URL'ini ortam değişkeninden al, yoksa varsayılan değeri kullan
    const apiBaseUrl = process.env.API_BASE_URL || 'https://localhost:7253';
    
    // Cookie'den token'ı al
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    // SSL doğrulamasını devre dışı bırakan HTTP aracısı
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // API'ye istek gönder
    const response = await fetch(`${apiBaseUrl}/api/Idea`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      agent: httpsAgent // SSL doğrulamasını atla
    });

    // API'den gelen yanıtı al
    const data = await response.json();

    // API yanıtı başarılı değilse hata döndür
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Fikirler alınamadı' },
        { status: response.status }
      );
    }

    // Başarılı işlem, fikirleri döndür
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fikir listeleme hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// Fikir oluşturma (POST) işlemi
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // Eksik parametreleri kontrol et
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Başlık ve açıklama gereklidir' },
        { status: 400 }
      );
    }

    // API URL'ini ortam değişkeninden al, yoksa varsayılan değeri kullan
    const apiBaseUrl = process.env.API_BASE_URL || 'https://localhost:7253';
    
    // Cookie'den token'ı al
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    // SSL doğrulamasını devre dışı bırakan HTTP aracısı
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    // API'ye istek gönder
    const response = await fetch(`${apiBaseUrl}/api/Idea`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: 0, title, description }),
      agent: httpsAgent // SSL doğrulamasını atla
    });

    // API'den gelen yanıtı al
    const data = await response.json();

    // API yanıtı başarılı değilse hata döndür
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Fikir oluşturulamadı' },
        { status: response.status }
      );
    }

    // Başarılı işlem, oluşturulan fikri döndür
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fikir oluşturma hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 