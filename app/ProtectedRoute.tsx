// 'use client'

// import { ReactNode, useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import { useAppSelector } from '../store/hooks'
// import Cookies from 'js-cookie'
// import { decodeJWT } from '../lib/auth'

// interface ProtectedRouteProps {
//   children: ReactNode
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const router = useRouter()
//   const { isAuthenticated } = useAppSelector((state) => state.auth)
//   const [isClient, setIsClient] = useState(false)
//   const [isAuthorized, setIsAuthorized] = useState(false)

//   useEffect(() => {
//     setIsClient(true)

//     const token = Cookies.get('token') || localStorage.getItem('token')

//     if (!token) {
//       router.replace('/auth/signin')
//       return
//     }

//     try {
//       const decodedToken = decodeJWT(token)

//       if (!decodedToken || typeof decodedToken.role !== 'string') {
//         router.replace('/auth/signin')
//         return
//       }

//       const role = decodedToken.role
//       const path = router.pathname

//       const roleAccess: Record<string, string[]> = {
//         admin: ['/admin'],
//         supervisor: ['/supervisor'],
//         customer: ['/user'],
//       }

//       const allowedPaths = roleAccess[role] || ['/user']

//       const isPathAllowed = allowedPaths.some((p) => path.startsWith(p))

//       if (!isPathAllowed) {
//         router.replace(getDashboardPath(role))
//         return
//       }

//       setIsAuthorized(true)
//     } catch (error) {
//       console.error('Error decoding token:', error)
//       router.replace('/auth/signin')
//     }
//   }, [router])

//   const getDashboardPath = (role: string) => {
//     switch (role) {
//       case 'admin':
//         return '/admin/dashboard'
//       case 'supervisor':
//         return '/supervisor/dashboard'
//       default:
//         return '/user/dashboard'
//     }
//   }

//   if (!isClient || !isAuthorized) {
//     return null 
//   }

//   return <>{children}</>
// }

// export default ProtectedRoute
'use client'

import { ReactNode, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { decodeJWT, isTokenExpired, removeToken } from '../lib/auth'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: ReactNode
}

const roleAccess: Record<string, string[]> = {
  admin: ['/admin'],
  supervisor: ['/supervisor'],
  customer: ['/user'],
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  const getDashboardPath = useCallback((role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'supervisor':
        return '/supervisor/dashboard'
      default:
        return '/user/dashboard'
    }
  }, [])

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = Cookies.get('token')
        if (!token) {
          router.replace('/auth/signin')
          return
        }

        // Check expiration
        if (isTokenExpired(token)) {
          removeToken()
          router.replace('/auth/signin')
          return
        }

        const decoded = decodeJWT(token)
        if (!decoded || typeof decoded.role !== 'string') {
          removeToken()
          router.replace('/auth/signin')
          return
        }

        const role = decoded.role
        const allowedPaths = roleAccess[role] || ['/user']

        const isAllowed = allowedPaths.some((p) => pathname.startsWith(p))
        if (!isAllowed) {
          router.replace(getDashboardPath(role))
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        console.error('❌ ProtectedRoute error:', err)
        removeToken()
        router.replace('/auth/signin')
      } finally {
        setLoading(false)
      }
    }

    verifyAccess()
  }, [pathname, router, getDashboardPath])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}

export default ProtectedRoute
