'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { performRestake, resetRestake } from '@/store/slices/user/restakeSlice'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

interface RestakeFormProps {
  walletType?: 'IncomeWallet' | 'ReStakeWallet' // Optional prop from parent
  onSuccess?: () => void
}

export default function RestakeForm({ walletType, onSuccess }: RestakeFormProps) {
  const dispatch = useAppDispatch()
  const { loading, error, success } = useAppSelector((state) => state.Restake)
  const { data: dropdownOptions } = useAppSelector((state) => state.dropDownOptions)

  const restakeWalletKinds = dropdownOptions?.restake_wallet_kinds ?? []

  const [amount, setAmount] = useState<number>(1000)
  const [walletKind, setWalletKind] = useState<string>('')

  useEffect(() => {
    dispatch(fetchDropdownOptions())
  }, [dispatch])

  useEffect(() => {
    if (walletType) {
      setWalletKind(walletType)
    } else if (restakeWalletKinds.length > 0 && !walletKind) {
      setWalletKind(restakeWalletKinds[0].value as string)
    }
  }, [restakeWalletKinds, walletKind, walletType])

  useEffect(() => {
    if (!error) return
    let msg = ''
    if (typeof error === 'string') msg = error
    else if (Array.isArray(error)) msg = error.map((e) => e.msg).join(', ')
    else if (error && 'detail' in error) {
      const detail = (error as any).detail
      msg = typeof detail === 'string' ? detail : JSON.stringify(detail)
    } else msg = JSON.stringify(error) || 'Something went wrong'

    toast.error(msg)
  }, [error])

  // Success toast + notify parent
  useEffect(() => {
    if (success) {
      toast.success('Restake successful!')
      setAmount(1000)
      dispatch(resetRestake())
      if (onSuccess) onSuccess()
    }
  }, [success, dispatch, onSuccess])

  const handleSubmit = async () => {
    if (amount <= 0) return toast.error('Amount must be greater than 0')

    // Minimum rules based on wallet type
    const minAmount = walletKind === 'ReStakeWallet' ? 3000 : 1000
    if (amount < minAmount || amount % 1000 !== 0) {
      return toast.error(`'Amount' should be >= ${minAmount} and a multiple of 1000.`)
    }

    await dispatch(performRestake({ wallet_kind: walletKind as any, amount }))
  }

  return (
    <div className="p-6 z-[999] space-y-6 bg-gradient-to-br from-purple-50 via-purple-100 to-white rounded-xl shadow-xl border border-purple-300 max-w-md mx-auto">
      <h2 className="text-center text-2xl font-bold text-purple-700 mb-4 animate-pulse">
        Restake Your Wallet
      </h2>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Select Wallet</label>
        <select
          value={walletKind}
          onChange={(e) => setWalletKind(e.target.value)}
          disabled={!!walletType} // Disable if passed from dashboard
          className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        >
          {restakeWalletKinds.length > 0 ? (
            restakeWalletKinds.map((wallet) => (
              <option key={wallet.id} value={wallet.value}>
                {wallet.value}
              </option>
            ))
          ) : (
            <option disabled>Loading wallets...</option>
          )}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Amount</label>
        <Input
        //   type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount (multiple of 1000)"
          className="w-full border border-purple-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {loading ? 'Processing...' : 'Restake'}
      </Button>
    </div>
  )
}
