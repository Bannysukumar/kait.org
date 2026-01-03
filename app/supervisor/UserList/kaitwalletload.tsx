'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { loadKaitWalletThunk, resetKaitWalletLoad } from '@/store/slices/admin/kaitwalletloadSlice'

interface KaitWalletDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    userId: string
}

export default function KaitWalletDialog({
    open,
    onOpenChange,
    userId,
}: KaitWalletDialogProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')
    const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit')

    const { loading } = useSelector((state: RootState) => state.kaitWalletLoad)
    const { details: investorDetails, detailsLoading: kaitBalanceLoading } = useSelector(
        (state: RootState) => state.investor
    )

    // Safely read Kait Wallet balance
    const kaitBalance = investorDetails?.kiat_wallet ?? 0

    const handleSubmit = async () => {
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
                loadKaitWalletThunk({
                    user_id: userId,
                    amount: Number(amount) * (transactionType === 'debit' ? -1 : 1),
                    token,
                })
            )

            if (loadKaitWalletThunk.fulfilled.match(resultAction)) {
                toast.success(`Kait Wallet ${transactionType} successful!`)
                setAmount('')
                setMessage('')
                setTransactionType('credit')
                onOpenChange(false)
                dispatch(resetKaitWalletLoad())
            } else {
                toast.error(resultAction.payload as string)
            }
        } catch {
            toast.error('Unexpected error while manipulating Kait Wallet')
        }
    }



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold mb-2">
                        Manipulate Kait Wallet
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

                    {/* Current Balance */}
                    {/* Current Balance */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                        <h4 className="font-semibold text-sm text-gray-700">Kait Wallet Balance</h4>

                        {kaitBalanceLoading ? (
                            <div className="flex justify-center items-center py-2 text-gray-500 text-sm">
                                Loading...
                            </div>
                        ) : (
                            <div className="flex justify-between text-sm text-gray-600 border-b pb-1">
                                <span>Available</span>
                                <span className="font-medium">
                                    {kaitBalance.toLocaleString('en-US')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Amount Input */}
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    {/* Message / Reason */}
                    <Input
                        type="text"
                        placeholder="Message / Reason (optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    {/* Action Buttons */}
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
