import { NextResponse } from 'next/server';
import https from 'https';
import { cookies } from 'next/headers';

// Oy verme (POST) işlemi
export async function POST(request) {
  try {
    const body = await request.json();
    const { ideaId } = body;

    // Eksik parametreleri kontrol et
    if (!ideaId) {
      return NextResponse.json(
        { message: 'Fikir ID gereklidir' },
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
    const response = await fetch(`${apiBaseUrl}/api/Vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ideaId }),
      agent: httpsAgent // SSL doğrulamasını atla
    });

    // API yanıtı başarılı değilse hata döndür
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Bu fikre zaten oy verdiniz.' },
        { status: response.status }
      );
    }

    // Başarılı işlem
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Oy verme hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 