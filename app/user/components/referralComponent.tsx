'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateReferralLink } from '../../../store/slices/index'
import { AppDispatch, RootState } from '../../../store/store'
import { ClipboardCopy } from 'lucide-react'

const ReferralComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { referralLink, isLoading, error } = useSelector((state: RootState) => state.auth)
  const [copySuccess, setCopySuccess] = useState(false)

  // Ref to ensure API call runs only once
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      dispatch(generateReferralLink())
    }
  }, [dispatch])

  const handleCopy = () => {
    if (referralLink) {
      const referralUrl = `https://www.kaitcoin.org/auth/signup?token=${referralLink}`
      navigator.clipboard.writeText(referralUrl).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    }
  }

  return (
    <div className="text-center w-full">
      {isLoading ? (
        <p>Loading referral link...</p>
      ) : referralLink ? (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-1 rounded-lg w-full max-w-full">
          <span className="truncate w-full font-medium text-sm sm:text-base">
            {`https://www.kaitcoin.org/auth/signup?token=${referralLink}`}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-md hover:bg-blue-700"
          >
            {copySuccess ? 'Copied!' : <ClipboardCopy />}
          </button>
        </div>
      ) : (
        error && <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}

export default ReferralComponent
