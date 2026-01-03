'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserProfile,
  updateUserProfile,
} from '../../../store/slices/profileAPI'
import { RootState, AppDispatch } from '../../../store/store'
import toast from 'react-hot-toast'
import ChangePassword from './changePassword'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('MY PROFILE')
  const [formData, setFormData] = useState({
    fullName: 'KAIT Admin',
    email: '',
    mobile: '',
  })

  const dispatch = useDispatch<AppDispatch>()
  const { userprofile, isLoading, error } = useSelector(
    (state: RootState) => state.profile.profile,
  )

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (userprofile) {
      setFirstName(userprofile.first_name || '')
      setLastName(userprofile.last_name || '')
      setDob(userprofile.dob || '')
    }
  }, [userprofile])

  useEffect(() => {
    const hasChanges =
      firstName !== userprofile?.first_name ||
      lastName !== userprofile?.last_name ||
      dob !== userprofile?.dob
    setIsButtonDisabled(!hasChanges)
  }, [firstName, lastName, dob])

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  useEffect(() => {
    if (userprofile) {
      setFirstName(userprofile.first_name || '')
      setLastName(userprofile.last_name || '')
      setDob(userprofile.dob || '')
    }
  }, [userprofile])

  useEffect(() => {
    const hasChanges =
      firstName !== userprofile?.first_name ||
      lastName !== userprofile?.last_name ||
      dob !== userprofile?.dob
    setIsButtonDisabled(!hasChanges)
  }, [firstName, lastName, dob])

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dob) {
      toast.error('All fields are required.')
      return
    }

    setIsButtonDisabled(true)
    const updatedData = { first_name: firstName, last_name: lastName, dob }

    try {
      const res = await dispatch(updateUserProfile(updatedData))
      if (res.payload?.detail) {
        toast.success(res.payload.detail)
      } else {
        toast.error('Update failed.')
      }
      setTimeout(() => dispatch(fetchUserProfile()), 1000)
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setIsButtonDisabled(false)
    }
  }

  const handleEnable2FA = () => {
    console.log('Enabling 2FA')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Details Card */}
        <Card className="p-6">
          <h1 className="text-2xl font-semibold text-indigo-900 mb-6">
            Profile Details
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b mb-6 flex space-x-8 w-auto">
              {[
                'MY PROFILE',
                'SECURITY SETTINGS',
                'CHANGE PASSWORD',
                'ACTIVITY',
              ].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={`px-1 py-3 font-medium ${
                    activeTab === tab
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="MY PROFILE" className="space-y-6 pt-6">
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>Error loading profile</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Email Address
                    </label>
                    <Input
                      value={userprofile?.email}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Mobile (read-only) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Mobile Number
                    </label>
                    <Input
                      value={userprofile?.mobile}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <Button
                onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-700 text-white mt-6"
                disabled={isButtonDisabled}
              >
                Update Profile
              </Button>
            </TabsContent>

            <TabsContent value="CHANGE PASSWORD" className="space-y-6 pt-6">
<ChangePassword/>
            </TabsContent>
            {/* Optional: other tabs like SECURITY SETTINGS can go here */}
          </Tabs>
        </Card>

        {/* Two-Factor Authentication Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-indigo-900">
              Two-Factor Verification
            </h2>

            <p className="text-gray-600">
              Two-factor authentication is a method for protection your web
              account. When it is activated you need to enter not only your
              password, but also a special code. You can receive this code by in
              mobile app. Even if third person will find your password, then
              can't access with that code.
            </p>

            <div className="flex items-center justify-between">
              <Button
                onClick={handleEnable2FA}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Enable 2FA
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">CURRENT STATUS:</span>
                <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 text-sm">
                  DISABLED
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
