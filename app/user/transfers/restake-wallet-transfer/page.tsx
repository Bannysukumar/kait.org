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
  initiateRestake,
  resetRestakeState,
} from '@/store/slices/user/restakeTransferSlice'
import {
  resetOtpState,
  transferWalletOtp,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'
import Image from 'next/image'
import { ArrowRightLeft } from 'lucide-react'
import Logo from '../../../../assets/logo2x.png'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'
import { MdLockOutline, MdMessage, MdVpnKey } from 'react-icons/md'

const RestakeWalletTransfer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { loading, success, successMessage, error } = useAppSelector(
    (state) => state.restaketransfer,
  )

  const {
    success: otpSuccess,
    error: otpError,
    loading: otpLoading,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const {
    balances,
    loading: balanceloading,
    error: adhocerror,
  } = useAppSelector((state) => state.transferBalance)

  useEffect(() => {
    dispatch(fetchWalletBalance('ReStakeWallet'))
  }, [dispatch])

  const [amount, setAmount] = useState<number>(0)
  const [otp, setOtp] = useState('')
  const [transactionPin, setTransactionPin] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [showPin, setShowPin] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleStartRestake = async () => {
    if (!amount || amount < 250) {
      toast.error('Amount should be greater than 250')
      return
    }

    const availableBalance = balances?.ReStakeWallet?.max_allowed_to_withdraw ?? 0

    if (amount > availableBalance) {
      toast.error(
        `Insufficient Restake Wallet balance. Max allowed to withdraw is ${availableBalance.toLocaleString()}`,
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
    } catch (error) {
      toast.error('Failed to check pin status')
    }
  }


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
      initiateRestake({ otp, transaction_pin: transactionPin, amount, token }),
    )
    setOpenDialog(false)
  }

  useEffect(() => {
    if (error && typeof error === 'string' && error.trim()) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      toast.success('Transation success!')
      setOpenSuccessDialog(true)
    }
  }, [success])

  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetRestakeState()), 3000)
    }
  }, [success, error, dispatch])

  useEffect(() => {
    if (error) {
      const message =
        typeof error === 'string'
          ? error
          : (error as any)?.detail || JSON.stringify(error)
      toast.error(message)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      toast.success(successMessage || 'Restake transfer is successful')
      setOpenSuccessDialog(true)
    }
  }, [success, successMessage])


  // Reset state after success or error
  useEffect(() => {
    if (success || error) {
      setTimeout(() => dispatch(resetRestakeState()), 3000)
    }
  }, [success, error, dispatch])

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

  if (otpLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }
  return (
    <div className="pt-5 bg-gradient-to-r from-blue-500 to-purple-700 pb-[20px] transition-colors duration-2000 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Restake Wallet
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold mb-2  bg-gradient-to-r from-blue-500 to-purple-700 text-white">
            Restake Wallet Balance:
            <div className=" flex items-center ml-0.5">
              <Image
                src={Logo}
                alt="Logo"
                priority
                width={15}
                height={15}
                className=" mr-0.5"
              />
              {Number(balances?.ReStakeWallet?.total ?? 0).toLocaleString()}
            </div>
          </h2>
          <span className="text-[12px] p-2 rounded-md font-semibold mb-2 w-fit  text-black flex items-center">
            Available To Transfer:
            <Image
              src={Logo}
              alt="Logo"
              width={14}
              height={14}
              className="ml-2 mr-1"
            />
            {Number(
              balances?.ReStakeWallet?.max_allowed_to_withdraw ?? 0,
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
            <div className="w-full md:w-1/3 flex flex-col justify-center items-center bg-purple-100  p-6 rounded-xl">
              <h2 className="text-xl flex items-center gap-1 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="rounded-md h-[25px] w-[25px] object-fill"
                />
                Transfer Restake Wallet
              </h2>

              <TextField
                label="Amount"
                // type="number"
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                fullWidth
                margin="normal"
                required
              />

              <Button
                type="button"
                variant="contained"
                onClick={handleStartRestake}
                disabled={otpLoading}
                fullWidth
                sx={{ mt: 2 }}
                className='bg-gradient-to-r from-blue-500 to-purple-700'
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>
            </div>

            <Dialog
              open={openSuccessDialog}
              onClose={() => setOpenSuccessDialog(false)}
              maxWidth="xs"
              fullWidth
              slotProps={{
                paper: {
                  className:
                    'rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700',
                },
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 flex flex-col items-center justify-center">
                <div className="bg-white/20 p-2 rounded-full animate-bounce">
                  <IoCheckmarkDoneCircleSharp className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-center font-semibold text-lg mt-2 !text-white">
                  Restake Wallet Transfer
                </DialogTitle>
              </div>

              {/* Content */}
              <DialogContent className="text-center">
                <p className="text-gray-700 text-2xl dark:text-gray-300 leading-relaxed">
                  {successMessage || 'Restake transfer successful'}
                </p>
              </DialogContent>


              {/* Actions */}
              <DialogActions className="justify-center pb-4">
                <Button
                  onClick={() => setOpenSuccessDialog(false)}
                  variant="contained"
                  className="!bg-gradient-to-r from-blue-500 to-purple-600 !text-white !rounded-full !px-6 !py-2 hover:opacity-90 transition"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>


            {/* Info Section */}
            <div className="w-full md:w-1/3 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-700 text-center relative">
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-purple-200"></span>
                <span className="relative bg-white px-3">About Restake Wallet Transfer</span>
              </h3>

              <div className="space-y-3 text-[12px] text-gray-700">
                {[
                  'Make Sure the email id of transferee is correct and right, we are not responsible for wrong Transfer',
                  'Transfer is only happened to your Downline, no Cross line',
                  'Restake Wallet can be transferred either to your KAIT Wallet or Others Restake Wallet',
                  'Minimum of 500 KAIT to be transferable...',
                  '2% for Admin Charges',
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

        {/* OTP Modal */}
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
            <MdLockOutline size={22} />
            Confirm Restake
          </DialogTitle>

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
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: 0,
                  color: "#5e3db5",
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
                    style: { paddingLeft: "32px" },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    paddingLeft: "32px",
                    "&.Mui-focused": { paddingLeft: "32px" },
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
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: 0,
                  color: "#5e3db5",
                }}
              />

              <TextField
                fullWidth
                variant="standard"
                label="Transaction PIN"
                type="password"
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                slotProps={{
                  htmlInput: { paddingLeft: "32px" },
                }}
                InputLabelProps={{
                  sx: {
                    paddingLeft: "32px",
                    "&.Mui-focused": { paddingLeft: "32px" },
                  },
                }}
              />
            </div>

            {/* OTP Messages */}
            {otpSuccess && (
              <Typography color="success.main" sx={{ mt: -2 }}>
                OTP sent successfully!
              </Typography>
            )}
            {otpError && (
              <Typography color="error.main" sx={{ mt: -2 }}>
                {otpError}
              </Typography>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              paddingX: 4,
              paddingBottom: 2,
              justifyContent: "space-between",
            }}
          >
            <Button
              sx={{ textTransform: "none", fontSize: "16px", color: "#333" }}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              className="bg-gradient-to-r from-blue-500 to-purple-700"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "14px",
                paddingX: "26px",
                paddingY: "6px",
                fontSize: "16px",
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

export default RestakeWalletTransfer
