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
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchRosWalletBalance } from '@/store/slices/user/walletWithdrawal/rosWallet'
import {
  withdrawRos,
  resetWithdrawState,
} from '@/store/slices/user/walletWithdrawal/rosWithdrawForm'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchRosWithdrawSummary } from '@/store/slices/user/walletWithdrawal/rosWithdrawSummary'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import Image from 'next/image'
import { fetchEligibleBeneficiaries } from '@/store/slices/user/beneficiaryeligible'
import type { BeneficiaryEligible } from '@/store/slices/user/beneficiaryeligible'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function RosWalletSummary() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const rosState = useAppSelector((state) => state.Roswithdraw)
  const withdrawState = useAppSelector((state) => state.RoswithdrawForm)
  const { success: otpSuccess, error: otpError } = useAppSelector(
    (state) => state.TranferwalletOpt,
  )
  const {
    items,
    loading: summaryLoading,
    error: summaryError,
  } = useAppSelector((state) => state.RosWalletSummary)
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
      fetchRosWithdrawSummary({
        review_status: 'any',
        page: 1,
        page_size: 10,
      }),
    )

  useEffect(() => {
    dispatch(fetchRosWalletBalance())
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
      dispatch(fetchRosWalletBalance())
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

    // 🟡 Check max allowed withdrawal
    if (formData.amount > (max_allowed_to_withdraw ?? 0)) {
      toast.error(`You can withdraw up to ${max_allowed_to_withdraw ?? 0} only.`)
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
    dispatch(withdrawRos(formData))
  }

  const {
    total,
    max_allowed_to_withdraw,
    eligible,
    remaining_days,
    last_request_date,
  } = rosState.Ros || {}

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#F3EAD8] hover:bg-blue-50 transition-colors duration-2000 px-3 sm:px-5">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 pt-5 max-w-6xl m-auto py-10">
        {/* Left Section */}
        <Box className="space-y-8 max-w-2xl w-full">
          <Box className="p-4 shadow rounded bg-white">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
              <Typography variant="h6" className="font-extrabold text-xl sm:text-2xl">
                Ros Wallet
              </Typography>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-700 hover:shadow-xl w-full sm:w-auto"
                href="/user/beneficiary"
                style={{ color: 'white' }}
              >
                Add Beneficiary
              </Button>
            </div>

            {/* Wallet Info Box */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center">
              {/* <div className="flex justify-center items-center p-6 sm:pr-0">
                <Image src={Logo} alt="Logo" priority width={50} height={50} />
              </div> */}
              <div className="p-5 text-white">
                {/* <div className="flex gap-1 flex-wrap text-sm sm:text-base">
                  <Typography>Total</Typography>
                  <span className="text-xl">|</span>
                  <Typography>Max Withdrawable</Typography>
                </div> */}

                <div className="flex gap-3 flex-wrap text-lg sm:text-2xl mt-1">
                  <Typography className="flex border-2 rounded-2xl border-white p-2 gap-2 items-center">
                    <Typography>Total</Typography>:
                    <Image src={Logo} alt="Logo" priority width={20} height={20} />
                    {total ?? 0}
                  </Typography>
                  {/* <span className="text-2xl">|</span> */}
                  <Typography className="flex border-2 rounded-2xl border-white p-2 gap-2 items-center">
                    <Typography>Max Withdrawable</Typography>:
                    <Image src={Logo} alt="Logo" priority width={20} height={20} />
                    {max_allowed_to_withdraw ?? 0}
                  </Typography>
                </div>

                {/* <Typography
                  className="flex items-center text-black p-2 gap-2 bg-white rounded-xl w-fit mt-2"
                  style={{ fontSize: '14px' }}
                >
                  Balance:
                  <Image src={Logo} alt="Logo" priority width={20} height={20} />
                  {total ?? 0}
                </Typography> */}

                <div className="flex flex-wrap gap-2 mt-4">
                  <Typography className="text-white border-2  border-white p-2 rounded-xl text-xs">
                    Eligibility: {eligible ? 'Yes' : 'No'}
                  </Typography>
                  <Typography className="text-white border-2  border-white p-2 rounded-xl text-xs">
                    Remaining Days: {remaining_days ?? 'N/A'}
                  </Typography>
                  <Typography className="text-white border-2  border-white p-2 rounded-xl text-xs">
                    Last Request Date: {last_request_date ?? 'N/A'}
                  </Typography>

                </div>
              </div>
            </div>
            <Typography className=' flex ' style={{marginLeft:"10px"}}>
              Max Withdrawal Limit 40,000 <br/>Minimum of 100 KAIT to be maintain in ROS Wallet
            </Typography>
            {/* Withdraw Form */}
            <Box
              component="form"
              className="p-4 flex flex-col gap-6 border rounded bg-white space-y-4"
            >
              <Typography variant="h6" className="text-pink-800 text-lg">
                Withdraw ROS
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
                {withdrawState.error && (
                  <Typography color="error" variant="body2" mt={1}>
                    {withdrawState.error}
                  </Typography>
                )}
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

        {/* Right Section - Table */}
        <Box className="space-y-4 bg-white p-4 sm:p-6 rounded shadow max-w-full overflow-x-auto">
          <Typography variant="h6" className="text-xl sm:text-2xl font-extrabold">
            ROS Withdrawal Summary
          </Typography>

          {summaryLoading && <Typography>Loading summary...</Typography>}
          {summaryError && (
            <Typography className="text-red-500">{summaryError}</Typography>
          )}

          {!summaryLoading && (
            <TableContainer component={Paper} className="shadow overflow-x-auto">
              <Table size="small" aria-label="ROS Withdrawal Table">
                <TableHead>
                  <TableRow className="bg-purple-100">
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span>Amount</span>
                        <Image
                          src={Logo}
                          alt="Logo"
                          priority
                          width={15}
                          height={15}
                          className="ml-0.5"
                        />
                      </div>
                    </TableCell>
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
                          <div className="flex items-center">
                            <span>{item.amount}</span>
                            <Image
                              src={Logo}
                              alt="Logo"
                              priority
                              width={15}
                              height={15}
                              className="ml-0.5"
                            />
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
