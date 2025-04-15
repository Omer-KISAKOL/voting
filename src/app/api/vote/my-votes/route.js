import { NextResponse } from 'next/server';
import https from 'https';
import { cookies } from 'next/headers';

// Kullanıcının kendi oylarını getirme (GET) işlemi
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
    const response = await fetch(`${apiBaseUrl}/api/Vote/my-votes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      agent: httpsAgent // SSL doğrulamasını atla
    });

    // Yanıt durumunu kontrol et
    if (!response.ok) {
      return NextResponse.json(
        { message: `API yanıt hatası: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Yanıt içeriğini kontrol et
    const text = await response.text();
    
    if (!text || text.trim() === '') {
      // Boş yanıt durumunda boş dizi döndür
      console.log('Oy sayıları API boş yanıt döndü');
      return NextResponse.json([]);
    }
    
    let data;
    try {
      // Metin yanıtını JSON'a dönüştür
      data = JSON.parse(text);
    } catch (error) {
      console.error('JSON ayrıştırma hatası:', error, 'Alınan yanıt:', text);
      return NextResponse.json(
        { message: 'API yanıtı ayrıştırılamadı' },
        { status: 500 }
      );
    }

    // Başarılı işlem, kullanıcının oylarını döndür
    return NextResponse.json(data);
  } catch (error) {
    console.error('Kullanıcı oyları listeme hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 