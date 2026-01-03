// ChangePassword.tsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { changePassword } from '@/store/slices/user/changePasswordSlice'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle, Info } from 'lucide-react'

const ChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, success } = useSelector(
    (state: RootState) => state.changePassword,
  )

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)

  // Use effect to handle localStorage only on the client side
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token')
    if (tokenFromStorage) {
      setToken(tokenFromStorage) // Store token in local state after component mounts
    }
  }, [])

  const handleChangePassword = () => {
    if (!token) {
      console.error('Token is not available')
      return
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password don't match")
      return
    }

    if (newPassword.length < 6) {
      alert('New password should be at least 6 characters long')
      return
    }

    const payload = {
      token,
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }

    dispatch(changePassword(payload))
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="old-password">Old Password</Label>
        <Input
          id="old-password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter your current password"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-2 text-sm text-blue-600">
          <Info className="h-4 w-4 mt-0.5" />
          <p>Password should be a minimum of 6 characters long.</p>
        </div>

        <div className="flex items-start gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <p>Your password will update after confirmation from your email.</p>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          <AlertCircle className="inline mr-1" />
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm mt-2">
          Password changed successfully!
        </div>
      )}

      <Button
        onClick={handleChangePassword}
        disabled={loading || !oldPassword || !newPassword || !confirmPassword}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-32"
      >
        {loading ? 'Updating...' : 'Update'}
      </Button>
    </div>
  )
}

export default ChangePassword
