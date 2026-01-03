'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateTransferAdhocToSuper,
  resetTransferState,
} from '@/store/slices/user/adhocToSuperTransferSlice'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'

import Image from 'next/image'
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from '@/assets/logo2x.png'
import FiatWalletImg from '@/assets/fiatwallet.jpg'
import { useRouter } from 'next/navigation'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'
import { IoCheckmarkDoneCircleSharp, IoEye, IoEyeOff } from "react-icons/io5";
import { MdLockOutline, MdMessage, MdVpnKey } from 'react-icons/md'

const AdhocToSuperTransferForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { loading: transferLoading, success, error, message } = useAppSelector(
    (state) => state.AdhocToSuperTranfer
  )

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const {
    balances,
    loading,
    error: adhocerror,
  } = useAppSelector((state) => state.transferBalance)

  const [openDialog, setOpenDialog] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [successMessageLocal, setSuccessMessageLocal] = useState<string | null>(null)
  const [showPin, setShowPin] = useState(false);

  const [form, setForm] = useState({
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRequestOtp = async () => {
    const amountNumber = parseFloat(form.amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }
    const maxWithdraw = balances?.AdhocWallet?.max_allowed_to_withdraw ?? 0
    if (amountNumber > maxWithdraw) {
      toast.error(`Insufficient Adhoc Wallet balance. Max allowed to withdraw is ${maxWithdraw.toLocaleString()}`)
      return
    }

    if (!token) {
      toast.error('Authentication token missing')
      return
    }

    try {
      const actionResult = await dispatch(fetchTransferPinStatus(token))
      const pinStatus = unwrapResult(actionResult)

      if (!pinStatus) {
        toast.error('Set your transaction password before transferring.')
        router.push('/user/profile?tab=TRANS.PWD')
        return
      }

      await dispatch(transferWalletOtp()).unwrap()
      toast.success('OTP sent successfully')
      setOpenDialog(true)
    } catch (err) {
      toast.error('Failed to check PIN status or send OTP')
    }
  }

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    dispatch(
      initiateTransferAdhocToSuper({
        otp: form.otp,
        transaction_pin: form.transaction_pin,
        amount: parseFloat(form.amount),
      }),
    )
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setForm({ ...form, otp: '', transaction_pin: '' })
  }

  useEffect(() => {
    dispatch(fetchWalletBalance('AdhocWallet'))
  }, [dispatch])

  useEffect(() => {
    if (success && message) {
      setSuccessMessageLocal(message)
      setOpenSuccessDialog(true)
      handleCloseDialog()
      setForm({ amount: '', otp: '', transaction_pin: '' })
      dispatch(resetTransferState())
      dispatch(resetOtpState())
    }

    if (error) {
      toast.error(typeof error === 'string' ? error : 'Transfer failed')
      dispatch(resetTransferState())
    }

    if (otpError) {
      toast.error(typeof otpError === 'string' ? otpError : 'OTP Error')
      dispatch(resetOtpState())
    }
  }, [success, error, otpError, message, dispatch])



  if (otpLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="pt-5 bg-gradient-to-r from-blue-500 to-purple-700 pb-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer Adhoc Wallet
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-md font-semibold w-fit bg-gradient-to-r from-blue-500 to-purple-700 text-white flex items-center">
            Adhoc Wallet Balance:
            <Image
              src={Logo}
              alt="Logo"
              width={20}
              height={20}
              className="ml-2 mr-1"
            />
            {Number(balances?.AdhocWallet?.total ?? 0).toLocaleString()}
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
              balances?.AdhocWallet?.max_allowed_to_withdraw ?? 0,
            ).toLocaleString()}
          </span>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Wallet Image */}
            <div className="md:w-1/3">
              <Image
                src={FiatWalletImg}
                alt="Wallet Preview"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            {/* Transfer Form */}
            <form
              onSubmit={handleSubmit}
              className="md:w-1/3 w-full flex flex-col items-center p-6 rounded-xl bg-purple-100 shadow-sm border border-gray-200"
            >
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="h-[25px] w-[25px] object-fill rounded-md"
                />
                Transfer Adhoc Wallet
              </h2>

              <TextField
                label="Mode of Transfer"
                value="Super Wallet"
                fullWidth
                disabled
                style={{ marginBottom: '15px' }}
                onChange={handleChange}
                variant="standard"
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                  inputLabel: {
                    sx: {
                      color: "#5e3db5 !important",
                      fontWeight: 600,
                    },
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

              <TextField
                fullWidth
                variant="standard"
                label="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                style={{ marginBottom: "15px" }}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { paddingLeft: "0px" },
                  },
                  inputLabel: {
                    sx: {
                      color: "#5e3db5 !important",
                      fontWeight: 600,
                    },
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


              <Button
                type="button"
                variant="contained"
                onClick={handleRequestOtp}
                disabled={otpLoading}
                fullWidth
                className="bg-gradient-to-r from-blue-500 to-purple-700 w-auto"
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>


              {/* OTP Modal */}
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
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
                {/* Title */}
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
                  <MdLockOutline size={22} className='flex items-center' />
                  Verify Transaction
                </DialogTitle>

                {/* CONTENT */}
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
                      name="otp"
                      value={form.otp}
                      onChange={handleChange}
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

                  {/* PASSWORD FIELD */}
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
                      name="transaction_pin"
                      type={showPin ? "text" : "password"}
                      value={form.transaction_pin}
                      onChange={handleChange}
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

                    {/* EYE ICON */}
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

                {/* ACTION BUTTONS */}
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
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={transferLoading}
                    sx={{
                      textTransform: "none",
                      borderRadius: "14px",
                      paddingX: "26px",
                      paddingY: "6px",
                      fontSize: "16px",
                      background: "#009688",
                    }}
                  >
                    {transferLoading ? "Processing..." : "Process"}
                  </Button>
                </DialogActions>
              </Dialog>

            </form>


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
                  Adhoc Wallet Transfer
                </DialogTitle>
              </div>

              {/* Content */}
              <DialogContent className=" text-center">
                <p className="text-gray-700 text-2xl dark:text-gray-300 leading-relaxed">
                  {successMessageLocal || 'Transfer completed successfully.'}
                </p>
              </DialogContent>


              {/* Actions */}
              <DialogActions className="justify-center pb-4">
                <Button
                  onClick={() => {
                    setOpenSuccessDialog(false)
                    setSuccessMessageLocal(null)
                    dispatch(resetTransferState())
                    dispatch(resetOtpState())
                  }}
                  variant="contained"
                  className="!bg-gradient-to-r from-blue-500 to-purple-600 !text-white !rounded-full !px-6 !py-2 hover:opacity-90 transition"
                >
                  Close
                </Button>


              </DialogActions>
            </Dialog>

            {/* Transfer Rules */}
            <div className="w-full md:w-1/3 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-center mb-4 text-purple-700 relative">
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-purple-200"></span>
                <span className="relative bg-white px-3">Important Info</span>
              </h3>

              <div className="space-y-3 text-[12px] text-gray-700">
                {[
                  'Adhoc Wallet can be transferred to your Super Wallet.',
                  'Maintain a minimum of 0 in your Adhoc Wallet, above which can be transferred.',
                  '2% Admin Charges',
                  'You can only transfer to your own Super Wallet.',
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
      </div>
    </div>
  )
}

export default AdhocToSuperTransferForm