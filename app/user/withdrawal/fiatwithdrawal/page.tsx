'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchFiatWalletBalance } from '@/store/slices/user/walletWithdrawal/fiatWallet'
import {
  withdrawFiat,
  resetWithdrawState,
} from '@/store/slices/user/walletWithdrawal/fiatWithdrawForm'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchFiatWithdrawSummary } from '@/store/slices/user/walletWithdrawal/fiatWithdrawSummary'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import Image from 'next/image'
import {
  BeneficiaryEligible,
  fetchEligibleBeneficiaries,
} from '@/store/slices/user/beneficiaryeligible'
import kaitimg from '../../../../assets/logo2x.png'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import Cookies from 'js-cookie'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'

export default function FiatWalletSummary() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const FiatState = useAppSelector((state) => state.Fiatwithdraw)
  const withdrawState = useAppSelector((state) => state.FiatwithdrawForm)
  const { success: otpSuccess, error: otpError } = useAppSelector(
    (state) => state.TranferwalletOpt,
  )
  const {
    items,
    loading: summaryLoading,
    error: summaryError,
  } = useAppSelector((state) => state.fiatWalletSummary)

  const { beneficiaries } = useAppSelector((state) => state.BeneficiaryEligible)

  const [formData, setFormData] = useState({
    amount: 0,
    beneficiary_id: '',
    otp: '',
    transaction_pin: '',
  })
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<BeneficiaryEligible | null>(null)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'loading' | 'loaded'>('loading')
  const [sendingOtp, setSendingOtp] = useState(false)

  const fetchSummary = () =>
    dispatch(
      fetchFiatWithdrawSummary({
        review_status: 'any',
        page: 1,
        page_size: 10,
      }),
    )

  useEffect(() => {
    dispatch(fetchFiatWalletBalance())
    fetchSummary().finally(() => setStatus('loaded'))
    dispatch(fetchEligibleBeneficiaries())
  }, [dispatch])

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      setOpen(true)
      dispatch(resetOtpState())
    }
    if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  useEffect(() => {
    if (withdrawState.success) {
      toast.success('Withdrawal successful')
      setOpen(false)
      setFormData({
        amount: 0,
        beneficiary_id: '',
        otp: '',
        transaction_pin: '',
      })
      setSelectedBeneficiary(null)
      dispatch(fetchFiatWalletBalance())
      fetchSummary()
      setTimeout(() => dispatch(resetWithdrawState()), 3000)
    }
    if (withdrawState.error) {
      toast.error(withdrawState.error)
      dispatch(resetWithdrawState())
    }
  }, [withdrawState.success, withdrawState.error, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? value : value,
    }))
  }

  const validateWithdrawForm = () => {
    if (formData.amount < 501) {
      toast.error('Amount should be greater than 500')
      return false
    }
    if (!formData.beneficiary_id.trim()) {
      toast.error('Beneficiary is required')
      return false
    }
    return true
  }

  const handleSendOtp = async () => {
    if (!validateWithdrawForm()) return

    // ✅ Check if entered amount is less than max allowed
    if (formData.amount > (max_allowed_to_withdraw ?? 0)) {
      toast.error(`Entered amount exceeds your maximum withdrawable limit (${max_allowed_to_withdraw ?? 0})`)
      return
    }

    try {
      const token = Cookies.get('token') || ''
      const actionResult = await dispatch(fetchTransferPinStatus(token))
      const pinStatus: boolean = unwrapResult(actionResult)

      if (!pinStatus) {
        toast.error('Set your transaction password before withdrawing.')
        router.push('/user/profile?tab=TRANS.PWD')
        return
      }

      setSendingOtp(true)
      await dispatch(transferWalletOtp()).finally(() => setSendingOtp(false))
      setOpen(true)
    } catch {
      toast.error('Error checking transaction pin status.')
    }
  }


  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.otp.trim()) {
      toast.error('OTP is required')
      return
    }
    if (!formData.transaction_pin.trim()) {
      toast.error('Transaction PIN is required')
      return
    }
    dispatch(withdrawFiat(formData))
  }

  const {
    total,
    max_allowed_to_withdraw,
    eligible,
    remaining_days,
    last_request_date,
  } = FiatState.fiat || {}

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000 px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left Column */}
        <Box className="space-y-8 w-full">
          <Box className="p-4 shadow rounded bg-white w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-5">
              <Typography variant="h6" className="font-extrabold text-xl sm:text-2xl">
                Withdraw - Fiat Wallet
              </Typography>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-700 hover:shadow-xl w-full sm:w-auto"
                href="/user/beneficiary"
                style={{ color: 'white' }}
              >
                Add Beneficiary
              </Button>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-700 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4">
              {/* <div className="flex justify-center items-center">
                <Image src={Logo} alt="Logo" priority width={50} height={50} />
              </div> */}
              <div className="text-white flex-1">
                {/* <div className="flex gap-2 flex-wrap text-sm">
                  <Typography>Total</Typography>
                  <span>|</span>
                  <Typography>Max Withdrawable</Typography>
                </div> */}

                <div className="flex gap-2 flex-wrap text-lg sm:text-2xl">
                  <Typography className="flex border-2 rounded-2xl border-white p-2 gap-1 items-center">
                    <Typography component="span">Total</Typography>:
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    {total ?? 0}
                  </Typography>

                  <Typography className="flex border-2 rounded-2xl border-white p-2 gap-1 items-center">
                    <Typography component="span">Max Withdrawable</Typography>:
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    {max_allowed_to_withdraw ?? 0}
                  </Typography>
                </div>

                {/* <Typography className="flex items-center text-black p-2 gap-2 bg-white rounded-xl w-fit text-sm mt-2">
                  Balance:
                  <Image src={Logo} alt="Logo" priority width={20} height={20} />
                  {total ?? 0}
                </Typography> */}

                <div className="flex flex-wrap gap-2 mt-4 text-xs sm:text-sm">
                  <Typography className=" text-white border-2  border-white p-2 rounded-xl">
                    Eligibility: {eligible ? 'Yes' : 'No'}
                  </Typography>
                  <Typography className=" p-2 text-white  border-2 border-white rounded-xl">
                    Remaining Days: {remaining_days ?? 'N/A'}
                  </Typography>
                  <Typography className=" text-white  border-2 border-white p-2 rounded-xl">
                    Last Request: {last_request_date ?? 'N/A'}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography className=' flex ' style={{ marginLeft: "10px" }}>
              Max Withdrawal Limit 40,000
            </Typography>

            {/* Withdraw Form */}
            <Box
              component="form"
              className="p-4 flex flex-col gap-4 border rounded mt-6 bg-white w-full"
            >
              <Typography variant="h6" className="text-pink-800 text-lg">
                Withdraw Fiat
              </Typography>

              <TextField
                fullWidth
                name="amount"
                label="Amount"
                // type="number"
                value={formData.amount}
                onChange={handleChange}
              />

              <Autocomplete
                value={selectedBeneficiary}
                options={beneficiaries}
                getOptionLabel={(option) => option.nick_name}
                onChange={(_, value) => {
                  setSelectedBeneficiary(value)
                  setFormData((prev) => ({
                    ...prev,
                    beneficiary_id: value?.beneficiary_id || '',
                  }))
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Beneficiary" fullWidth />
                )}
              />

              {beneficiaries.length === 0 && (
                <Typography variant="body2" color="error">
                  No eligible beneficiaries found. Please add one first.
                </Typography>
              )}

              <Button
                variant="contained"
                className="bg-gradient-to-r from-blue-500 to-purple-700"
                style={{ color: "white" }}
                onClick={handleSendOtp}
                fullWidth
                disabled={sendingOtp || !eligible} // 🔹 Disable if not eligible
              >
                {!eligible
                  ? 'Not Eligible for Withdrawal'
                  : sendingOtp
                    ? 'Sending OTP...'
                    : 'Process Your Request'}
              </Button>
            </Box>
          </Box>

          {/* Dialog */}
          <Dialog fullWidth maxWidth="xs" open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <Box component="form" onSubmit={handleWithdrawSubmit}>
              <DialogContent dividers>
                <TextField
                  autoFocus
                  fullWidth
                  name="otp"
                  label="OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  margin="dense"
                  required
                />
                <TextField
                  fullWidth
                  name="transaction_pin"
                  label="Transaction PIN"
                  type="password"
                  value={formData.transaction_pin}
                  onChange={handleChange}
                  margin="dense"
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-gradient-to-r from-blue-500 to-purple-700"
                  disabled={withdrawState.loading}
                >
                  {withdrawState.loading ? 'Withdrawing...' : 'Confirm'}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </Box>

        {/* Right Column - Table */}
        <Box className="space-y-4 bg-white p-4 rounded shadow w-full overflow-x-auto">
          <Typography variant="h6" className="text-xl font-extrabold">
            Fiat Withdrawal Summary
          </Typography>

          {summaryLoading && <Typography>Loading summary...</Typography>}
          {summaryError && (
            <Typography className="text-red-500">{summaryError}</Typography>
          )}

          {!summaryLoading && !summaryError && (
            <TableContainer component={Paper} className="shadow min-w-[500px]">
              <Table size="small" aria-label="Fiat Withdrawal Table">
                <TableHead>
                  <TableRow className="bg-purple-100">
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Beneficiary</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {new Date(item.date_time).toLocaleString()}
                        </TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Image
                              src={kaitimg}
                              width={15}
                              height={15}
                              alt="Kait"
                              className="object-contain"
                            />
                            {item.amount.toLocaleString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell>{item.beneficiary_nick_name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </div>
    </div>
  )
}
