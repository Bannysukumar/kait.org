import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { resetUserPassword } from '../../../store/slices/profileAPI'
import { resetPasswordState } from '../../../store/slices/profileSlice'
import { RootState } from '../../../store/store'
import { Button } from '@/components/ui/button'
import { TextField, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import toast from 'react-hot-toast'

const ResetPasswordForm = () => {
  const dispatch = useAppDispatch()
  const { isLoading, success, error } = useAppSelector(
    (state: RootState) => state.profile.password,
  )

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (success) {
      toast.success('Password reset successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      dispatch(resetPasswordState())
    }
    if (error) {
      toast.error(error)
      dispatch(resetPasswordState())
    }
  }, [success, error, dispatch])

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.')
      return
    }

    if (oldPassword === newPassword) {
      toast.error('New password cannot be the same as the old password.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    dispatch(
      resetUserPassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    )
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <TextField
          label="Current Password"
          type={showOld ? 'text' : 'password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOld((prev) => !prev)}>
                    {showOld ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <div>
        <TextField
          label="New Password"
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
       slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew((prev) => !prev)}>
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <div>
        <TextField
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
           slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((prev) => !prev)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 text-white w-full"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </div>
  )
}

export default ResetPasswordForm
