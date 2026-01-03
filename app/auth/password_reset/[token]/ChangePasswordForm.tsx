'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { changePassword } from '@/store/slices/user/changePasswordSlice'
import toast from 'react-hot-toast'
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  Key,
  Loader2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ChangePasswordForm({ token }: { token: string }) {
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector(
    (state) => state.changePassword,
  )

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    const errors: string[] = []

    if (password.length >= 8) strength += 1
    else errors.push('At least 8 characters')

    if (/[A-Z]/.test(password)) strength += 1
    else errors.push('One uppercase letter')

    if (/[a-z]/.test(password)) strength += 1
    else errors.push('One lowercase letter')

    if (/\d/.test(password)) strength += 1
    else errors.push('One number')

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
    else errors.push('One special character')

    setPasswordStrength(strength)
    setValidationErrors(errors)
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)
    calculatePasswordStrength(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordStrength < 3) {
      toast.error('Password is too weak. Please follow the requirements.')
      return
    }

    dispatch(
      changePassword({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    )
  }

  useEffect(() => {
    if (success) {
      toast.success('Password updated successfully!')
    }
    if (error) {
      toast.error(error)
    }
  }, [success, error])

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'from-red-500 to-red-600'
    if (passwordStrength <= 3) return 'from-orange-500 to-yellow-500'
    return 'from-green-500 to-emerald-600'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  if (success) {
    return (
      <div className="min-h-screen  bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Password Updated Successfully!
              </h2>
              <p className="text-gray-600">
                Your password has been changed successfully. You can now use
                your new password to log in.
              </p>
            </div>

            <div className="pt-4">
              <Button
                className="w-full  bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-700 hover:to-gray-800 text-white shadow-lg"
                onClick={() => (window.location.href = '/auth/signin')}
              >
                Continue to Login
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-pink-100">
              Create a strong, secure password for your account
            </p>
          </div>
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-gray-700 font-medium"
              >
                New Password
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="pl-10 pr-12 h-12 border-2 focus:border-pink-500 transition-colors"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Password Strength
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength <= 2
                          ? 'text-red-600'
                          : passwordStrength <= 3
                            ? 'text-orange-600'
                            : 'text-green-600'
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>

                  {validationErrors.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Password must include:
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {validationErrors.map((error, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                            <span className="text-xs text-gray-600">
                              {error}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Key className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 border-2 focus:border-pink-500 transition-colors"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {confirmPassword && (
                <div className="flex items-center space-x-2">
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">
                        Passwords don't match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                loading ||
                newPassword !== confirmPassword ||
                passwordStrength < 3
              }
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-gray-700 hover:from-pink-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-white mt-0.5" />
            <div>
              <h3 className="text-white font-medium mb-1">Security Tips</h3>
              <ul className="text-pink-100 text-sm space-y-1">
                <li>• Use a unique password you haven't used elsewhere</li>
                <li>• Consider using a password manager</li>
                <li>• Don't share your password with anyone</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
