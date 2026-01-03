'use client'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateFixedRosTransfer,
  resetRosTransferState,
} from '@/store/slices/user/fixedRosTransferSlice'
import {
  resetOtpState,
  transferWalletOtp,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import { IoCheckmarkDoneCircleSharp, IoEye, IoEyeOff } from 'react-icons/io5'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'
import Logo from '../../../../assets/logo2x.png'
import { MdLockOutline, MdMessage, MdVpnKey } from 'react-icons/md'

const FixedRosWalletTransfer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { loading, success, successMessage, error } = useAppSelector(
    (state) => state.FixedRostransfer,
  )

  const { loading: otpLoading, success: otpSuccess, error: otpError } =
    useAppSelector((state) => state.TranferwalletOpt)

  const userLoading = useAppSelector((state) => state.UserTree.loading)
  const { balances } = useAppSelector((state) => state.transferBalance)

  const [amount, setAmount] = useState<number>(0)
  const [otp, setOtp] = useState('')
  const [transactionPin, setTransactionPin] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [showPin, setShowPin] = useState(false);
  const [successMessageLocal, setSuccessMessageLocal] = useState<string | null>(
    null,
  )

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  // ✅ Step 1 — Validate and request OTP
  const handleStartFixedRos = async () => {
    if (!amount || amount < 500) {
      toast.error('Amount should be greater than 500')
      return
    }

    const availableBalance =
      balances?.FixedRosWallet?.max_allowed_to_withdraw ?? 0
    if (amount > availableBalance) {
      toast.error(
        `Insufficient Fixed ROS Wallet balance. Max allowed: ${availableBalance.toLocaleString()} KAIT`,
      )
      return
    }

    if (!token) {
      toast.error('Authentication token missing')
      return
    }

    try {
      const result = await dispatch(fetchTransferPinStatus(token)).unwrap()
      if (!result) {
        toast.error('Please set your transaction pin first')
        router.push('/user/profile?tab=TRANS.PWD')
        return
      }

      dispatch(transferWalletOtp())
      setOpenDialog(true)
    } catch {
      toast.error('Failed to check pin status')
    }
  }

  // ✅ Step 2 — Submit transfer
  const handleSubmit = () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP.')
      return
    }

    if (!transactionPin || transactionPin.length < 4) {
      toast.error('Please enter a valid transaction pin.')
      return
    }

    if (!token) {
      toast.error('Authentication token missing.')
      return
    }

    dispatch(
      initiateFixedRosTransfer({
        otp,
        transaction_pin: transactionPin,
        amount,
        token,
      }),
    )

    setOpenDialog(false)
  }

  // ✅ Handle success
  useEffect(() => {
    if (success) {
      setSuccessMessageLocal(successMessage || 'Fixed ROS Transfer successful!')
      setOpenSuccessDialog(true)
      setAmount(0)
      setOtp('')
      setTransactionPin('')
      dispatch(fetchUserData())
      dispatch(fetchWalletBalance('FixedRosWallet'))
    }
  }, [success, successMessage, dispatch])

  // ✅ Handle error
  useEffect(() => {
    if (error) {
      let errorMessage = 'Fixed ROS transfer failed'
      if (typeof error === 'string') {
        errorMessage = error
      } else if (typeof error === 'object' && error !== null) {
        if (typeof error.detail === 'string' && error.detail.trim() !== '') {
          errorMessage = error.detail
        } else {
          errorMessage = JSON.stringify(error) || errorMessage
        }
      }
      toast.error(errorMessage)
    }
  }, [error])

  // ✅ OTP success/error handling
  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      dispatch(resetOtpState())
    }
    if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  useEffect(() => {
    dispatch(fetchWalletBalance('FixedRosWallet'))
  }, [dispatch])

  const handleSuccessDialogClose = () => {
    setOpenSuccessDialog(false)
    dispatch(resetRosTransferState()) // ✅ correct reset
    setSuccessMessageLocal(null)
  }

  // ✅ Loading state
  if (otpLoading || loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="pt-5 bg-gradient-to-r from-blue-500 to-purple-700 pb-[20px] px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5 text-white">
          <ArrowRightLeft className="mr-2" /> Transfer Fixed ROS Wallet
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] flex w-fit font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-700 text-white">
            Fixed ROS Wallet Balance:
            <div className="flex items-center ml-1">
              <Image
                src={Logo}
                alt="Logo"
                priority
                width={15}
                height={15}
                className="mr-1"
              />
              {Number(balances?.FixedRosWallet?.total ?? 0).toLocaleString()}
            </div>
          </h2>

          <span className="text-[12px] p-2 rounded-md font-semibold mb-2 w-fit text-black flex items-center">
            Available To Transfer:
            <Image
              src={Logo}
              alt="Logo"
              width={14}
              height={14}
              className="ml-2 mr-1"
            />
            {Number(
              balances?.FixedRosWallet?.max_allowed_to_withdraw ?? 0,
            ).toLocaleString()}
          </span>

          <div className="flex flex-col md:flex-row gap-6 pb-6">
            {/* Image */}
            <div className="md:w-1/3 flex items-center text-center">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            {/* Form */}
            <div
              className="md:w-1/3 w-full flex flex-col items-center p-6 rounded-xl bg-purple-100 shadow-sm border border-gray-200">              <h2 className="text-xl flex items-center gap-1 font-semibold mb-4">
                <Image src={Logo} alt="Logo" className="h-[25px] w-[25px]" />
                Transfer Fixed ROS Wallet
              </h2>

              <TextField
                label="Amount"
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                fullWidth
                margin="normal"
                required
              />

              <Button
                variant="contained"
                onClick={handleStartFixedRos}
                disabled={otpLoading}
                
                className="bg-gradient-to-r from-blue-500 to-purple-700  w-auto"
                sx={{ mt: 2 }}
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/3 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-700 text-center relative">
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-purple-200"></span>
                <span className="relative bg-white px-3">About Fixed ROS Wallet Transfer</span>
              </h3>

              <div className="space-y-3 text-[12px] text-gray-700">
                {[
                  'Ensure the transferee account is correct; wrong transfers are not our responsibility.',
                  'Fixed ROS Wallet can be transferred to your KAIT Wallet or others’ Fixed ROS Wallet.',
                  'Minimum of 500 KAIT required.',
                  '5% Admin Charges apply.',
                ].map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </div>
                    <p>{rule}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ✅ Success Dialog */}
        <Dialog open={openSuccessDialog} onClose={handleSuccessDialogClose}>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 flex flex-col items-center justify-center">
            <div className="bg-white/20 p-2 rounded-full animate-bounce">
              <IoCheckmarkDoneCircleSharp className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center font-semibold text-lg mt-2 !text-white">
              Fixed ROS Wallet Transfer
            </DialogTitle>
          </div>
          <DialogContent className="text-center">
            <p className="text-gray-700 text-2xl leading-relaxed">
              {successMessageLocal}
            </p>
          </DialogContent>
          <DialogActions className="justify-center pb-4">
            <Button
              onClick={handleSuccessDialogClose}
              variant="contained"
              className="!bg-gradient-to-r from-blue-500 to-purple-600 !text-white !rounded-full !px-6 !py-2 hover:opacity-90 transition"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ OTP Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: "28px",
                background: "#efe7f7",
                paddingTop: "10px",
                paddingBottom: "10px",
              },
            },
          }}
        >
          {/* Header */}
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "20px",
              fontWeight: 600,
              paddingX: 4,
              paddingTop: 2,
            }}
          >
            <MdLockOutline size={22} className="flex items-center" />
            Verify Transaction
          </DialogTitle>

          {/* Content */}
          <DialogContent
            sx={{
              paddingX: 4,
              paddingTop: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* OTP FIELD */}
            <div style={{ position: "relative" }}>
              <MdMessage
                size={22}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-10px)",
                  color: "#5e3db5",
                  pointerEvents: "none",
                }}
              />

              <TextField
                fullWidth
                variant="standard"
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                slotProps={{
                  htmlInput: {
                    maxLength: 6,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { paddingLeft: "30px" },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "#5e3db5 !important",
                    fontWeight: 600,
                    marginLeft: "30px",
                  },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#b39ddb",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#5e3db5",
                  },
                }}
              />
            </div>

            {/* PIN FIELD */}
            <div style={{ position: "relative" }}>
              <MdVpnKey
                size={22}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-10px)",
                  color: "#5e3db5",
                  pointerEvents: "none",
                }}
              />

              <TextField
                fullWidth
                variant="standard"
                label="Transaction Password"
                type={showPin ? "text" : "password"}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                slotProps={{
                  htmlInput: {
                    style: { paddingLeft: "30px" },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "#5e3db5 !important",
                    fontWeight: 600,
                    marginLeft: "30px",
                  },
                }}
                sx={{
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#b39ddb",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#5e3db5",
                  },
                }}
              />

              {/* Eye Toggle */}
              <div
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  paddingRight: "6px",
                  color: "#5e3db5",
                }}
              >
                {showPin ? <IoEye size={22} /> : <IoEyeOff size={22} />}
              </div>
            </div>
          </DialogContent>

          {/* Actions */}
          <DialogActions
            sx={{
              paddingX: 4,
              paddingBottom: 2,
              justifyContent: "space-between",
            }}
          >
            <Button
              sx={{
                textTransform: "none",
                fontSize: "16px",
                color: "#333",
              }}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "14px",
                paddingX: "26px",
                paddingY: "6px",
                fontSize: "16px",
                background: "#009688",
              }}
            >
              {loading ? "Processing..." : "Proceed"}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  )
}

export default FixedRosWalletTransfer
