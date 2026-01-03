'use client'

import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  resetUserPassword,
  clearStatus,
} from '@/store/slices/admin/passwordReset'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector(
    (state) => state.resetpassword,
  )
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleResetPassword = () => {
    dispatch(resetUserPassword({ userId, newPassword: '' }))
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  useEffect(() => {
    if (success) {
      toast.success('Email for reset password has been sent successfully!')
    }
    if (error) {
      toast.error(error)
    }

    return () => {
      dispatch(clearStatus())
    }
  }, [success, error, dispatch])

  return (
    <>
      <div className="p-6 max-w-lg mx-auto  bg-gradient-to-r from-blue-500 to-purple-700 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Reset Password
        </h2>
        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full  bg-gradient-to-r from-blue-500 to-purple-700 shadow-2xl border-2 hover:cursor-pointer text-white py-3 rounded-md font-semibold transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-700">
              Confirm Reset
            </h3>
            <p className="my-4 text-gray-600">
              Are you sure you want to reset this user's password? This action
              will send a password reset email.
            </p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={handleResetPassword}
                className="bg-red-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-red-700 transition duration-200"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black py-2 px-6 rounded-md font-semibold hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
