// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { decodeJWT } from '@/lib/auth'
// import { Spinner } from '@/components/ui/spinner'

// export default function Home() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {

//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token')

//       if (!token) {
//         console.log('No token found, redirecting to signin.')
//         router.replace('/auth/signin')
//         return
//       }

//       try {
//         const decodedToken = decodeJWT(token)
//         if (decodedToken) {
//           console.log('Decoded Token:', decodedToken)

//           const { role } = decodedToken

//           if (role) {
//             setLoading(false)

//             switch (role) {
//               case 'admin':
//                 router.replace('/admin/dashboard')
//                 break
//               case 'customer':
//                 router.replace('/user/dashboard')
//                 break
//               default:
//                 console.warn('Unknown role, redirecting to signin.')
//                 router.replace('/auth/signin')
//             }
//           } else {
//             console.warn('Invalid token, redirecting to signin.')
//             router.replace('/auth/signin')
//           }
//         } else {
//           console.error('Token decoding failed, redirecting to signin.')
//           router.replace('/auth/signin')
//         }
//       } catch (error) {
//         console.error('Error decoding token:', error)
//         setError('An error occurred during token validation.')
//         router.replace('/auth/signin')
//       }
//     }
//   }, [router])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Spinner />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-red-500">{error}</p>
//       </div>
//     )
//   }

//   return null
// }


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { decodeJWT, isTokenExpired } from '@/lib/auth'
import { Spinner } from '@/components/ui/spinner'
import Image from 'next/image'
import Rotating from '../assets/rotating_coin_transparent.gif'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') || sessionStorage.getItem('token')
        : null

    if (!token) {
      // No token → show landing page
      setLoading(false)
      return
    }

    try {
      const decodedToken = decodeJWT(token)

      if (!decodedToken || !decodedToken.role) {
        setError('Invalid or missing token data.')
        setLoading(false)
        return
      }

      // ✅ Check expiration to avoid redirect loops
      if (isTokenExpired(token)) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        setError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      const { role } = decodedToken

      // ✅ Route user based on role
      switch (role) {
        case 'admin':
          router.replace('/admin/dashboard')
          break
        case 'supervisor':
          router.replace('/supervisor/dashboard')
          break
        case 'customer':
        case 'user':
          router.replace('/user/dashboard')
          break
        default:
          router.replace('/auth/signin')
      }
    } catch (err) {
      console.error('Token decode error:', err)
      setError('Invalid token, please sign in again.')
      setLoading(false)
    }
  }, [router])

  const handleRedirect = () => {
    router.push('/auth/signin')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-purple-900">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-purple-900 overflow-hidden">
      {/* Glass card */}
      <div className="z-10 bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-xl text-center max-w-2xl w-full border border-white/20 animate-fade-in-down">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Welcome to <span className="text-yellow-400">Kait Staking</span>
        </h1>

        {error && (
          <div className="mb-4 text-red-300 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <Image
            alt="Rotating Coin"
            src={Rotating}
            width={200}
            height={200}
            className="drop-shadow-xl"
            priority
          />
        </div>

        <p className="text-purple-100 text-base leading-relaxed mb-8">
          Stake your crypto with confidence. Earn rewards, secure the network,
          and be part of a new financial future. Please sign in to access your dashboard.
        </p>

        <button
          onClick={handleRedirect}
          className="px-8 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-full shadow-lg hover:shadow-yellow-500/50 hover:bg-yellow-300 transition duration-300"
        >
          Sign In to Continue
        </button>
      </div>

      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full opacity-10 blur-2xl animate-pulse" />
    </div>
  )
}
