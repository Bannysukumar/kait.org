'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  decideWithdrawRequest,
  resetWithdrawAction,
} from '@/store/slices/admin/withdrawDecideSlice'
import { fetchWithdrawList } from '@/store/slices/admin/withdrawlistSlice'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'
import {
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  TrendingUp,
  Users,
  CreditCard,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WithdrawItem {
  withdraw_request_id: string
  user_id: string
  date_time?: string
  created_date_time?: string
  full_name: string
  email: string
  amount: number
  status: string
  wallet: string | null
  beneficiary_nick_name: string
  description: string
  source_wallet?: string
}

export default function WithdrawRequestsPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error, total, total_pages } = useAppSelector(
    (state) => state.withdrawList,
  )
  const { loading: actionLoading } = useAppSelector(
    (state) => state.withdrawAction,
  )

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WithdrawItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [comment, setComment] = useState('Approved by admin')
  const [notifyUser, setNotifyUser] = useState(true)
  const [actionBtn, setActionBtn] = useState<'approve' | 'reject' | null>(null)

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    dispatch(
      fetchWithdrawList({
        review_status: statusFilter,
        page: currentPage,
        page_size: pageSize,
      }),
    )
  }, [dispatch, statusFilter, currentPage, pageSize])

  const handleSearch = () => {
    dispatch(
      fetchWithdrawList({
        review_status: statusFilter,
        search: searchTerm.trim(),
        page: 1,
        page_size: pageSize,
      }),
    )
  }

  const [copiedTx, setCopiedTx] = useState<string | null>(null)

  const handleCopy = (text: string | null) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedTx(text)
    setTimeout(() => setCopiedTx(null), 1500)
  }

  const handleOpenDialog = (item: WithdrawItem) => {
    setSelectedItem(item)
    setComment('Approved by admin')
    setNotifyUser(true)
    setOpenDialog(true)
  }
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedItem(null)
  }

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selectedItem) return
    setActionBtn(action)

    try {
      const result = await dispatch(
        decideWithdrawRequest({
          withdraw_request_id: selectedItem.withdraw_request_id,
          user_id: selectedItem.user_id,
          action,
          comment,
          notify_user: notifyUser,
        })
      ).unwrap()

      const message =
        result?.detail ||
        `Withdraw Request for ${selectedItem.full_name} is ${action}ed by Admin.`

      if (action === 'approve') toast.success(message)
      else toast.error(message)

      handleCloseDialog()

      // 🔥 REFRESH ONLY TABLE BODY
      dispatch(
        fetchWithdrawList({
          review_status: statusFilter,
          page: currentPage,
          page_size: pageSize,
        })
      )

    } catch (error: any) {
      const errMsg =
        typeof error === 'string'
          ? error
          : error?.detail || error?.message || 'Failed to process withdrawal request.'
      toast.error(errMsg)
      handleCloseDialog()

      // 🔥 REFRESH ONLY TABLE BODY
      dispatch(
        fetchWithdrawList({
          review_status: statusFilter,
          page: currentPage,
          page_size: pageSize,
        })
      )

    } finally {
      setActionBtn(null)
      dispatch(resetWithdrawAction())
    }
  }






  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={14} />
      case 'approved':
        return <CheckCircle size={14} />
      case 'rejected':
        return <XCircle size={14} />
      default:
        return <AlertCircle size={14} />
    }
  }

  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-white rounded-full" />
  //         <p>Loading withdraw requests...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 text-white">
        <h1 className="text-3xl font-bold">Withdraw Requests</h1>
        <button
          onClick={() =>
            dispatch(
              fetchWithdrawList({
                review_status: statusFilter,
                page: currentPage,
                page_size: pageSize,
              }),
            )
          }
          className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition-all"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-white">
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
          <p className="text-white/70 text-sm">Total Requests</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
          <p className="text-white/70 text-sm">Current Page</p>
          <p className="text-3xl font-bold">{currentPage}</p>
        </div>
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
          <p className="text-white/70 text-sm">Total Amount</p>
          <p className="text-3xl font-bold">
            {totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
          <p className="text-white/70 text-sm">Unique Users</p>
          <p className="text-3xl font-bold">
            {new Set(items.map((i) => i.user_id)).size}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/90 rounded-2xl p-4 shadow-lg mb-6 flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or beneficiary..."
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none w-72"
          />
          {/* 🔍 Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Beneficiary</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // 🔥 Only Table Body Loading
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-t border-gray-100">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded w-16"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded w-12"></div></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              // 🔥 No Results
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No withdrawal requests found.
                </td>
              </tr>
            ) : (
              // 🔥 Normal Loaded Rows
              items.map((item) => (
                <tr
                  key={item.withdraw_request_id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    {new Date(item.created_date_time).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.full_name}</td>
                  <td className="px-4 py-3">
                    {item.email}
                    <br />
                    <p className='text-gray-400'>{item?.source_wallet}</p>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <Image src={kaitimg} alt="KAIT" width={16} height={16} />
                    {item.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.beneficiary_nick_name}
                    <div className=" whitespace-nowrap text-sm text-gray-600">
                      {item.wallet ? (
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-[150px]">{item.wallet}</span>

                          <button
                            onClick={() => handleCopy(item.wallet)}  // ✅ Copies ONLY wallet
                            className="p-1 rounded hover:bg-gray-100 transition"
                            title="Copy Wallet Address"
                          >
                            {copiedTx === item.wallet ? (
                              <CheckCircle className="text-green-500" size={16} />
                            ) : (
                              <FileText className="text-gray-500" size={16} />
                            )}
                          </button>
                        </div>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{item.description}</td>

                  <td className="px-4 py-3">
                    {item.status === 'pending' ? (
                      <button
                        onClick={() => handleOpenDialog(item)}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-medium shadow hover:scale-105 transition"
                      >
                        <Eye size={12} className="inline mr-1" />
                        View
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>


                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 mt-6 shadow-lg border border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium text-gray-900">{startItem}</span> to{' '}
            <span className="font-medium text-gray-900">{endItem}</span> of{' '}
            <span className="font-medium text-gray-900">{total}</span> results —
            Page{' '}
            <span className="font-medium text-gray-900">{currentPage}</span> of{' '}
            <span className="font-medium text-gray-900">{total_pages}</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <ChevronsLeft size={20} />
            </button>

            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = []
                const maxVisible = 5
                let startPage = Math.max(
                  1,
                  currentPage - Math.floor(maxVisible / 2),
                )
                let endPage = Math.min(total_pages, startPage + maxVisible - 1)

                if (endPage - startPage + 1 < maxVisible) {
                  startPage = Math.max(1, endPage - maxVisible + 1)
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === currentPage
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      {i}
                    </button>,
                  )
                }
                return pages
              })()}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === total_pages}
              className={`p-2 rounded-lg transition-colors ${currentPage === total_pages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <ChevronRight size={20} />
            </button>

            {/* Last */}
            <button
              onClick={() => handlePageChange(total_pages)}
              disabled={currentPage === total_pages}
              className={`p-2 rounded-lg transition-colors ${currentPage === total_pages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <ChevronsRight size={20} />
            </button>
          </div>

          {/* Page Size Selector */}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <label className="font-medium text-gray-700">Show:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Dialog */}
      {openDialog && selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                Withdraw Request – {selectedItem.full_name}
              </h2>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Amount:</p>
                <p className="font-semibold">
                  {selectedItem.amount.toLocaleString('en-IN')}
                </p>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={notifyUser}
                  onChange={(e) => setNotifyUser(e.target.checked)}
                />
                Notify user
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction('approve')}
                  disabled={actionLoading || actionBtn === 'approve'}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  {actionBtn === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  disabled={actionLoading || actionBtn === 'reject'}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  {actionBtn === 'reject' ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


// 'use client'

// import React, { useEffect, useState } from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Typography,
// } from '@mui/material'
// import { useAppDispatch, useAppSelector } from '@/store/hooks'
// import { fetchWithdrawList } from '@/store/slices/admin/withdrawlistSlice'
// import WithdrawAction from '../page'
// import Image from 'next/image'
// import kaitimg from '../../../../assets/logo2x.png'

// export default function PendingWithdrawRequests() {
//   const dispatch = useAppDispatch()
//   const { items, loading, error } = useAppSelector(
//     (state) => state.withdrawList,
//   )

//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedWithdrawId, setSelectedWithdrawId] = useState<string | null>(
//     null,
//   )
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

//   useEffect(() => {
//     dispatch(
//       fetchWithdrawList({ review_status: 'pending', page: 1, page_size: 10 }),
//     )
//   }, [dispatch])

//   const handleOpenDialog = (withdrawId: string, userId: string) => {
//     setSelectedWithdrawId(withdrawId)
//     setSelectedUserId(userId)
//     setOpenDialog(true)
//   }

//   const handleCloseDialog = () => {
//     setOpenDialog(false)
//     setSelectedWithdrawId(null)
//     setSelectedUserId(null)
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 space-y-6 bg-blue-100">
//       <div style={{ padding: 24 }} className=" bg-white rounded-2xl">
//         <Typography variant="h5" gutterBottom>
//           Pending Withdraw Requests
//         </Typography>

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>User</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Amount</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Beneficiary</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {items.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               items.map((item) => (
//                 <TableRow key={item.withdraw_request_id}>
//                   <TableCell>{item.date_time}</TableCell>
//                   <TableCell>{item.full_name}</TableCell>
//                   <TableCell>{item.email}</TableCell>
//                   <TableCell>
//                     <div className=" flex items-center">
//                       <Image
//                         src={kaitimg}
//                         width={20}
//                         height={20}
//                         className=" object-contain ml-2"
//                         alt="Picture of the author"
//                       />
//                       <span className=" ml-0.5">
//                         {item.amount.toLocaleString('en-IN')}
//                       </span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{item.status}</TableCell>
//                   <TableCell>{item.beneficiary_nick_name}</TableCell>
//                   <TableCell>{item.description}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() =>
//                         handleOpenDialog(item.withdraw_request_id, item.user_id)
//                       }
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>

//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           fullWidth
//           maxWidth="sm"
//         >
//           <DialogTitle>Withdraw Request Details</DialogTitle>
//           <DialogContent dividers>
//             {selectedWithdrawId && selectedUserId && (
//               <WithdrawAction
//                 withdraw_request_id={selectedWithdrawId}
//                 user_id={selectedUserId}
//                 onClose={handleCloseDialog}
//               />
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </div>
//   )
// }
