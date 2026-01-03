import ReduxProvider from '../store/Provider'
import './globals.css'
import { ToastProvider } from '../components/ui/ToastProvider'

export const metadata = {
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
