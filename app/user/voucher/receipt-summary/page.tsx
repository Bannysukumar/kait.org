'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchVoucherUsageSummary } from '@/store/slices/user/voucher/voucherUsageSummarySlice'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Coins, Receipt, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Select, MenuItem, SelectChangeEvent } from '@mui/material'

const VoucherUsageSummary = ({ voucherKind: propVoucherKind }: { voucherKind?: string }) => {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [voucherKind, setVoucherKind] = useState(propVoucherKind || '')

  const { items, total, total_pages, loading, error } = useAppSelector(
    (state) => state.voucherUsageSummary,
  )
  const { data: dropdowns, loading: dropdownLoading } = useSelector(
    (state: RootState) => state.dropDownOptions,
  )

  // Fetch dropdown options if not loaded
  useEffect(() => {
    if (!dropdowns && !dropdownLoading) {
      dispatch(fetchDropdownOptions())
    }
  }, [dispatch, dropdowns, dropdownLoading])

  // Set default voucher kind after dropdowns load
  useEffect(() => {
    if (!voucherKind && dropdowns?.voucher_kinds?.length) {
      setVoucherKind(String(dropdowns.voucher_kinds[0].value))
    }
  }, [dropdowns, voucherKind])

  // Fetch usage summary whenever voucherKind, page, or pageSize changes
  useEffect(() => {
    if (voucherKind) {
      dispatch(fetchVoucherUsageSummary({ voucher_kind: voucherKind, page, page_size: pageSize }))
    }
  }, [dispatch, voucherKind, page, pageSize])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= total_pages) {
      setPage(newPage)
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setPage(1)
    setPageSize(newSize)
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-purple-700 border-b-gray-800 border-l-transparent border-r-transparent"></div>
  //     </div>
  //   )
  // }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-xl border border-slate-200 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 space-y-3 md:space-y-0">
            {/* Left: Icon + Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Voucher Usage Summary
              </h1>
            </div>

            {/* Right: Voucher Type Selector */}
            <div className="w-full md:w-48">
              <label className="font-semibold text-white text-sm">Select Voucher Type</label>
              <Select
                value={voucherKind}
                onChange={(e: SelectChangeEvent) => setVoucherKind(e.target.value)}
                size="small"
                fullWidth
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '.MuiSvgIcon-root': { color: 'white' },
                }}
              >
                {dropdowns?.voucher_kinds?.map((option: any) => (
                  <MenuItem key={option.id} value={String(option.value)}>
                    {option.label ?? option.value}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <p className="text-blue-100 mt-2">Track and monitor your voucher usage history</p>
        </motion.div>


        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {loading ? (
            // 🌟 Skeleton Loader (3 cards)
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-lg border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-white/30 animate-pulse rounded"></div>
                    <div className="h-6 w-16 bg-white/40 animate-pulse rounded"></div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="w-6 h-6 bg-white/30 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Total Vouchers</p>
                    <p className="text-2xl font-bold text-white">{total}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Active Vouchers</p>
                    <p className="text-2xl font-bold text-white">
                      {items.filter(item => !item.is_redeemed).length}
                    </p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Redeemed</p>
                    <p className="text-2xl font-bold text-white">
                      {items.filter(item => item.is_redeemed).length}
                    </p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>


        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-white">Usage History</h2>
            <p className="text-white/70 text-sm mt-1">Detailed breakdown of your voucher transactions</p>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Voucher
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Used
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center justify-end space-x-2">
                      <Coins className="w-4 h-4" />
                      <span>Coin</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {loading ? (
                    // 🌟 Skeleton Loader Rows (5 rows × matching columns)
                    [...Array(5)].map((_, i) => (
                      <motion.tr
                        key={`loader-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="w-full h-4 bg-slate-200 animate-pulse rounded"></div>
                          </td>
                        ))}
                      </motion.tr>
                    ))
                  ) : items.length > 0 ? (
                    items.map((tx, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="hover:bg-slate-50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-800 max-w-xs truncate" title={tx.description}>
                            {tx.description}
                          </div>
                          <div className="text-sm font-medium text-slate-800">{tx.date_time}</div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {tx.voucher}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-semibold text-slate-800">{tx.total_amount}</div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-medium text-orange-600">{tx.used_amount}</div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-medium text-green-600">{tx.remaining_amount}</div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-sm font-semibold text-slate-800">{tx.coin}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {tx.is_redeemed ? (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Redeemed
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Active
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Receipt className="w-8 h-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-slate-500 font-medium">No voucher usage found</p>
                            <p className="text-slate-400 text-sm mt-1">Your voucher history will appear here</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>

            </table>
          </div>

          {/* Pagination Section */}
          {total_pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-50 border-t border-slate-200 px-8 py-6"
            >
              <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(total_pages, 7) }, (_, i) => {
                      let pageNum;
                      if (total_pages <= 7) {
                        pageNum = i + 1;
                      } else if (page <= 4) {
                        pageNum = i + 1;
                      } else if (page >= total_pages - 3) {
                        pageNum = total_pages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${page === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'text-slate-600 hover:bg-white hover:shadow-md border border-slate-200'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === total_pages}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-slate-600">Rows per page:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    {[5, 10, 25, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Page Info */}
                <div className="text-sm text-slate-600 font-medium">
                  Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
                  <span className="font-semibold text-slate-800">{total_pages}</span> •{' '}
                  <span className="font-semibold text-slate-800">{total}</span> total transactions
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mx-8 mb-6 rounded-r-lg"
            >
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default VoucherUsageSummary