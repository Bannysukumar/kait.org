'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { verifyKYCStatus } from '../../../store/slices/index'
import { useRouter } from 'next/navigation'
import { FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function KycVerification() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const {
    kycVerified,
    kycStatusLoading,
    kycStatusError,
    kycRejected,
    kycPending,
  } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(verifyKYCStatus())
  }, [dispatch])

  const getStatusMessage = () => {
    if (kycStatusLoading) return 'Checking your KYC status...'
    if (kycStatusError)
      return 'Error fetching KYC status. Please try again later.'
    if (kycRejected) return 'Your KYC application has been rejected.'
    if (kycPending) return 'Your KYC is currently under review.'
    if (kycVerified)
      return 'Your identity has already been verified. Thank you!'
    return 'You have not submitted your necessary documents to verify your identity.'
  }

  return (
    <div className="bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-4000">
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-3xl font-semibold mb-6 pt-6 text-gray-800">
          KYC Verification
        </h1>

        <p className="text-gray-600 mb-8 px-4">
          To comply with regulations, each participant is required to go through
          identity verification (KYC/AML) to prevent fraud, money laundering
          operations,
          <span className="px-1">
            transactions banned under the sanctions regime or those which fund
            terrorism. Please, complete our fast and secure verification process
            to participate in token offerings.
          </span>
        </p>

        <Card className="bg-white shadow-lg">
          <CardContent className="pt-12 pb-8 px-6">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <FileIcon className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            <h2 className="text-xl text-gray-700 mb-4">{getStatusMessage()}</h2>

            {!kycVerified && !kycStatusLoading && (
              <>
                <p className="text-gray-500 mb-8">
                  {kycRejected
                    ? 'Your application was rejected. Please contact support for more information.'
                    : kycPending
                      ? 'Your application is being reviewed. You will be notified once it’s approved.'
                      : 'It would be great if you please submit the form. If you have any questions, feel free to contact our support team.'}
                </p>

                <Button
                  onClick={() => router.push('/user/kyc/application')}
                  className="bg-red-600 text-white px-8 py-2 rounded-md transition-colors"
                  disabled={kycPending}
                >
                  {kycRejected
                    ? 'Re-submit KYC'
                    : kycPending
                      ? 'KYC Submitted'
                      : 'Click here to complete your KYC'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <p className="mt-8 text-gray-600">
          Contact our support team via email -{' '}
          <a
            href="mailto:support@kaitworld.com"
            className="text-red-600 hover:text-red-700"
          >
            support@kaitworld.com
          </a>
        </p>
      </div>
    </div>
  )
}
