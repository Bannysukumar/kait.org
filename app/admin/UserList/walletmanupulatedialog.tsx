// 'use client'

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { useState } from 'react'
// import { toast } from 'react-hot-toast'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, RootState } from '@/store/store'
// import {
//   loadWalletThunk,
//   resetWalletLoad,
// } from '@/store/slices/admin/loadWalletSlice'
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select'
// import { InvestorDetails } from '@/store/slices/admin/investorSlice'

// interface WalletManipulationDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   userId: string
//   walletType: string
// }

// const walletKindMap: Record<string, keyof InvestorDetails> = {
//   Kait: 'kiat_wallet', 
//   Income: 'income_wallet',
//   Adhoc: 'adhoc_wallet',
//   ROS: 'ros_wallet',
//   Restaking: 'restake_wallet',
//   Fiat: 'fiat_wallet',
//   Vpay: 'vpay_voucher',
//   Ecommerce: 'ecommerce_voucher',
//   Super: 'super_wallet',
// }



// // Labels for displaying wallets
// const walletLabels: Partial<Record<keyof InvestorDetails, string>> = {
//   kiat_wallet: 'Kait Wallet',
//   income_wallet: 'Income Wallet',
//   adhoc_wallet: 'Adhoc Wallet',
//   restake_wallet: 'Restake Wallet',
//   fiat_wallet: 'Fiat Wallet',
//   vpay_voucher: 'Vpay Voucher',
//   ecommerce_voucher: 'Ecommerce Voucher',
//   super_wallet: 'Super Wallet',
//   roi: 'ROS Wallet',
//   roc: 'ROC Wallet',
//   invested: 'Main Balance',
//   // stake_wallet: 'Stake Wallet',
// }

// export default function WalletManipulationDialog({
//   open,
//   onOpenChange,
//   userId,
//   walletType,
// }: WalletManipulationDialogProps) {
//   const dispatch = useDispatch<AppDispatch>()
//   const [amount, setAmount] = useState('')
//   const [reason, setReason] = useState('')
//   const [transactionType, setTransactionType] =
//     useState<'credit' | 'debit'>('credit')

//   const { loading } = useSelector((state: RootState) => state.loadWallet)
//   const { details: investorDetails, detailsLoading: investorLoading } = useSelector(
//     (state: RootState) => state.investor
//   )

//   // Get the key for the selected wallet
//   const walletKey = walletKindMap[walletType]
//   if (!walletKey) console.warn('No wallet key found for:', walletType)
//   const walletBalance =
//     investorDetails && walletKey in investorDetails
//       ? Number(investorDetails[walletKey as keyof InvestorDetails] ?? 0)
//       : 0



//   const handleSubmit = async () => {
//     if (!amount || Number(amount) <= 0) {
//       toast.error('Valid amount is required.')
//       return
//     }

//     const token = localStorage.getItem('token')
//     if (!token) {
//       toast.error('Missing token. Please login again.')
//       return
//     }

//     const formattedWalletKind = walletKindMap[walletType] || walletType

//     try {
//       const resultAction = await dispatch(
//         loadWalletThunk({
//           user_id: userId,
//           wallet_kind: formattedWalletKind,
//           transaction_type: transactionType,
//           comment: reason || 'Load Wallet',
//           amount: Number(amount),
//           token,
//         }),
//       )

//       if (loadWalletThunk.fulfilled.match(resultAction)) {
//         toast.success(`${walletType} ${transactionType} successful`)
//         setAmount('')
//         setReason('')
//         onOpenChange(false)
//         dispatch(resetWalletLoad())
//       } else {
//         toast.error(resultAction.payload as string)
//       }
//     } catch (error) {
//       toast.error('Unexpected error while loading wallet')
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="bg-white max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-lg font-semibold mb-2">
//             Manipulate {walletType} Wallet
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           {/* Transaction Type Selector */}
//           <Select
//             value={transactionType}
//             onValueChange={(val: 'credit' | 'debit') => setTransactionType(val)}
//           >
//             <SelectTrigger className="bg-white">
//               <SelectValue placeholder="Transaction Type" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="credit">Add</SelectItem>
//               <SelectItem value="debit">Deduct</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Show only the selected wallet balance */}
//           {walletKey && (
//             <div className="bg-gray-50 rounded-lg p-3 space-y-2">
//               <h4 className="font-semibold text-sm text-gray-700">
//                 {walletLabels[walletKey]} Balance
//               </h4>
//               {investorLoading ? (
//                 <div className="flex justify-center items-center py-2 text-gray-500 text-sm">
//                   Loading...
//                 </div>
//               ) : (
//                 <div className="flex justify-between border-b pb-1 text-gray-600 text-sm">
//                   <span>{walletLabels[walletKey]}</span>
//                   <span className="font-medium">
//                     {walletBalance.toLocaleString('en-US')}
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}





//           {/* Amount + Reason */}
//           <Input
//             type="number"
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//           <Input
//             type="text"
//             placeholder="Reason (optional)"
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//           />

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={loading}>
//               {loading ? 'Processing...' : 'Submit'}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }




'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  loadWalletThunk,
  resetWalletLoad,
} from '@/store/slices/admin/loadWalletSlice'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface WalletManipulationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  walletId: string | null      // e.g. "income_wallet"
  walletKind: string | null    // e.g. "IncomeWallet"
}

// Format: "income_wallet" → "Income Wallet"
const formatWalletLabel = (id: string | null | undefined) => {
  if (!id) return "Unknown Wallet"
  return id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function WalletManipulationDialog({
  open,
  onOpenChange,
  userId,
  walletId,
  walletKind,
}: WalletManipulationDialogProps) {
  const dispatch = useDispatch<AppDispatch>()

  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [transactionType, setTransactionType] =
    useState<'credit' | 'debit'>('credit')

  const { loading } = useSelector((state: RootState) => state.loadWallet)
  const { details: investorDetails, detailsLoading: investorLoading } =
    useSelector((state: RootState) => state.investor)

  // Reset fields when opening dialog
  useEffect(() => {
    if (open) {
      setAmount('')
      setReason('')
      setTransactionType('credit')
    }
  }, [open])

  const walletLabel = formatWalletLabel(walletId)

  // Safely extract wallet balance
  const walletBalance = investorDetails?.[walletId as keyof typeof investorDetails]
    ? Number(investorDetails[walletId as keyof typeof investorDetails])
    : 0

  const handleSubmit = async () => {
    if (!walletId || !walletKind) {
      toast.error("Invalid wallet selection.")
      return
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Valid amount is required.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Missing token. Please login again.')
      return
    }

    try {
      const resultAction = await dispatch(
        loadWalletThunk({
          user_id: userId,
          wallet_kind: walletKind,
          transaction_type: transactionType,
          comment: reason || 'Wallet Adjustment',
          amount: Number(amount),
          token,
        }),
      )

      if (loadWalletThunk.fulfilled.match(resultAction)) {
        toast.success(`${walletLabel} ${transactionType} successful`)
        onOpenChange(false)
        dispatch(resetWalletLoad())
      } else {
        toast.error(resultAction.payload as string)
      }
    } catch (error) {
      toast.error('Unexpected error while processing request.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2">
            Manipulate {walletLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Type */}
          <Select
            value={transactionType}
            onValueChange={(val: 'credit' | 'debit') => setTransactionType(val)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="credit">Add</SelectItem>
              <SelectItem value="debit">Deduct</SelectItem>
            </SelectContent>
          </Select>

          {/* Wallet Balance */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">
              {walletLabel} Balance
            </h4>

            {investorLoading ? (
              <div className="flex items-center justify-center py-2 text-gray-500">
                Loading...
              </div>
            ) : (
              <div className="flex justify-between border-b pb-1 text-gray-600 text-sm">
                <span>{walletLabel}</span>
                <span className="font-medium">
                  {walletBalance.toLocaleString('en-US')}
                </span>
              </div>
            )}
          </div>

          {/* Inputs */}
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
