'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  setTransactionPassword,
  resetTransactionState,
} from '@/store/slices/user/transactionPassSlice'
import {
  sendTransactionOTP,
  resetTransactionOtpState,
} from '@/store/slices/user/transationOtpSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { TextField, InputAdornment, IconButton } from '@mui/material'

const TransactionPass = () => {
  const dispatch = useAppDispatch()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    loading: passwordLoading,
    success: passwordSuccess,
    error: passwordError,
  } = useAppSelector((state) => state.transactionPin)

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.transactionOtp)

  const { status: transferPinStatus, loading: isLoading } = useAppSelector(
    (state) => state.transferPinStatus,
  )

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  useEffect(() => {
    if (token) {
      dispatch(fetchTransferPinStatus(token))
    }
  }, [dispatch, token])

  const handleInitialSubmit = () => {
    if (!password || !confirmPassword) {
      toast.error('Both password fields are required.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    dispatch(sendTransactionOTP())
    dialogRef.current?.showModal()
  }

  const handleFinalSubmit = async () => {
    if (!otp) {
      toast.error('Enter OTP before submitting.')
      return
    }

    try {
      await dispatch(
        setTransactionPassword({
          otp,
          transaction_password: password,
          confirm_transaction_password: confirmPassword,
        }),
      ).unwrap()

      toast.success('Transaction password set successfully.')
      dialogRef.current?.close()
      setOtp('')
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err)
    } finally {
      dispatch(resetTransactionState())
    }
  }

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully to your email.')
      dispatch(resetTransactionOtpState())
    }

    if (otpError) {
      toast.error(otpError || 'Failed to send OTP. Please try again.')
      dispatch(resetTransactionOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  const WarningMessage = () => (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
      ⚠️ You have not set a transaction pin. Please set it below.
    </div>
  )
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-pink-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Set Transaction Password</h2>

      {transferPinStatus === false && <WarningMessage />}

      <div>
        <TextField
          label="New Transaction Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <div>
        <TextField
          id="confirm-transaction-password"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <button
        onClick={handleInitialSubmit}
        disabled={passwordLoading}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
      >
        {passwordLoading ? 'Submitting...' : 'Submit'}
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-md p-6 m-auto shadow-lg w-full max-w-md"
      >
        <form method="dialog" className="space-y-4">
          <h3 className="text-lg font-semibold">
            E-Mail Verification for Transaction Password
          </h3>
          <p>Enter the OTP sent to your email:</p>
          <TextField
            id="transaction-otp"
            label="Enter OTP"
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-gray-400 text-white px-4 py-2 rounded w-1/2"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={otpLoading}
              className="bg-green-600 text-white px-4 py-2 rounded w-1/2"
            >
              {otpLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default TransactionPass
