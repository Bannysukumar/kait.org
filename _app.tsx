import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './app/ProtectedRoute'

// Define which routes are *not* protected
const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/forgot_Password']

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const isPublic = publicRoutes.includes(router.pathname)

  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: { background: '#333', color: '#fff' },
          success: { iconTheme: { primary: 'green', secondary: 'white' } },
          error: { iconTheme: { primary: 'red', secondary: 'white' } },
        }}
      />
      {isPublic ? (
        <Component {...pageProps} />
      ) : (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      )}
    </Provider>
  )
}
