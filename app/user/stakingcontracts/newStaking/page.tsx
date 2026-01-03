'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { HourglassIcon } from 'lucide-react'
import Image from 'next/image'
import BgImg from '../../../../assets/stakeimg.png'
import Kait from '../../../../assets/logo2x.png'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchStakingPlans, fetchWalletSplits, performStake } from '@/store/slices/user/stakeSlice'
import { fetchComboOptions } from '@/store/slices/user/comboPlanSlice'
import { ComboStakeperform } from '@/store/slices/user/comboStakePerform'
import toast from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { GiConfirmed } from 'react-icons/gi'

export default function UnifiedStaking() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [selectedPlanType, setSelectedPlanType] = useState<'normal' | 'combo' | null>(null)
  const [stakeAmount, setStakeAmount] = useState('')
  const [selectedWalletSplitId, setSelectedWalletSplitId] = useState<string>('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [topMessage, setTopMessage] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const stakingState = useSelector((state: RootState) => state.stakingPlans)
  const comboState = useSelector((state: RootState) => state.ComboPlan)

  const normalPlans = stakingState?.plans || []
  const comboPlans = comboState?.items || []
  const walletSplits = stakingState?.walletSplits || []
  const loading = stakingState?.loading || false

  useEffect(() => {
    dispatch(fetchStakingPlans())
    dispatch(fetchComboOptions())
    dispatch(fetchWalletSplits())
  }, [dispatch])

  useEffect(() => {
    if (topMessage) {
      const timer = setTimeout(() => setTopMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [topMessage])

  useEffect(() => {
    setSelectedWalletSplitId('')
    setStakeAmount('')
  }, [selectedPlanId])

  const selectedPlan = selectedPlanType === 'combo'
    ? comboPlans.find(plan => plan.plan_id === selectedPlanId)
    : normalPlans.find(plan => plan.plan_id === selectedPlanId)

  const formColor: 'pink' | 'blue' = selectedPlanType === 'combo' ? 'pink' : 'blue'

  const formatWalletSplitLabel = (splitValue: Record<string, number>) =>
    Object.entries(splitValue)
      .map(([wallet, percent]) => `${wallet} - ${percent}%`)
      .join(' + ')

  const handleStakeSubmit = async () => {
    if (!selectedPlanId || !stakeAmount || !selectedWalletSplitId || !agreedToTerms) {
      toast.error('Please fill in all required fields.')
      return
    }

    const amountNum = Number(stakeAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Enter a valid staking amount.')
      return
    }

    if (selectedPlan && amountNum < selectedPlan.min_amount) {
      toast.error(`Minimum staking amount for this plan is ${selectedPlan.min_amount}`)
      return
    }

    try {
      setIsSubmitting(true)
      if (selectedPlanType === 'combo') {
        await dispatch(
          ComboStakeperform({
            plan_combo_id: selectedPlanId,
            wallet_split_id: selectedWalletSplitId,
            amount: amountNum,
          })
        ).unwrap()
      } else {
        await dispatch(
          performStake({
            plan_id: selectedPlanId,
            wallet_split_id: selectedWalletSplitId,
            amount: amountNum,
          })
        ).unwrap()
      }

      toast.success('Staking Request Submitted Successfully!')
      setSelectedPlanId('')
      setSelectedPlanType(null)
      setStakeAmount('')
      setSelectedWalletSplitId('')
      setAgreedToTerms(false)
      setShowSuccessDialog(true)
      await dispatch(fetchWalletSplits())
    } catch (err: any) {
      const errorMessage = err || 'Failed to submit staking request.'
      setTopMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-2000 ${selectedPlanType === 'combo' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-purple-700'}`}>
      <div className="max-w-7xl mx-auto">
        {topMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md font-medium">
            {topMessage}
          </div>
        )}

        <div className="flex text-white items-center mb-6 gap-2">
          <Image src={Kait} alt="kait" className="w-[40px] object-cover rounded-lg" />
          <h1 className="text-2xl font-bold">Staking Dashboard</h1>
        </div>

        <Card className="p-8 bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[#105895]">
              <HourglassIcon className="h-8 w-8 fill-red-500" />
            </div>
            <h2 className={`text-xl font-semibold ${formColor}-600`}>Staking Contract</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Illustration */}
            <div className="space-y-4">
              <div className="h-[300px] relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedPlanType === 'combo' ? 'from-purple-500/20 to-pink-500/20' : 'from-blue-500/20 to-purple-500/20'} rounded-lg`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={BgImg}
                    alt="Staking Illustration"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  {selectedPlanType === 'combo'
                    ? 'Fusion staking allows you to stake multiple assets together to maximize rewards.'
                    : 'Staking is a process in which cryptocurrency holders volunteer to validate blockchain transactions and earn rewards.'}
                </p>
                <p>{selectedPlanType === 'combo' ? 'It’s like a bundled staking plan with better terms!' : 'It’s like earning interest while holding your assets.'}</p>
              </div>
            </div>

            {/* Right Form */}
            <div className="space-y-8">
              {/* Plan Selection */}
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${formColor}-600`}>Choose Plan</h3>
                <p className="text-sm text-gray-600 mb-4">Select a package</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[...normalPlans, ...comboPlans].map(plan => {
                    const type = normalPlans.includes(plan) ? 'normal' : 'combo'
                    const isSelected = selectedPlanId === plan.plan_id
                    return (
                      <button
                        key={plan.plan_id}
                        onClick={() => { setSelectedPlanId(plan.plan_id); setSelectedPlanType(type) }}
                        className={`w-full p-5 rounded-lg text-left transition relative ${isSelected
                          ? type === 'combo' ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                          : type === 'combo' ? 'bg-pink-100 text-gray-700 hover:bg-pink-200' : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                          }`}
                      >
                        <div className="font-bold text-[12px] text-center">{plan.name}</div>
                        <div className="text-[10px] text-center">{plan.description}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Wallet Split & Amount */}
              {selectedPlan && (
                <>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2  ${formColor === 'pink' ? 'text-pink-500' : 'text-blue-500 '}`}>Stake From</h3>
                    <RadioGroup
                      value={selectedWalletSplitId}
                      onValueChange={setSelectedWalletSplitId}
                      className="space-y-3"
                    >
                      {walletSplits.map(split => (
                        <div key={split.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={split.id} id={split.id} />
                          <Label htmlFor={split.id} className="text-sm">
                            {formatWalletSplitLabel(split.value)}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {selectedWalletSplitId && (() => {
                      const selectedSplit = walletSplits.find(s => s.id === selectedWalletSplitId)
                      if (!selectedSplit?.balance) return null

                      return (
                        <div className="ml-6 mt-3 text-sm flex gap-6 text-gray-800">
                          {Object.entries(selectedSplit.balance).map(([wallet, amount]) => (
                            <div key={wallet} className="text-center">
                              <div className="text-[15px] font-bold mb-1">{wallet}</div>
                              <div className="flex items-center justify-center gap-1">
                                <Image src={Kait} alt="kait" className="w-[20px] h-[20px] object-cover rounded-full" />
                                <span>{Number(amount).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-2  ${formColor === 'pink' ? 'text-pink-500' : 'text-blue-500 '}`}>Amount (KAIT) to stake</h3>
                    <Input
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={selectedPlan.min_amount.toString()}
                      className="text-lg"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the <span className="text-red-500 cursor-pointer">Terms & Conditions</span>
                    </Label>
                  </div>

                  <Button
                    className={`w-full h-12 text-lg flex items-center justify-center ${formColor === 'pink' ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    disabled={!selectedPlanId || !stakeAmount || !selectedWalletSplitId || !agreedToTerms || isSubmitting}
                    onClick={handleStakeSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      'Process Stake'
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="text-center bg-white">
            <DialogHeader>
              <DialogTitle className="text-green-600 text-xl font-bold">
                Staking Successful!
              </DialogTitle>
              <DialogDescription className="text-gray-700 mt-2">
                Your staking request has been processed successfully.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center my-4">
              <GiConfirmed className="w-28 h-28 text-green-400" />
            </div>

            <DialogFooter>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowSuccessDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
