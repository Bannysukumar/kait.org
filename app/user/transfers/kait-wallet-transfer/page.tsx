'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiatekaitTransfer,
  resetTransferState,
} from '@/store/slices/user/kaitTransferSlice'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import {
  fetchTransferEmails,
  clearTransferEmails,
} from '@/store/slices/user/transferSearchSlice'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material'
import Image from 'next/image'
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'
import { IoCheckmarkDoneCircleSharp, IoEye, IoEyeOff } from 'react-icons/io5'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import { MdLockOutline, MdMessage, MdVpnKey } from 'react-icons/md'

const KaitWalletTransfer = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    loading: transferLoading,
    success: transferSuccess,
    error: transferError,
    message: transferMessage,
  } = useAppSelector((state) => state.kaitTransfer)

  const { users: eligibleUsers } = useAppSelector((state) => state.eligibleUsersTransfer)

  // useEffect(() => {
  //   if (eligibleUsers.length > 0 && !selectedUser) {
  //     setSelectedUser(eligibleUsers[0])
  //     setForm((prev) => ({
  //       ...prev,
  //       receiver_user_id: eligibleUsers[0].id,
  //       receiver_user_email: eligibleUsers[0].email,
  //     }))
  //   }
  // }, [eligibleUsers])


  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)



  const { options: transferEmailOptions, loading: transferEmailLoading } =
    useAppSelector((state) => state.transferSearch)

  const {
    balances,
    loading,
    error: adhocerror,
  } = useAppSelector((state) => state.transferBalance)



  // Local states
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [showPin, setShowPin] = useState(false);

  const [form, setForm] = useState({
    receiver_user_id: '',
    receiver_user_email: '',
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const fetchCalledRef = useRef(false)

  useEffect(() => {
    if (token && !fetchCalledRef.current) {
      dispatch(fetchEligibleUsers(token))
      fetchCalledRef.current = true
    }
  }, [token, dispatch])



  useEffect(() => {
    dispatch(fetchWalletBalance('KaitWallet'))
  }, [dispatch])

  const handleStartTransfer = async () => {
    if (!form.receiver_user_id || !form.amount) {
      toast.error('Please fill out recipient and amount')
      return
    }

    const amountNumber = parseFloat(form.amount)
    if (isNaN(amountNumber) || amountNumber < 100) {
      toast.error('Amount should be greater than 100')
      return
    }

    const currentBalance = balances?.KaitWallet?.max_allowed_to_withdraw ?? 0
    if (amountNumber > currentBalance) {
      toast.error(`Insufficient Kait Wallet balance. Max allowed to withdraw is ${currentBalance}`)
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

      await dispatch(transferWalletOtp())
      setOpenDialog(true)
    } catch {
      toast.error('Error checking transfer pin status.')
    }
  }

  // Handle final submit
  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Auth token missing')
      return
    }

    dispatch(
      initiatekaitTransfer({
        ...form,
        amount: parseFloat(form.amount),
        token,
      }),
    )
    setOpenDialog(false)
  }
  const [successMessage, setSuccessMessage] = useState('')
  useEffect(() => {
    if (transferSuccess) {
      toast.success(transferMessage || 'Transfer successful')
      setSuccessMessage(transferMessage || 'Transfer successful')
      setOpenSuccessDialog(true)

      dispatch(resetTransferState())
      setForm({
        receiver_user_id: '',
        receiver_user_email: '',
        amount: '',
        otp: '',
        transaction_pin: '',
      })
      setSelectedUser(null)
    }

    if (transferError) {
      let errorMessage: string

      if (typeof transferError === 'string') {
        errorMessage = transferError
      } else if (
        typeof transferError === 'object' &&
        transferError !== null &&
        'detail' in transferError
      ) {
        errorMessage = transferError.detail || 'An error occurred during transfer.'
      } else {
        errorMessage = 'An error occurred during transfer.'
      }

      toast.error(errorMessage)
      dispatch(resetTransferState())
    }
  }, [transferSuccess, transferError, transferMessage, dispatch])


  // Handle OTP success/error
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

  if (otpLoading || transferLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="pt-5 bg-gradient-to-r from-blue-500 to-purple-700 hover:bg-blue-50 pb-10 transition-colors duration-2000 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Transfer kait Wallet
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Balance */}
          <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold   bg-gradient-to-r from-blue-500 to-purple-700 text-white">
            Kait Wallet Balance:
            <div className=" flex items-center ml-0.5">
              <Image
                src={Logo}
                alt="Logo"
                priority
                width={15}
                height={15}
                className=" mr-0.5"
              />
              <span>
                {Number(balances?.KaitWallet?.total ?? 0).toLocaleString()}
              </span>
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
              balances?.KaitWallet?.max_allowed_to_withdraw ?? 0,
            ).toLocaleString()}
          </span>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Wallet Summary */}
            <div className="md:w-1/3 m-auto">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            {/* Transfer Form */}
            <form onSubmit={handleSubmit} className="w-full md:w-1/3 bg-purple-100 m-auto  p-6 rounded-xl">
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="h-[25px] w-[25px] object-fill rounded-md"
                />{' '}
                Transfer kait Wallet
              </h2>

              {/* <Autocomplete
                value={selectedUser}
                onChange={(event, value) => {
                  setSelectedUser(value)
                  setForm({
                    ...form,
                    receiver_user_id: value?.id || '',
                    receiver_user_email: value?.value?.email || '',
                  })
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue.length >= 5) {
                    dispatch(fetchTransferEmails(newInputValue))
                  } else {
                    dispatch(clearTransferEmails())
                  }
                }}

                options={transferEmailOptions}
                loading={transferEmailLoading}
                getOptionLabel={(option) =>
                  `${option.value?.name || ''} (${option.value?.email || ''})`
                }
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.value?.name}</span>
                      <span className="text-sm text-gray-500">{option.value?.email}</span>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recipient (Search by name or email)"
                    required
                    fullWidth
                  />
                )}
              /> */}

              <Autocomplete
                value={selectedUser}
                onChange={(event, value) => {
                  setSelectedUser(value)
                  setForm({
                    ...form,
                    receiver_user_id: value?.id || '',
                    receiver_user_email: value?.email || '',
                  })
                }}
                options={eligibleUsers} 
                getOptionLabel={(option) => option.email || option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterOptions={(options, state) =>
                  options.filter((user) =>
                    `${user.name} ${user.email}`
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                  )
                }
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-sm text-gray-500">{option.email}</span>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recipient Email"
                    required
                    fullWidth
                    variant="standard"
                    style={{ marginBottom: "15px" ,marginTop:"15px"}}
                    slotProps={{
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
                )}
              />

              <TextField
                fullWidth
                variant="standard"
                label="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
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
                sx={{ mt: 2 }}
                onClick={handleStartTransfer}
                disabled={otpLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-700 w-auto"
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>


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
                  <MdLockOutline className='flex items-center' size={22} />
                  Verify Transaction
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
                        left: 0,
                        top: "50%",
                        transform: "translateY(-10px)", // small offset so it's centered visually
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
                          marginLeft: "30px", // label also moves to align with the icon
                        },
                      }}
                      sx={{
                        "& .MuiInput-underline:before": { borderBottomColor: "#b39ddb" },
                        "& .MuiInput-underline:after": { borderBottomColor: "#5e3db5" },
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
                        "& .MuiInput-underline:before": { borderBottomColor: "#b39ddb" },
                        "& .MuiInput-underline:after": { borderBottomColor: "#5e3db5" },
                      }}
                    />

                    {/* EYE BUTTON */}
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
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      textTransform: "none",
                      borderRadius: "14px",
                      paddingX: "26px",
                      paddingY: "6px",
                      fontSize: "16px",
                      background: "#009688",
                    }}
                  >
                    {transferLoading ? "Processing..." : "Proceed"}
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
                  Kait Wallet Transfer
                </DialogTitle>
              </div>

              {/* Content */}
              <DialogContent className=" text-center">
                <p className="text-gray-700 text-2xl dark:text-gray-300  leading-relaxed">
                  {successMessage}
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


            {/* Transfer Rules */}
            <div className="w-full md:w-1/3 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-700 text-center relative">
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-purple-200"></span>
                <span className="relative bg-white px-3">About KAIT Wallet Transfer</span>
              </h3>

              <div className="space-y-3 text-[10px] text-gray-700">
                {[
                  'Ensure receiver’s email is correct; we are not liable for incorrect transfers.',
                  'Only downline transfers are allowed — no cross-line transfers.',
                  '1st level recipients allowed by default.',
                  '2nd level allowed if you have 2 paid directs.',
                  '3rd level allowed if you have 3 paid directs.',
                  '4th level+ allowed only if you are Bronze.',
                  'kait Wallet can be transferred to your KAIT wallet or others’ kait wallet.',
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

export default KaitWalletTransfer
