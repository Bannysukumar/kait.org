'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateFiatTransfer,
  resetTransferState,
} from '@/store/slices/user/fiatWalletTransfer'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import { fetchTransferPinStatus } from '@/store/slices/user/transferPinStatusSlice'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

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
import { ArrowRightLeft } from 'lucide-react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Logo from '../../../../assets/logo2x.png'
import FiatWalletImg from '../../../../assets/fiatwallet.jpg'
import { RootState } from '@/store/store'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'

const FiatTransferForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    loading: transferLoading,
    success: transferSuccess,
    error: transferError,
    message: transferMessage,
  } = useAppSelector((state) => state.fiattransfer)

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const {
    balances,
    loading,
    error: matureerror,
  } = useAppSelector((state) => state.transferBalance)
  useEffect(() => {
    dispatch(fetchWalletBalance('FiatWallet'))
  }, [dispatch])

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  const [openDialog, setOpenDialog] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [form, setForm] = useState({
    transfer_mode: '',
    amount: '',
    otp: '',
    transaction_pin: '',
  })

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleStartTransfer = async () => {
    if (!form.transfer_mode || !form.amount) {
      toast.error('Please select transfer mode and amount')
      return
    }

    const amountNumber = parseFloat(form.amount)
    if (isNaN(amountNumber) || amountNumber <= 250) {
      toast.error('Amount should be greater than 250')
      return
    }

    const currentBalance = balances?.FiatWallet?.max_allowed_to_withdraw ?? 0

    if (amountNumber > currentBalance) {
      toast.error(
        `Insufficient Fiat Wallet balance. Max allowed to withdraw is ${currentBalance.toLocaleString()}`,
      )
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


  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Auth token missing')
      return
    }

    dispatch(
      initiateFiatTransfer({
        ...form,
        amount: parseFloat(form.amount),
        token,
      }),
    )
    setOpenDialog(false)
  }

  useEffect(() => {
    if (token) {
      dispatch(fetchEligibleUsers(token))
      dispatch(fetchDropdownOptions())
    }
  }, [token, dispatch])

  useEffect(() => {
    if (transferSuccess) {
      setSuccessMessage(transferMessage || 'Transfer completed successfully')
      setOpenSuccessDialog(true)
    }

    if (transferError) {
      const errorMessage =
        typeof transferError === 'string'
          ? transferError
          : transferError?.detail || 'An error occurred during transfer.'

      toast.error(errorMessage)
      dispatch(resetTransferState())
    }
  }, [transferSuccess, transferError, transferMessage, dispatch])



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
          <ArrowRightLeft className="mr-2" /> Transfer Maturity Wallet
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold   bg-gradient-to-r from-blue-500 to-purple-700 text-white">
            Maturity Wallet Balance:
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
                {Number(balances?.FiatWallet?.total ?? 0).toLocaleString()}
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
              balances?.FiatWallet?.max_allowed_to_withdraw ?? 0,
            ).toLocaleString()}
          </span>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image
                src={FiatWalletImg}
                alt="Fiat Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            <form onSubmit={handleSubmit} className="w-full md:w-1/3 bg-purple-100  p-6 rounded-xl">
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="h-[25px] w-[25px] object-fill rounded-md"
                />{' '}
                Transfer Mature Wallet
              </h2>

              <Autocomplete
                options={dropDownOptions?.fiat_transfer_options || []}
                getOptionLabel={(option) => String(option.value)}
                onChange={(e, value) =>
                  setForm({ ...form, transfer_mode: value?.id || '' })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Transfer Mode"
                    required
                    fullWidth
                    variant="standard"
                    style={{ marginBottom: "15px" }}

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
                className='bg-gradient-to-r from-blue-500 to-purple-700 w-auto m-auto'
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>

              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Transfer</DialogTitle>
                <DialogContent>
                  <TextField
                    label="OTP"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Transaction Pin"
                    name="transaction_pin"
                    type="password"
                    value={form.transaction_pin}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)} color="inherit">
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    // color="primary"
                    onClick={handleSubmit}
                    disabled={transferLoading}
                    className='bg-gradient-to-r from-blue-500 to-purple-700'
                  >
                    {transferLoading ? 'Processing...' : 'Process the Transfer'}
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
                  Mature Wallet Transfer
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
                  onClick={() => {
                    setOpenSuccessDialog(false)
                    dispatch(resetTransferState())
                    setForm({
                      transfer_mode: '',
                      amount: '',
                      otp: '',
                      transaction_pin: '',
                    })
                  }}
                  variant="contained"
                  className="!bg-gradient-to-r from-blue-500 to-purple-600 !text-white !rounded-full !px-6 !py-2 hover:opacity-90 transition"
                >
                  Close
                </Button>

              </DialogActions>
            </Dialog>


            <div className="w-full md:w-1/3 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-700 text-center relative">
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-purple-200"></span>
                <span className="relative px-2 bg-white">About Fiat Wallet Transfer</span>
              </h3>

              <div className="space-y-3 text-[12px] text-gray-700">
                {[
                  'Ensure receiver’s email is correct; we are not liable for incorrect transfers.',
                  'Only downline transfers are allowed — no cross-line transfers.',
                  'Fiat Wallet can be transferred to your KAIT wallet or others’ Fiat wallet.',
                  '10% deduction applies (2% admin + 8% leadership).',
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

export default FiatTransferForm

