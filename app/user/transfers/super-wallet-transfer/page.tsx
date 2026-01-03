'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initiateUplineDownlineTransfer,
  initiateSelfTransfer,
  resetTransferState,
} from '@/store/slices/user/superWalletTransferSlice'
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
  MenuItem,
  Autocomplete,
} from '@mui/material'
import { ArrowRightLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import WalletImage from '../../../../assets/fiatwallet.jpg'
import Logo from '../../../../assets/logo2x.png'
import { fetchUserData } from '@/store/slices/user/userTreeDataReducer'
import { fetchWalletBalance } from '@/store/slices/user/TransferBalanceSlice'
import {
  fetchTransferEmails,
  clearTransferEmails,
} from '@/store/slices/user/transferSearchSlice'
import { IoCheckmarkDoneCircleSharp, IoEye, IoEyeOff } from 'react-icons/io5'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import { MdLockOutline, MdMessage, MdVpnKey } from 'react-icons/md'


const SuperWalletTransfer = () => {
  const dispatch = useAppDispatch()

  const { users: eligibleUsers } = useAppSelector(
    (state) => state.eligibleUsersTransfer,
  )

  const { loading, success, error, message } = useAppSelector(
    (state: any) => state.SuperWalletTransfer,
  )
  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const {
    balances,
    loading: balanceLoading,
    error: adhocerror,
  } = useAppSelector((state) => state.transferBalance)

  useEffect(() => {
    dispatch(fetchWalletBalance('SuperWallet'))
  }, [dispatch])

  const {
    options: transferEmailOptions,
    loading: transferEmailLoading,
  } = useAppSelector((state) => state.transferSearch)


  const [wallet, setWallet] = useState<
    'AdhocWallet' | 'IncomeWallet' | 'SuperWallet'
  >('SuperWallet')

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

  const [successMessageLocal, setSuccessMessageLocal] = useState<string | null>(null)

  useEffect(() => {
    if (success && message) {
      toast.success(message)

      setSuccessMessageLocal(message)

      setOpenSuccessDialog(true)
      resetForm()
      dispatch(resetTransferState())
    } else if (error) {
      const errMsg =
        typeof error === 'string'
          ? error
          : error?.detail || 'Transfer failed. Try again.'
      toast.error(errMsg)
      dispatch(resetTransferState())
    }
  }, [success, error, message, dispatch])




  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      dispatch(resetOtpState())
    } else if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  const resetForm = () => {
    setWallet('SuperWallet')
    setSelectedUser(null)
    setForm({
      receiver_user_id: '',
      receiver_user_email: '',
      amount: '',
      otp: '',
      transaction_pin: '',
    })
  }

  const handleStartTransfer = async () => {
    const amount = parseFloat(form.amount);

    if (isNaN(amount) || amount < 250) {
      toast.error('Amount must be greater than or equal to 250');
      return;
    }

    const maxWithdraw = balances?.SuperWallet?.max_allowed_to_withdraw ?? 0;

    if (amount > maxWithdraw) {
      toast.error(
        `Insufficient Super Wallet balance. Max allowed to withdraw is ${maxWithdraw.toLocaleString()}`
      );
      return;
    }

    if (
      wallet === 'SuperWallet' &&
      (!form.receiver_user_id || !form.receiver_user_email)
    ) {
      toast.error('Please select a valid recipient');
      return;
    }

    try {
      await dispatch(transferWalletOtp());
      setOpenDialog(true);
    } catch {
      toast.error('OTP sending failed');
    }
  };


  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault()

    const { otp, transaction_pin, amount, receiver_user_id } = form
    if (
      !otp ||
      otp.length < 4 ||
      !transaction_pin ||
      transaction_pin.length < 4
    ) {
      toast.error('Enter valid OTP and Transaction PIN')
      return
    }

    const parsedAmount = parseFloat(amount)

    if (wallet === 'SuperWallet') {
      dispatch(
        initiateUplineDownlineTransfer({
          otp,
          transaction_pin,
          receiver_user_id,
          amount: parsedAmount,
        }),
      )
    } else {
      dispatch(
        initiateSelfTransfer({
          otp,
          transaction_pin,
          wallet,
          amount: parsedAmount,
        }),
      )
    }

    setOpenDialog(false)
  }

  const fetchCalledRef = useRef(false)

  useEffect(() => {
    if (token && !fetchCalledRef.current) {
      dispatch(fetchEligibleUsers(token))
      fetchCalledRef.current = true
    }
  }, [token, dispatch])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="pt-5 bg-gradient-to-r from-blue-500 to-purple-700 hover:bg-blue-50 pb-10 transition-colors duration-2000 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container m-auto">
        <h1 className="flex items-center text-2xl font-bold mb-6 mt-5">
          <ArrowRightLeft className="mr-2" /> Super Wallet Transfer
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg p-2 rounded-[10px] flex  w-fit font-semibold mb-2  bg-gradient-to-r from-blue-500 to-purple-700 text-white">
            Super Wallet Balance:
            <div className=" flex items-center ml-0.5">
              <Image
                src={Logo}
                alt="Logo"
                priority
                width={15}
                height={15}
                className=" mr-0.5"
              />
              {Number(balances?.SuperWallet?.total ?? 0).toLocaleString()}
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
              balances?.SuperWallet?.max_allowed_to_withdraw ?? 0,
            ).toLocaleString()}
          </span>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Image
                src={WalletImage}
                alt="Wallet"
                className="rounded-md h-[300px] w-full object-fill"
              />
            </div>

            <form
              onSubmit={handleConfirmTransfer}
              className="w-full md:w-1/3 space-y-4 bg-purple-100  p-6 rounded-xl"
            >
              <h2 className="text-xl flex items-center gap-2 font-semibold mb-4">
                <Image src={Logo} alt="Logo" width={25} height={25} />
                Transfer Super Wallet
              </h2>

              <TextField
                label="Wallet Type"
                select
                fullWidth
                value={wallet}
                onChange={(e) =>
                  setWallet(
                    e.target.value as
                    // | 'AdhocWallet'
                    // | 'IncomeWallet'
                    | 'SuperWallet',
                  )
                }
                style={{ marginBottom: '15px' }}
                variant="standard"
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
              >
                {/* <MenuItem value="AdhocWallet">My Adhoc Wallet</MenuItem>
                <MenuItem value="IncomeWallet">My Income Wallet</MenuItem> */}
                <MenuItem value="SuperWallet">Others Super Wallet</MenuItem>
              </TextField>


              {/* {wallet === 'SuperWallet' && (
                <Autocomplete
                  value={selectedUser}
                  onChange={(e, value) => {
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
                />
              )} */}


              {wallet === 'SuperWallet' && (
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
                      `${user.name} ${user.email}`.toLowerCase().includes(state.inputValue.toLowerCase())
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
                      style={{ marginBottom: '15px' }}
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
              )}

              <TextField
                fullWidth
                variant="standard"
                label="Amount"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                style={{ marginBottom: '15px' }}
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
                
                className='bg-gradient-to-r from-blue-500 to-purple-700 w-auto'
              >
                {otpLoading ? 'Sending OTP...' : 'Proceed to Transfer'}
              </Button>
            </form>

            {/* Right Section Info */}
            <div className="w-full md:w-1/3 p-4 rounded-xl bg-white shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-700 text-center relative">
                <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-purple-200"></span>
                <span className="relative bg-white px-3">Super Wallet Transfer Info</span>
              </h3>

              <div className="space-y-3 text-[12px] text-gray-700">
                {[
                  'Minimum amount is 250.',
                  'Transaction PIN required to proceed.',
                  // 'Downline transfers only when selecting others.',
                  // 'Cross-level restrictions may apply.',
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
            Super Wallet Transfer
          </DialogTitle>
        </div>

        {/* Content */}
        <DialogContent className=" text-center">
          <p className="text-gray-700 text-2xl dark:text-gray-300  leading-relaxed">
            {successMessageLocal || 'Transfer successful'}
          </p>

        </DialogContent>

        {/* Actions */}
        <DialogActions className="justify-center pb-4">
          <Button
            onClick={() => {
              setOpenSuccessDialog(false)
              setSuccessMessageLocal(null) // ✅ Clear local message on close
            }}
            variant="contained"
            className="!bg-gradient-to-r from-blue-500 to-purple-600 !text-white !rounded-full !px-6 !py-2 hover:opacity-90 transition"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTP + PIN Dialog */}
      {/* OTP + PIN Dialog */}
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
              required
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
                "& .MuiInput-underline:before": { borderBottomColor: "#b39ddb" },
                "& .MuiInput-underline:after": { borderBottomColor: "#5e3db5" },
              }}
            />
          </div>

          {/* TRANSACTION PIN FIELD */}
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
              label="Transaction PIN"
              name="transaction_pin"
              type={showPin ? "text" : "password"}
              value={form.transaction_pin}
              onChange={handleChange}
              required
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

            {/* Eye toggle */}
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
            onClick={handleConfirmTransfer}
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
  )
}

export default SuperWalletTransfer




