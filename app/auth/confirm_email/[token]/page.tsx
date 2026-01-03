'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ConfirmAccount() {
  const { token } = useParams() // Get token from the URL
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const router = useRouter()

  useEffect(() => {
    if (!token) return // Ensure token exists

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${baseURL}user/verify_email/${token}`,
          {
            method: 'GET', 
            headers: { 'Content-Type': 'application/json' },
          },
        )

        if (response.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('Verification failed:', error)
        setStatus('error')
      }  

    } 
    

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-pulse rounded-full w-16 h-16 bg-primary/20 mx-auto" />
            <h1 className="text-2xl font-semibold">
              Verifying your account...
            </h1>
            <p>Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-semibold text-green-500">
              Account Confirmed!
            </h1>
            <p>Your email has been successfully verified.</p>
            <Button asChild className="w-full">
              <Link href="/auth/signin" className=' border-1'>Continue to Login</Link>
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-semibold text-destructive">
              Verification Failed
            </h1>
            <p>The confirmation link may be expired or invalid.</p>
            <Button variant="secondary" className="w-full">
              Resend Confirmation Email
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
