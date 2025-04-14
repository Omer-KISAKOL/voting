'use client';

import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Token'ı cookie'ye kaydet
export const setTokenCookie = (token) => {
  Cookies.set('token', token, { expires: 7, path: '/' }); // 7 gün geçerli
};

// Cookie'den token'ı al
export const getTokenFromCookie = () => {
  return Cookies.get('token');
};

// Token'ı sil
export const removeTokenCookie = () => {
  Cookies.remove('token', { path: '/' });
};

// Token'ı çöz ve kullanıcı bilgilerini al
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error('Token çözümleme hatası:', error);
    return null;
  }
};

// Kullanıcının giriş yapmış olup olmadığını kontrol et
export const isAuthenticated = () => {
  const token = getTokenFromCookie();
  if (!token) return false;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    // Token'ın süresi dolmuş mu kontrol et
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      removeTokenCookie();
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Token'dan kullanıcı bilgilerini al
export const getUserInfo = () => {
  const token = getTokenFromCookie();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  };
}; 