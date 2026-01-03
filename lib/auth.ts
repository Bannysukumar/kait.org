import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

interface DecodedJWT {
  exp: number
  sub?: string 
  role?: string
  [key: string]: any 
}

export const getToken = (): string | null => {
  try {
    const token = Cookies.get('token')
    return token || null
  } catch {
    return null
  }
}


export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    return jwtDecode<DecodedJWT>(token)
  } catch (error) {
    console.warn('⚠️ Invalid JWT token:', error)
    return null
  }
}

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true

  const now = Math.floor(Date.now() / 1000)
  const skewAllowance = 10 // seconds tolerance
  return decoded.exp + skewAllowance < now
}

export const checkTokenValidity = (): string | null => {
  const token = getToken()
  if (!token) return null

  return isTokenExpired(token) ? null : token
}

export const setToken = (token: string, remember = false): void => {
  Cookies.set('token', token, {
    expires: remember ? 7 : undefined, 
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export const removeToken = (): void => {
  try {
    Cookies.remove('token', { path: '/' })
    localStorage.removeItem('token')
  } catch (error) {
    console.warn('⚠️ Failed to remove token:', error)
  }
}
