// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { useAppDispatch, useAppSelector } from '../../../store/hooks'
// import { loginUser, checkAuth, setUser, resendConfirmationEmail } from '../../../store/slices/index'
// import { useRouter, usePathname } from 'next/navigation'
// import Cookies from 'js-cookie'
// import { decodeJWT } from '../../../lib/auth'
// import Backimg from '../../../assets/800_500.png'
// import { Spinner } from '@/components/ui/spinner'
// import { TextField, IconButton, InputAdornment } from '@mui/material'
// import { Visibility, VisibilityOff } from '@mui/icons-material'
// import toast from 'react-hot-toast'
// import { GiCancel } from 'react-icons/gi'

// const LoginPage: React.FC = () => {
//   const dispatch = useAppDispatch()
//   const router = useRouter()
//   const pathname = usePathname()

//   const [showPassword, setShowPassword] = useState(false)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [rememberMe, setRememberMe] = useState(false)
//   const [isClient, setIsClient] = useState(false)
//   const [pageLoading, setPageLoading] = useState(true)

//   const [showResend, setShowResend] = useState(false)
//   const [timer, setTimer] = useState(0)
//   const [resendLoading, setResendLoading] = useState(false)
//   const [showVerificationDialog, setShowVerificationDialog] = useState(false);


//   const { isAuthenticated, isLoading, user } = useAppSelector(
//     (state) => state.auth
//   )

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   useEffect(() => {
//     if (!isClient) return

//     const token = Cookies.get('token') || localStorage.getItem('token')
//     if (!token) {
//       setPageLoading(false)
//       return
//     }

//     const decoded = decodeJWT(token)
//     if (!decoded) {
//       Cookies.remove('token')
//       localStorage.removeItem('token')
//       setPageLoading(false)
//       return
//     }

//     const now = Math.floor(Date.now() / 1000)
//     if (decoded.exp < now) {
//       Cookies.remove('token')
//       localStorage.removeItem('token')
//       setPageLoading(false)
//       return
//     }

//     // Valid token: verify server side
//     dispatch(checkAuth())
//       .unwrap()
//       .then((res: any) => {
//         if (res.user) {
//           dispatch(setUser(res.user))
//           redirectByRole(res.user.role)
//         }
//       })
//       .catch(() => {
//         Cookies.remove('token')
//         localStorage.removeItem('token')
//       })
//       .finally(() => {
//         setPageLoading(false)
//       })
//   }, [dispatch, isClient])

//   useEffect(() => {
//     const savedEmail = localStorage.getItem('rememberEmail');
//     const savedPassword = localStorage.getItem('rememberPassword');

//     if (savedEmail && savedPassword) {
//       setEmail(savedEmail);
//       setPassword(savedPassword);
//       setRememberMe(true);
//     }
//   }, []);


//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [timer]);

//   // If auth state changes, redirect
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       redirectByRole(user.role)
//     }
//   }, [isAuthenticated, user])

//   const redirectByRole = (role: string) => {
//     if (role === 'admin' && pathname !== '/admin/dashboard') {
//       router.push('/admin/dashboard')
//     } else if (role === 'supervisor' && pathname !== '/supervisor/dashboard') {
//       router.push('/supervisor/dashboard')
//     } else if (role !== 'admin' && pathname !== '/user/dashboard') {
//       router.push('/user/dashboard')
//     }
//   }


//   const [loginPending, setLoginPending] = useState(false); // NEW

// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoginPending(true);
//   try {
//     const res = await dispatch(loginUser({ email, password })).unwrap();

//     if (res.access_token) {
//       if (rememberMe) {
//         Cookies.set('token', res.access_token, { expires: 365 });
//         localStorage.setItem('rememberEmail', email);
//         localStorage.setItem('rememberPassword', password);
//       } else {
//         localStorage.removeItem('rememberEmail');
//         localStorage.removeItem('rememberPassword');
//         localStorage.setItem('token', res.access_token);
//       }

//       const decoded = decodeJWT(res.access_token);
//       if (decoded) {
//         dispatch(setUser(decoded));
//         // 👇 Store success flag before redirect
//         sessionStorage.setItem('loginSuccess', 'true');
//         redirectByRole(decoded.role);
//       } else {
//         toast.error('Failed to decode token.');
//       }
//     } else {
//       toast.error('No access token returned.');
//     }
//   } catch (err: any) {
//     const message =
//       err?.detail || err?.message || (typeof err === 'string' ? err : 'Login failed.');
//     if (message.includes('Email Not Verified')) {
//       setShowVerificationDialog(true);
//       setTimer(30);
//       toast.error(`${message} You can resend the verification email.`);
//     } else {
//       toast.error(message);
//     }
//   } finally {
//     setLoginPending(false);
//   }
// };



//   const handleResendEmail = async () => {
//     setResendLoading(true)

//     try {
//       await dispatch(resendConfirmationEmail({ email })).unwrap()
//       toast.success('Verification email resent.')
//       setTimer(30)
//     } catch (error: any) {
//       toast.error(
//         error?.detail || error?.message || 'Failed to resend. Try again.'
//       )
//     } finally {
//       setResendLoading(false)
//     }
//   }

//   if (pageLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Spinner />
//       </div>
//     )
//   }

//   return (
//     <div
//       className="flex justify-center items-center min-h-screen w-full bg-cover bg-center px-4 lg:px-[100px] lg:py-[50px]"
//       style={{ backgroundImage: `url(${Backimg.src})` }}
//     >
//       {/* Card */}
//       <div className="flex flex-col justify-center bg-black/40 items-center p-12 mt-[300px] w-full max-w-md rounded-2xl">
//         <h1 className="text-3xl font-semibold pb-2 text-white">Sign In</h1>

//         {/* Form */}
//         <form className="w-full" onSubmit={handleLogin}>
//           {/* Email */}
//           <TextField
//             name="Email"
//             label="Email"
//             variant="outlined"
//             type="email"
//             id="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             fullWidth
//             slotProps={{
//               input: {
//                 style: {
//                   color: 'white',
//                   backgroundColor: 'transparent',
//                 },
//               },
//               inputLabel: {
//                 style: { color: 'white' },
//               },
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 backgroundColor: 'transparent',

//                 '& input': {
//                   backgroundColor: 'transparent',
//                   color: 'white',
//                   caretColor: 'white',
//                 },

//                 '& input:-webkit-autofill': {
//                   WebkitBoxShadow: '0 0 0 1000px transparent inset',
//                   WebkitTextFillColor: 'white',
//                   transition: 'background-color 5000s ease-in-out 0s',
//                   caretColor: 'white',
//                 },

//                 '& fieldset': {
//                   borderColor: 'gray',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: '#ec4899',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#ec4899',
//                 },
//               },
//             }}
//           />

//           {/* Password */}
//           <TextField
//             variant="outlined"
//             type={showPassword ? 'text' : 'password'}
//             label="Password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             fullWidth
//             style={{ marginTop: '20px' }}
//             placeholder="Enter your password"
//             slotProps={{
//               input: {
//                 style: {
//                   color: 'white',
//                   backgroundColor: 'transparent',
//                 },
//                 endAdornment: (
//                   <IconButton
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     edge="end"
//                     sx={{ color: 'white' }}
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 ),
//               },
//               inputLabel: {
//                 style: { color: 'white' },
//               },
//             }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 backgroundColor: 'transparent',
//                 '& input': {
//                   backgroundColor: 'transparent',
//                   color: 'white',
//                   caretColor: 'white',
//                 },
//                 '& input:-webkit-autofill': {
//                   WebkitBoxShadow: '0 0 0 1000px transparent inset',
//                   WebkitTextFillColor: 'white',
//                   transition: 'background-color 5000s ease-in-out 0s',
//                   caretColor: 'white',
//                 },
//                 '& fieldset': {
//                   borderColor: 'gray',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: '#ec4899',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#ec4899',
//                 },
//               },
//             }}
//           />

//           {/* Remember Me + Forgot Password */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
//             <label
//               htmlFor="rememberMe"
//               className="flex items-center text-white cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 id="rememberMe"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="mr-2 accent-purple-500"
//               />

//               Remember Me
//             </label>
//             <a
//               href="/auth/forgot_Password"
//               className="text-sm text-pink-200 hover:text-white hover:underline"
//             >
//               Forgot Password?
//             </a>
//           </div>

//           {/* {showResend && (
//             <div className="mt-4 w-full max-w-sm mx-auto">
//               {timer > 0 && (
//                 <p className="text-yellow-400 text-center text-sm mb-2">
//                   Resend available in {timer} seconds.
//                 </p>
//               )}
//               <button
//                 type="button"
//                 className="w-full bg-red-600 text-white py-2 rounded-md"
//                 onClick={handleResendEmail}
//                 disabled={timer > 0 || resendLoading}
//               >
//                 {resendLoading ? <Spinner /> : "Resend Confirmation Email"}
//               </button>
//             </div>
//           )} */}
//           {/* Verification Required Dialog */}
//           {showVerificationDialog && (
//             <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//               <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center shadow-lg">
//                 <h2 className="text-lg font-bold text-red-600 mb-2">
//                   Email Not Verified
//                   <GiCancel className=' flex justify-center  m-auto text-3xl' />

//                 </h2>
//                 <p className="text-gray-700 mb-4 text-sm">
//                   Please verify your email using the link sent to <strong>{email}</strong>.
//                 </p>

//                 {timer > 0 ? (
//                   <p className="text-sm text-yellow-600 mb-4">
//                     You can resend the email in {timer} seconds.
//                   </p>
//                 ) : (
//                   <button
//                     onClick={handleResendEmail}
//                     disabled={resendLoading}
//                     className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition"
//                   >
//                     {resendLoading ? <Spinner /> : 'Resend Verification Email'}
//                   </button>
//                 )}

//                 <button
//                   onClick={() => setShowVerificationDialog(false)}
//                   className="mt-4 text-sm text-blue-600 hover:underline"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}



//           {/* Submit */}
//           <button
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-700 text-white border-white shadow-2xl border-2 font-semibold py-2 rounded-md mt-4 transition-transform transform hover:scale-105 flex justify-center"
//             type="submit"
//             disabled={loginPending}
//           >
//             {loginPending ? <Spinner /> : 'Sign In'}
//           </button>
          
//         </form>

//         {/* Footer */}
//         <div className="flex gap-2 items-center mt-4">
//           <p className="text-white text-sm">Don’t have an account?</p>
//           <a
//             href="/auth/signup"
//             className="text-red-200 text-sm font-semibold hover:underline"
//           >
//             Sign up here
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage

'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { loginUser, checkAuth, setUser, resendConfirmationEmail } from '../../../store/slices'
import { useRouter, usePathname } from 'next/navigation'
import { decodeJWT, isTokenExpired, removeToken } from '../../../lib/auth'
import Cookies from 'js-cookie'
import Backimg from '../../../assets/800_500.png'
import { Spinner } from '@/components/ui/spinner'
import { TextField, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { GiCancel } from 'react-icons/gi'

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [loginPending, setLoginPending] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [timer, setTimer] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)

  // --- Check existing token on mount ---
  useEffect(() => {
    const token = Cookies.get('token')
    if (!token || isTokenExpired(token)) {
      removeToken()
      setPageLoading(false)
      return
    }

    // Validate token server-side
    dispatch(checkAuth())
      .unwrap()
      .then((res: any) => {
        if (res?.user) {
          dispatch(setUser(res.user))
          redirectByRole(res.user.role)
        }
      })
      .catch(() => removeToken())
      .finally(() => setPageLoading(false))
  }, [dispatch])

  // --- Restore remembered credentials ---
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail')
    const savedPassword = localStorage.getItem('rememberPassword')
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  // --- Timer countdown for resend email ---
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // --- Redirect when already authenticated ---
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role)
    }
  }, [isAuthenticated, user])

  const redirectByRole = (role: string) => {
    const routeMap: Record<string, string> = {
      admin: '/admin/dashboard',
      supervisor: '/supervisor/dashboard',
      customer: '/user/dashboard',
    }
    const target = routeMap[role] || '/user/dashboard'
    if (pathname !== target) router.push(target)
  }

  // --- Handle login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginPending(true)
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap()

      if (!res?.access_token) {
        toast.error('No access token returned.')
        return
      }

      // ✅ Set secure cookie
      Cookies.set('token', res.access_token, {
        expires: rememberMe ? 7 : undefined,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
      })

      if (rememberMe) {
        localStorage.setItem('rememberEmail', email)
        localStorage.setItem('rememberPassword', password)
      } else {
        localStorage.removeItem('rememberEmail')
        localStorage.removeItem('rememberPassword')
      }

      const decoded = decodeJWT(res.access_token)
      if (decoded?.role) {
        dispatch(setUser(decoded))
        sessionStorage.setItem('loginSuccess', 'true')
        redirectByRole(decoded.role)
      } else {
        toast.error('Failed to decode token.')
      }
    } catch (err: any) {
      const message =
        err?.detail || err?.message || (typeof err === 'string' ? err : 'Login failed.')
      if (message.includes('Email Not Verified')) {
        setShowVerificationDialog(true)
        setTimer(30)
        toast.error(`${message} You can resend the verification email.`)
      } else {
        toast.error(message)
      }
    } finally {
      setLoginPending(false)
    }
  }

  // --- Resend verification email ---
  const handleResendEmail = async () => {
    setResendLoading(true)
    try {
      await dispatch(resendConfirmationEmail({ email })).unwrap()
      toast.success('Verification email resent.')
      setTimer(30)
    } catch (error: any) {
      toast.error(error?.detail || error?.message || 'Failed to resend. Try again.')
    } finally {
      setResendLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-cover bg-center px-4 lg:px-[100px] lg:py-[50px]"
      style={{ backgroundImage: `url(${Backimg.src})` }}
    >
      <div className="flex flex-col justify-center bg-black/40 items-center p-12 mt-[300px] w-full max-w-md rounded-2xl">
        <h1 className="text-3xl font-semibold pb-2 text-white">Sign In</h1>

        <form className="w-full" onSubmit={handleLogin}>
          {/* Email */}
          <TextField
            name="Email"
            label="Email"
            variant="outlined"
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                style: {
                  color: 'white',
                  backgroundColor: 'transparent',
                },
              },
              inputLabel: {
                style: { color: 'white' },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',

                '& input': {
                  backgroundColor: 'transparent',
                  color: 'white',
                  caretColor: 'white',
                },

                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px transparent inset',
                  WebkitTextFillColor: 'white',
                  transition: 'background-color 5000s ease-in-out 0s',
                  caretColor: 'white',
                },

                '& fieldset': {
                  borderColor: 'gray',
                },
                '&:hover fieldset': {
                  borderColor: '#ec4899',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ec4899',
                },
              },
            }}
          />

        {/* Password */}
          <TextField
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            style={{ marginTop: '20px' }}
            placeholder="Enter your password"
            slotProps={{
              input: {
                style: {
                  color: 'white',
                  backgroundColor: 'transparent',
                },
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: 'white' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              },
              inputLabel: {
                style: { color: 'white' },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'transparent',
                '& input': {
                  backgroundColor: 'transparent',
                  color: 'white',
                  caretColor: 'white',
                },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px transparent inset',
                  WebkitTextFillColor: 'white',
                  transition: 'background-color 5000s ease-in-out 0s',
                  caretColor: 'white',
                },
                '& fieldset': {
                  borderColor: 'gray',
                },
                '&:hover fieldset': {
                  borderColor: '#ec4899',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ec4899',
                },
              },
            }}
          />

          {/* Remember + Forgot */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 mt-2">
            <label className="flex items-center text-white cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 accent-purple-500"
              />
              Remember Me
            </label>
            <a
              href="/auth/forgot_Password"
              className="text-sm text-pink-200 hover:text-white hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Verification dialog */}
          {showVerificationDialog && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center shadow-lg">
                <h2 className="text-lg font-bold text-red-600 mb-2 flex flex-col items-center">
                  Email Not Verified
                  <GiCancel className="text-3xl mt-2" />
                </h2>
                <p className="text-gray-700 mb-4 text-sm">
                  Please verify your email using the link sent to <strong>{email}</strong>.
                </p>

                {timer > 0 ? (
                  <p className="text-sm text-yellow-600 mb-4">
                    You can resend the email in {timer} seconds.
                  </p>
                ) : (
                  <button
                    onClick={handleResendEmail}
                    disabled={resendLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition"
                  >
                    {resendLoading ? <Spinner /> : 'Resend Verification Email'}
                  </button>
                )}

                <button
                  onClick={() => setShowVerificationDialog(false)}
                  className="mt-4 text-sm text-blue-600 hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-700 text-white border-white shadow-2xl border-2 font-semibold py-2 rounded-md mt-4 transition-transform transform hover:scale-105 flex justify-center"
            type="submit"
            disabled={loginPending}
          >
            {loginPending ? <Spinner /> : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="flex gap-2 items-center mt-4">
          <p className="text-white text-sm">Don’t have an account?</p>
          <a
            href="/auth/signup"
            className="text-red-200 text-sm font-semibold hover:underline"
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
