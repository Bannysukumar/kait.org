// import { NextResponse, type NextRequest } from 'next/server'
// import { decodeJWT } from './lib/auth'

// interface DecodedToken {
//   exp: number
//   role: 'admin' | 'customer' | 'supervisor' | string
// }

// const roleAccess: Record<string, Set<string>> = {
//   admin: new Set(['/admin']),
//   customer: new Set(['/user']),
//   supervisor: new Set(['/supervisor']), 
// }

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token')?.value
//   if (!token)
//     return redirectWithCookieClear(req, '/auth/signin', 'Missing token')

//   const decodedToken = decodeJWT(token)
//   if (
//     !decodedToken ||
//     typeof decodedToken.exp !== 'number' ||
//     typeof decodedToken.role !== 'string'
//   ) {
//     return redirectWithCookieClear(req, '/auth/signin', 'Invalid token')
//   }

//   if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
//     return redirectWithCookieClear(req, '/auth/signin', 'Token expired')
//   }

//   const allowedPaths = roleAccess[decodedToken.role]
//   if (
//     !allowedPaths ||
//     ![...allowedPaths].some((path) => req.nextUrl.pathname.startsWith(path))
//   ) {
//     return NextResponse.redirect(new URL('/access-denied', req.url))
//   }

//   return NextResponse.next()
// }

// function redirectWithCookieClear(
//   req: NextRequest,
//   path: string,
//   reason: string,
// ) {
//   if (process.env.NODE_ENV !== 'production')
//     console.log(`Middleware Redirect: ${reason}`)

//   return NextResponse.redirect(new URL(path, req.url), {
//     headers: { 'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0' },
//   })
// }

// export const config = {
//   matcher: ['/admin/:path*', '/user/:path*', '/supervisor/:path*'], 
// }

import { NextResponse, type NextRequest } from 'next/server'

interface DecodedToken {
  exp: number
  role: 'admin' | 'customer' | 'supervisor' | string;
}

function decodeJWT(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString()
    );

    return decoded
  } catch (err) {
    console.log("❌ JWT Decode Error:", err)
    return null
  }
}

const roleAccess: Record<string, string[]> = {
  admin: ['/admin'],
  customer: ['/user'],
  supervisor: ['/supervisor'],
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl.clone()
  const pathname = req.nextUrl.pathname

  console.log("---- 🔍 Middleware Start ----")
  console.log("➡️ Request Path:", pathname)
  console.log("➡️ Token:", token)

  // No token → redirect
  if (!token) {
    console.log("❌ No token found")
    return redirectWithCookieClear(url, '/auth/signin', 'Missing token')
  }

  const decodedToken = decodeJWT(token)
  console.log("➡️ Decoded Token:", decodedToken)

  // Invalid token → redirect
  if (
    !decodedToken ||
    typeof decodedToken.exp !== 'number' ||
    typeof decodedToken.role !== 'string'
  ) {
    console.log("❌ Invalid token structure")
    return redirectWithCookieClear(url, '/auth/signin', 'Invalid token')
  }

  // Expiration check
  const now = Math.floor(Date.now() / 1000)
  console.log("➡️ Now:", now)
  console.log("➡️ Token Exp:", decodedToken.exp)

  if (decodedToken.exp < now) {
    console.log("❌ Token expired")
    return redirectWithCookieClear(url, '/auth/signin', 'Token expired')
  }

  // Role-based access check
  const role = decodedToken.role
  const allowedPaths = roleAccess[role]

  console.log("➡️ Role:", role)
  console.log("➡️ Allowed Paths:", allowedPaths)

  if (!allowedPaths) {
    console.log("❌ No allowed paths for this role")
    return NextResponse.redirect(new URL('/access-denied', req.url))
  }

  const isAllowed = allowedPaths.some((p) =>
    pathname.startsWith(p)
  )

  console.log("➡️ Is Allowed:", isAllowed)

  if (!isAllowed) {
    console.log("❌ Path not allowed for this role")
    return NextResponse.redirect(new URL('/access-denied', req.url))
  }

  console.log("✅ Access granted")
  console.log("---- ✔ End Middleware ----")
  return NextResponse.next()
}


function redirectWithCookieClear(url: URL, path: string, reason: string) {
  console.log(`🔒 Redirecting: ${reason}`)

  const response = NextResponse.redirect(new URL(path, url))
  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    maxAge: 0,
  })
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/supervisor/:path*'],
}
