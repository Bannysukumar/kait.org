'use client'

import { useState, useEffect } from 'react'
import { CheckCheck, ClipboardCopy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile, updateUserProfile } from '@/store/slices/profileAPI' // ✅ fixed import
import { RootState, AppDispatch, useAppSelector } from '@/store/store'
import Possword from './password'
import NomineeComponent from './nominee'
import BankAccountPage from './bankAccount'
import ReferralComponent from '../components/referralComponent'
import Transactionpass from './transactionpass'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { verifyKYCStatus } from '@/store/slices'
import { toast } from 'react-hot-toast'

export default function ProfileDetails() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'PERSONAL'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [copied, setCopied] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const dispatch = useDispatch<AppDispatch>()
  const { userprofile, isLoading, error } = useSelector(
    (state: RootState) => state.profile.profile
  )

  const { data: userData } = useAppSelector((state) => state.UserTree)
  const { kycVerified } = useAppSelector((state) => state.auth)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')

  // 🔹 Fetch profile, user data & KYC once
  useEffect(() => {
    dispatch(fetchUserProfile())
    dispatch(fetchUserData())
    dispatch(verifyKYCStatus())
  }, [dispatch])

  // 🔹 Prefill form values after profile fetch
  useEffect(() => {
    if (userprofile) {
      setFirstName(userprofile.first_name || '')
      setLastName(userprofile.last_name || '')
      setDob(userprofile.dob || '')
    }
  }, [userprofile])

  // 🔹 Check if form values changed
  useEffect(() => {
    const hasChanges =
      firstName !== userprofile?.first_name ||
      lastName !== userprofile?.last_name ||
      dob !== userprofile?.dob
    setIsButtonDisabled(!hasChanges)
  }, [firstName, lastName, dob, userprofile])

  // 🔹 Handle profile update
  const handleSubmit = async () => {
    if (!firstName || !lastName || !dob) {
      toast.error('All fields are required.')
      return
    }

    setIsButtonDisabled(true)
    const updatedData = { first_name: firstName, last_name: lastName, dob }

    try {
      const response = await dispatch(updateUserProfile(updatedData))

      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Profile updated successfully ✅')
        dispatch(fetchUserProfile())
      } else {
        // response.payload could be a string (from rejectWithValue)
        const errorDetail =
          typeof response.payload === 'string'
            ? response.payload
            : response.payload?.detail || response.payload?.message || 'Failed to update profile'

        toast.error(errorDetail)
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Something went wrong'
      toast.error(errorMsg)
    } finally {
      setIsButtonDisabled(false)
    }
  }


  // 🔹 Handle copy wallet
  const handleCopy = () => {
    if (userData?.wallet) {
      navigator.clipboard.writeText(userData.wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 🔹 Show error if any
  // useEffect(() => {
  //   if (error) {
  //     toast.error(typeof error === 'string' ? error : 'Something went wrong!')
  //   }
  // }, [error])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left / Main Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <h2 className="text-2xl font-semibold">Profile Details</h2>
              <CardContent className="w-full sm:w-auto">
                <CardDescription>Your Referral Link</CardDescription>
                <Card className="flex justify-center items-center w-full max-w-md h-[30px] overflow-hidden">
                  <ReferralComponent />
                </Card>
              </CardContent>
            </div>

            {/* TABS */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val)
                const params = new URLSearchParams(window.location.search)
                params.set('tab', val)
                router.push(`?${params.toString()}`)
              }}
            >
              <TabsList className="border-b w-full justify-start rounded-none gap-4 overflow-x-auto scrollbar-hide">
                {['PERSONAL', 'NOMINEE', 'PASSWORD', 'TRANS.PWD', 'BANK'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`pb-2 shrink-0 ${activeTab === tab
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500'
                      }`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* PERSONAL TAB */}
              <TabsContent value="PERSONAL" className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">First Name</label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Last Name</label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Email Address</label>
                    <Input value={userprofile?.email} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Mobile Number</label>
                    <Input value={userprofile?.mobile} readOnly className="bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Date of Birth</label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white w-full md:w-auto"
                  disabled={isButtonDisabled}
                >
                  Update Profile
                </Button>
              </TabsContent>

              <TabsContent value="NOMINEE" className="space-y-6 pt-6"><NomineeComponent /></TabsContent>
              <TabsContent value="PASSWORD" className="space-y-6 pt-6"><Possword /></TabsContent>
              <TabsContent value="TRANS.PWD" className="space-y-6 pt-6"><Transactionpass /></TabsContent>
              <TabsContent value="BANK" className="space-y-6 pt-6"><BankAccountPage /></TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Account Status */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-2">Your Account Status</h2>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-500">Email Verified</Badge>
            <Badge className={`flex items-center gap-1 text-[12px] ${kycVerified ? 'bg-emerald-500' : 'bg-red-500'}`}>
              {kycVerified ? <><CheckCheck /> KYC Verified</> : 'Not Verified'}
            </Badge>
          </div>
        </Card>

        {/* Wallet */}
        <Card className="p-4 sm:p-6 flex flex-col gap-2 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-700">Wallet Address</h2>
          <div className="flex items-center gap-2 border border-purple-700 shadow-xl shadow-purple-300 rounded px-3 py-2 w-full overflow-hidden">
            <span className="text-[15px] whitespace-nowrap overflow-hidden text-ellipsis flex-1" title={userData?.wallet}>
              {userData?.wallet || '—'}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-md hover:bg-blue-700"
            >
              <ClipboardCopy size={20} />
            </button>
          </div>
          {copied && <span className="text-sm text-green-600 mt-1">Copied!</span>}
        </Card>

        {/* KYC */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-2">Identity Verification - KYC</h2>
          <p className="text-gray-600 mb-2">
            To comply with regulation, participant will have to go through identity verification.
          </p>
          {kycVerified ? (
            <div className="text-emerald-500 font-medium mb-2">Identity (KYC) has been verified.</div>
          ) : (
            <div className="text-red-500 font-medium mb-2">Identity (KYC) not verified.</div>
          )}
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            View KYC
          </Button>
        </Card>
      </div>
    </div>
  )
}
