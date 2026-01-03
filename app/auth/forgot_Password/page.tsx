'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { forgotPassword } from '@/store/slices/forgetPasswordSlice'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { TextField } from '@mui/material'
import { Button } from '@/components/ui/button'

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch()
  const { loading, success, error } = useAppSelector(
    (state) => state.forgotPassword,
  )

  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(forgotPassword(email))
  }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gradient-to-r from-blue-500 to-purple-700 text-white p-6">
      <div className="w-full max-w-md bg-black/40 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-200 mb-6 text-center">
          Enter your email and we’ll send you a password reset link.
        </p>

        {error && (
          <Alert className="mb-4 bg-red-100 text-red-700 border-red-300">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-100 text-green-700 border-green-300">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription>
              Password reset link sent successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            slotProps={{
              input: {
                style: { color: 'white' },
              },
              inputLabel: {
                style: { color: 'white' },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: '#ec4899' },
                '&.Mui-focused fieldset': { borderColor: '#ec4899' },
              },
            }}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full  bg-gradient-to-r from-blue-500 to-purple-700 mt-5">

            {loading ? <Spinner /> : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
