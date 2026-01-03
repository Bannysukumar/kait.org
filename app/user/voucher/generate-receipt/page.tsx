'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchVoucherBalance } from '@/store/slices/user/voucher/voucherBalanceSlice'
import {
  generateVoucher,
  resetGenerateVoucherState,
} from '@/store/slices/user/voucher/voucherGenerateSlice'
import {
  transferWalletOtp,
  resetOtpState,
} from '@/store/slices/user/TransferWalletOtpSlice'
import { fetchVoucherReceiptSummary } from '@/store/slices/user/voucher/voucherSummarySlice'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Logo from '@/assets/logo2x.png'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ClipboardCopy, CreditCard, ReceiptIndianRupee, Send } from 'lucide-react'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export default function VoucherPage() {
  const dispatch = useAppDispatch()

  const [amount, setAmount] = useState('')
  const [otp, setOtp] = useState('')
  const [transactionPin, setTransactionPin] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [voucherKind, setVoucherKind] = useState("")
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [copied, setCopied] = useState<string | null>(null)

  const { balance, loading: balanceLoading } = useAppSelector(
    (state) => state.VoucherBalance,
  )
  const {
    loading: generating,
    success,
    error,
    message,
  } = useAppSelector((state) => state.generateVoucher)

  const {
    loading: otpLoading,
    success: otpSuccess,
    error: otpError,
  } = useAppSelector((state) => state.TranferwalletOpt)

  const wallethandleCopy = (textToCopy: string) => {
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(textToCopy)
      setTimeout(() => setCopied(null), 2000)
    })
  }
  const {
    items,
    total,
    loading: summaryLoading,
  } = useAppSelector((state) => state.voucherSummary)

  const {
    data: dropdowns,
    loading: dropdownLoading,
  } = useSelector((state: RootState) => state.dropDownOptions)

  useEffect(() => {
    if (!dropdowns && !dropdownLoading) {
      dispatch(fetchDropdownOptions())
    }
  }, [dispatch, dropdowns, dropdownLoading])

  useEffect(() => {
    if (dropdowns?.voucher_kinds?.length && !voucherKind) {
      setVoucherKind(String(dropdowns.voucher_kinds[0].value))
    }
  }, [dropdowns, voucherKind])

  useEffect(() => {
    if (voucherKind) {
      dispatch(fetchVoucherBalance(voucherKind))
    }
  }, [dispatch, voucherKind])

  useEffect(() => {
    dispatch(
      fetchVoucherReceiptSummary({
        page: page + 1,
        page_size: rowsPerPage,
        voucher_kind: voucherKind,
      }),
    )
  }, [dispatch, page, rowsPerPage, voucherKind])

  useEffect(() => {
    if (otpSuccess) {
      toast.success('OTP sent successfully')
      setDialogOpen(true)
      dispatch(resetOtpState())
    }
    if (otpError) {
      toast.error(otpError)
      dispatch(resetOtpState())
    }
  }, [otpSuccess, otpError, dispatch])

  // Voucher generation effect
  useEffect(() => {
    if (success) {
      setSuccessMessage(message || 'Voucher generated successfully')
      setSuccessDialogOpen(true)
      setDialogOpen(false)

      setOtp('')
      setTransactionPin('')
      setAmount('')

      dispatch(fetchVoucherBalance(voucherKind))
      dispatch(
        fetchVoucherReceiptSummary({
          page: page + 1,
          page_size: rowsPerPage,
          voucher_kind: voucherKind,
        }),
      )
    }

    if (error) {
      if (typeof error === 'string') {
        toast.error(error)
      } else {
        toast.error('An unknown error occurred')
      }

      setOtp('')
      setTransactionPin('')
      setAmount('')
    }

    return () => {
      dispatch(resetGenerateVoucherState())
    }
  }, [success, error, message, dispatch, page, rowsPerPage, voucherKind])



  const handleSendOtp = () => {
    const amountValue = Number(amount)
    if (!amount || isNaN(amountValue) || amountValue <= 100) {
      toast.error('Amount must be more than 100')
      return
    }

    const currentBalance = balance?.max_allowed_voucher_limit ?? 0
    if (balance && amountValue > balance.max_allowed_voucher_limit) {
      toast.error(`Insufficient Kait Wallet balance. Max allowed: ${currentBalance}`)
      return
    }

    dispatch(transferWalletOtp())
  }

  const handleConfirm = () => {
    if (!otp.trim() || !transactionPin.trim()) {
      toast.error('Please fill all fields')
      return
    }

    dispatch(
      generateVoucher({
        otp,
        transaction_pin: transactionPin,
        amount: Number(amount),
        voucher_kind: voucherKind,
      }),
    )
  }
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }
  // if (!voucherKind) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
  //     </div>
  //   )
  // }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voucher Generator */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-700 rounded-xl">
              <ReceiptIndianRupee className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Voucher Generator</h2>
          </div>

          {/* Voucher Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Voucher Type</label>
            <select
              value={voucherKind}
              onChange={(e) => setVoucherKind(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
              disabled={dropdownLoading}
            >
              {dropdownLoading ? (
                <option>Loading...</option>
              ) : (
                dropdowns?.voucher_kinds?.map((option: any) => (
                  <option key={option.id} value={String(option.value)}>
                    {option.label ?? option.value}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-700 text-white p-6 rounded-2xl mb-6 shadow-lg">
            {balanceLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-white/30 rounded"></div>
                    <div className="h-4 w-32 bg-white/30 rounded"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <ReceiptIndianRupee size={32} />
                <div>
                  <p className="text-sm opacity-90">Total Voucher Wallet | Generated</p>
                  <div className="flex items-center space-x-2">
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    <span className="text-xl font-bold">{balance?.max_allowed_voucher_limit}</span>
                    <span>|</span>
                    <Image src={Logo} alt="Logo" width={20} height={20} />
                    <span className="text-xl font-bold">{balance?.voucher_generated}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
              placeholder="Enter amount"
            />
          </div>

          {/* Send OTP Button */}
          <button
            onClick={handleSendOtp}
            disabled={otpLoading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
          >
            {otpLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <Send size={20} />
            )}
            <span>{otpLoading ? 'Sending OTP...' : 'Process Request'}</span>
          </button>

          {/* KAIT Price */}
          <div className="mt-6 text-center">
            <div className="inline-block px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold">
              KAIT Current Price: {balance?.kait_value}
            </div>
          </div>
        </div>

        {/* Voucher Summary */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-700 rounded-xl">
              <CreditCard className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Voucher Summary</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Voucher</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">PIN</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Coin</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Redeemed</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summaryLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : items.length > 0 ? (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-purple-50 transition-all">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span>{item.voucher}</span>
                          <button
                            onClick={() => wallethandleCopy(item.voucher || '')}
                            className="flex items-center px-2 py-1  text-black rounded hover:bg-gray-200 transition-colors duration-200"
                            title="Copy Wallet Address"
                          >
                            <ClipboardCopy size={20} />
                          </button>
                        </div>

                        {copied === item.voucher && (
                          <div className="text-xs text-green-600 mt-2 text-center">
                            Copied!
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-900">{item.pin}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.balance_amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.coin}</td>
                      <td className="px-4 py-3 text-sm">
                        {item.is_redeemed ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-red-600 font-semibold">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No voucher transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, total)} of {total} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronsLeft size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                  {page + 1}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= Math.ceil(total / rowsPerPage) - 1}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(Math.ceil(total / rowsPerPage) - 1)}
                  disabled={page >= Math.ceil(total / rowsPerPage) - 1}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronsRight size={20} />
                </button>
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  className="ml-4 px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div >



      {/* OTP Dialog */}
      < Dialog open={dialogOpen} onClose={() => setDialogOpen(false)
      }>
        <DialogTitle>Enter OTP and PIN</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Transaction PIN"
            type="password"
            value={transactionPin}
            onChange={(e) => setTransactionPin(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={generating}
            className="bg-gradient-to-r from-blue-500 to-purple-700 text-white"
          >
            {generating ? 'Generating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog >

      {/* Success Dialog */}
      < Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            maxWidth: 400,
            width: '90%',
          },
        }}
      >
        {/* Header */}
        < Box
          sx={{
            background: 'linear-gradient(90deg, #4ade80, #16a34a)', // green gradient
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ReceiptIndianRupee className="w-6 h-6 text-white" />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            Success!
          </Typography>
        </Box >

        {/* Content */}
        < DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 60,
              margin: '0 auto',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #34d399, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>
              ✓
            </Typography>
          </Box>
        </DialogContent >

        {/* Actions */}
        < DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setSuccessDialogOpen(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #4ade80, #16a34a)',
              color: 'white',
              px: 4,
              py: 1,
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(90deg, #16a34a, #4ade80)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions >
      </Dialog >


    </div >
  )
}


// 'use client'

// import { useEffect, useState } from 'react'
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TableContainer,
//   Paper,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TablePagination,
//   MenuItem,
//   Select,
//   SelectChangeEvent,
// } from '@mui/material'

// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import { fetchVoucherBalance } from '@/store/slices/user/voucher/voucherBalanceSlice'
// import {
//   generateVoucher,
//   resetGenerateVoucherState,
// } from '@/store/slices/user/voucher/voucherGenerateSlice'
// import {
//   transferWalletOtp,
//   resetOtpState,
// } from '@/store/slices/user/TransferWalletOtpSlice'
// import { fetchVoucherReceiptSummary } from '@/store/slices/user/voucher/voucherSummarySlice'
// import toast from 'react-hot-toast'
// import Image from 'next/image'
// import Logo from '@/assets/logo2x.png'
// import { ReceiptIndianRupee } from 'lucide-react'
// import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/store/store'

// export default function VoucherPage() {
//   const dispatch = useAppDispatch()

//   const [amount, setAmount] = useState('')
//   const [otp, setOtp] = useState('')
//   const [transactionPin, setTransactionPin] = useState('')
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [voucherKind, setVoucherKind] = useState("")
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false)
//   const [successMessage, setSuccessMessage] = useState('')

//   // pagination state
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)

//   const { balance, loading: balanceLoading } = useAppSelector(
//     (state) => state.VoucherBalance,
//   )
//   const {
//     loading: generating,
//     success,
//     error,
//     message,
//   } = useAppSelector((state) => state.generateVoucher)

//   const {
//     loading: otpLoading,
//     success: otpSuccess,
//     error: otpError,
//   } = useAppSelector((state) => state.TranferwalletOpt)

//   const {
//     items,
//     total,
//     loading: summaryLoading,
//   } = useAppSelector((state) => state.voucherSummary)

//   const {
//     data: dropdowns,
//     loading: dropdownLoading,
//   } = useSelector((state: RootState) => state.dropDownOptions)

//   useEffect(() => {
//     if (!dropdowns && !dropdownLoading) {
//       dispatch(fetchDropdownOptions())
//     }
//   }, [dispatch, dropdowns, dropdownLoading])

//   useEffect(() => {
//     if (dropdowns?.voucher_kinds?.length && !voucherKind) {
//       setVoucherKind(String(dropdowns.voucher_kinds[0].value))
//     }
//   }, [dropdowns, voucherKind])

//   useEffect(() => {
//     if (voucherKind) {
//       dispatch(fetchVoucherBalance(voucherKind))
//     }
//   }, [dispatch, voucherKind])

//   useEffect(() => {
//     dispatch(
//       fetchVoucherReceiptSummary({
//         page: page + 1,
//         page_size: rowsPerPage,
//         voucher_kind: voucherKind,
//       }),
//     )
//   }, [dispatch, page, rowsPerPage, voucherKind])

//   useEffect(() => {
//     if (otpSuccess) {
//       toast.success('OTP sent successfully')
//       setDialogOpen(true)
//       dispatch(resetOtpState())
//     }
//     if (otpError) {
//       toast.error(otpError)
//       dispatch(resetOtpState())
//     }
//   }, [otpSuccess, otpError, dispatch])

//   // Voucher generation effect
//   useEffect(() => {
//     if (success) {
//       setSuccessMessage(message || 'Voucher generated successfully')
//       setSuccessDialogOpen(true)
//       setDialogOpen(false)
//       setOtp('')
//       setTransactionPin('')
//       setAmount('')

//       dispatch(fetchVoucherBalance(voucherKind))
//       dispatch(
//         fetchVoucherReceiptSummary({
//           page: page + 1,
//           page_size: rowsPerPage,
//           voucher_kind: voucherKind,
//         }),
//       )
//     }

//     if (error) {
//       if (typeof error === 'string') {
//         toast.error(error)
//       } else {
//         toast.error('An unknown error occurred')
//       }
//     }

//     return () => {
//       dispatch(resetGenerateVoucherState())
//     }
//   }, [success, error, message, dispatch, page, rowsPerPage, voucherKind])


//   const handleSendOtp = () => {
//     const amountValue = Number(amount)
//     if (!amount || isNaN(amountValue) || amountValue <= 100) {
//       toast.error('Amount must be more than 100')
//       return
//     }

//     const currentBalance = balance?.max_allowed_voucher_limit ?? 0
//     if (balance && amountValue > balance.max_allowed_voucher_limit) {
//       toast.error(`Insufficient Kait Wallet balance. Max allowed: ${currentBalance}`)
//       return
//     }

//     dispatch(transferWalletOtp())
//   }

//   const handleConfirm = () => {
//     if (!otp.trim() || !transactionPin.trim()) {
//       toast.error('Please fill all fields')
//       return
//     }

//     dispatch(
//       generateVoucher({
//         otp,
//         transaction_pin: transactionPin,
//         amount: Number(amount),
//         voucher_kind: voucherKind,
//       }),
//     )
//   }

//   // if (!voucherKind) {
//   //   return (
//   //     <div className="flex items-center justify-center min-h-screen">
//   //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
//   //     </div>
//   //   )
//   // }

//   return (
//     <div className="bg-[#F3EAD8] min-h-screen p-3 sm:p-6">
//       <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 max-w-6xl mx-auto py-6">

//         {/* Left: Voucher Generator */}
//         <Box className="p-4 sm:p-6 shadow rounded bg-white space-y-6">
//           <Typography variant="h6" className="font-extrabold text-xl sm:text-2xl">
//             Voucher Generator
//           </Typography>

//           {/* Select Voucher Type */}
//           <div className="mt-3">
//             <label className="font-semibold text-sm">Select Voucher Type</label>

//             <Select
//               value={voucherKind}
//               onChange={(e: SelectChangeEvent) => setVoucherKind(e.target.value)}
//               size="small"
//               fullWidth
//               disabled={dropdownLoading}
//             >
//               {dropdownLoading ? (
//                 <MenuItem disabled>Loading...</MenuItem>
//               ) : (
//                 dropdowns?.voucher_kinds?.map((option: any) => (
//                   <MenuItem key={option.id} value={String(option.value)}>
//                     {option.label ?? option.value}
//                   </MenuItem>
//                 ))
//               )}
//             </Select>
//           </div>


//           {/* Balance Card */}
//           <Box className="bg-gradient-to-r from-blue-500 to-purple-700 text-white p-4 rounded-2xl space-y-2">
//             {balanceLoading ? (
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
//                   <div className="space-y-2">
//                     <div className="h-3 w-40 bg-white/30 rounded animate-pulse"></div>
//                     <div className="h-3 w-32 bg-white/30 rounded animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2 flex-wrap">
//                 <ReceiptIndianRupee className="w-8 h-8" />
//                 <div>
//                   <Typography>Total Voucher Wallet | Voucher Generated</Typography>
//                   <Typography className="gap-1 flex items-center flex-wrap">
//                     <Image src={Logo} alt="Logo" width={18} height={18} />
//                     {balance?.max_allowed_voucher_limit}
//                     <span>|</span>
//                     <Image src={Logo} alt="Logo" width={18} height={18} />
//                     {balance?.voucher_generated}
//                   </Typography>
//                 </div>
//               </div>
//             )}
//           </Box>


//           {/* Amount & Button */}
//           <Box className="border p-4 rounded space-y-4 bg-white">
//             <TextField
//               label="Amount"
//               fullWidth
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               size="small"
//             />

//             <Button
//               fullWidth
//               variant="contained"
//               className="bg-gradient-to-r from-blue-500 to-purple-700 text-white"
//               onClick={handleSendOtp}
//               disabled={otpLoading}
//               style={{ marginTop: "20px" }}
//             >
//               {otpLoading ? 'Sending OTP...' : 'Process Your Request'}
//             </Button>
//           </Box>

//           <Typography className="text-center">
//             <div className="border rounded-xl px-3 py-1 border-red-500">
//               KAIT Current Price : {balance?.kait_value}
//             </div>
//           </Typography>

//         </Box>

//         {/* Right: Voucher Summary */}
//         <Box className="bg-white p-4 sm:p-6 rounded shadow space-y-4 overflow-hidden">
//           <Typography variant="h6" className="text-xl sm:text-2xl font-extrabold">
//             Voucher Summary
//           </Typography>

//           <TableContainer component={Paper} className="shadow min-w-[600px]">
//             <Table size="small">
//               <TableHead>
//                 <TableRow className="bg-blue-100">
//                   <TableCell>Voucher</TableCell>
//                   <TableCell>PIN</TableCell>
//                   <TableCell>Amount</TableCell>
//                   <TableCell>Balance</TableCell>
//                   <TableCell>Coin</TableCell>
//                   <TableCell>Redeemed</TableCell>
//                   <TableCell>Description</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {summaryLoading ? (
//                   // ---- 🔵 Skeleton Loader Rows ----
//                   [...Array(5)].map((_, i) => (
//                     <TableRow key={i}>
//                       {[...Array(7)].map((_, j) => (
//                         <TableCell key={j}>
//                           <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : items.length > 0 ? (
//                   // ---- 🟢 Actual Data ----
//                   items.map((item, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{item.voucher}</TableCell>
//                       <TableCell>{item.pin}</TableCell>
//                       <TableCell>{item.amount}</TableCell>
//                       <TableCell>{item.balance_amount}</TableCell>
//                       <TableCell>{item.coin}</TableCell>
//                       <TableCell>
//                         {item.is_redeemed ? (
//                           <span className="text-green-600">Yes</span>
//                         ) : (
//                           <span className="text-red-600">No</span>
//                         )}
//                       </TableCell>
//                       <TableCell>{item.description}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   // ---- ⚪ No Data Case ----
//                   <TableRow>
//                     <TableCell colSpan={7} align="center">
//                       No voucher transactions found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>

//             </Table>
//           </TableContainer>

//           <TablePagination
//             component="div"
//             count={total || 0}
//             page={page}
//             onPageChange={(_, newPage) => setPage(newPage)}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(parseInt(e.target.value, 10))
//               setPage(0)
//             }}
//             rowsPerPageOptions={[5, 10, 25]}
//           />
//         </Box>
//       </div>


//       {/* OTP Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Enter OTP and PIN</DialogTitle>
//         <DialogContent dividers>
//           <TextField
//             fullWidth
//             label="OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             margin="dense"
//           />
//           <TextField
//             fullWidth
//             label="Transaction PIN"
//             type="password"
//             value={transactionPin}
//             onChange={(e) => setTransactionPin(e.target.value)}
//             margin="dense"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={handleConfirm}
//             variant="contained"
//             disabled={generating}
//             className="bg-gradient-to-r from-blue-500 to-purple-700 text-white"
//           >
//             {generating ? 'Generating...' : 'Confirm'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Success Dialog */}
//       <Dialog
//         open={successDialogOpen}
//         onClose={() => setSuccessDialogOpen(false)}
//         PaperProps={{
//           sx: {
//             borderRadius: 3,
//             overflow: 'hidden',
//             maxWidth: 400,
//             width: '90%',
//           },
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             background: 'linear-gradient(90deg, #4ade80, #16a34a)', // green gradient
//             py: 2,
//             px: 3,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1,
//           }}
//         >
//           <ReceiptIndianRupee className="w-6 h-6 text-white" />
//           <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
//             Success!
//           </Typography>
//         </Box>

//         {/* Content */}
//         <DialogContent sx={{ textAlign: 'center', py: 4 }}>
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             {successMessage}
//           </Typography>
//           <Box
//             sx={{
//               width: 60,
//               height: 60,
//               margin: '0 auto',
//               borderRadius: '50%',
//               background: 'linear-gradient(90deg, #34d399, #059669)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>
//               ✓
//             </Typography>
//           </Box>
//         </DialogContent>

//         {/* Actions */}
//         <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
//           <Button
//             onClick={() => setSuccessDialogOpen(false)}
//             variant="contained"
//             sx={{
//               background: 'linear-gradient(90deg, #4ade80, #16a34a)',
//               color: 'white',
//               px: 4,
//               py: 1,
//               fontWeight: 'bold',
//               '&:hover': {
//                 background: 'linear-gradient(90deg, #16a34a, #4ade80)',
//               },
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>


//     </div>
//   )
// }
