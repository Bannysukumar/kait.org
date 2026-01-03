'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import type { RootState, AppDispatch } from '@/store/store'
import { fetchVoucherWalletSummary } from '@/store/slices/user/voucher/voucherWalletSummary'
import { Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

export default function VoucherWalletSummaryTable() {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error, total, page, total_pages, page_size } = useSelector(
    (state: RootState) => state.voucherWalletSummary
  )

  const [voucherKind, setVoucherKind] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(page)
  const [rowsPerPage, setRowsPerPage] = useState(page_size)

  const { data: dropdowns, loading: dropdownLoading } = useSelector(
    (state: RootState) => state.dropDownOptions
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

  // Fetch voucher transactions when voucherKind, page, or page_size changes
  useEffect(() => {
    if (voucherKind) {
      dispatch(fetchVoucherWalletSummary({ voucher_kind: voucherKind, page: currentPage, page_size: rowsPerPage }))
    }
  }, [dispatch, voucherKind, currentPage, rowsPerPage])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= total_pages) setCurrentPage(newPage)
  }

  const formatAmount = (amount: number) =>
    amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))

  const filteredItems = items.filter((tx) => {
    const search = searchQuery.toLowerCase()
    return (
      tx.description.toLowerCase().includes(search) ||
      tx.transaction_type.toLowerCase().includes(search) ||
      tx.amount.toString().includes(search)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Voucher Wallet</h2>
              <p className="text-blue-50 text-sm">Transaction History & Summary</p>
            </div>
          </div>

          {/* Voucher Type Dropdown */}
          <div className="w-full md:w-48">
            <label className="font-semibold text-white text-sm">Select Voucher Type</label>
            <Select
              value={voucherKind}
              onChange={(e: SelectChangeEvent) => {
                setVoucherKind(e.target.value)
                setCurrentPage(1)
              }}
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

          {/* Search Box */}
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-200 w-full md:w-64"
            />
          </div>
        </div>

        {/* Loading/Error/Empty States */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">Loading transactions...</p>
            </div>
          </div>
        ) : items.length === 0 || error === "No records found" ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
            <p className="text-gray-500">Your transaction history will appear here</p>
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl font-bold">!</span>
                </div>
                <h3 className="text-red-900 font-semibold text-lg">Error Loading Data</h3>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
  
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-sm text-gray-900 line-clamp-2">
                        {tx.description}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatDate(tx.date_time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {tx.transaction_type === 'credit' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-semibold ${tx.transaction_type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {tx.transaction_type === 'credit' ? '+' : '-'}
                          {formatAmount(tx.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tx.transaction_type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {tx.transaction_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">{formatAmount(tx.closing_balance)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > rowsPerPage && (
            <div className="px-6 py-4 bg-gray-50 border-t flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-600 text-center lg:text-left">
                Page <span className="font-semibold">{currentPage}</span> of{' '}
                <span className="font-semibold">{Math.ceil(total / rowsPerPage)}</span> •{' '}
                {total} total transactions
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded-lg border text-sm transition-all ${currentPage === 1
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'hover:border-purple-600 hover:text-purple-600'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {(() => {
                  const totalPages = Math.ceil(total / rowsPerPage)
                  const pages: (number | string)[] = []

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i)
                  } else {
                    pages.push(1)
                    if (currentPage > 4) pages.push('...')
                    const start = Math.max(2, currentPage - 2)
                    const end = Math.min(totalPages - 1, currentPage + 2)
                    for (let i = start; i <= end; i++) pages.push(i)
                    if (currentPage < totalPages - 3) pages.push('...')
                    pages.push(totalPages)
                  }

                  return pages.map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                    ) : (
                      <button
                        key={`page-${p}`}
                        onClick={() => handlePageChange(p as number)}
                        className={`min-w-[32px] px-2 py-1 rounded-md text-sm transition-all ${currentPage === p
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'hover:bg-gray-100'
                          }`}
                      >
                        {p}
                      </button>
                    )
                  )
                })()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= Math.ceil(total / rowsPerPage)}
                  className={`flex items-center px-3 py-1 rounded-lg border text-sm transition-all ${currentPage >= Math.ceil(total / rowsPerPage)
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'hover:border-purple-600 hover:text-purple-600'
                    }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Rows per Page */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Rows per page:</span>
                <select
                  className="border rounded-md px-2 py-1 text-sm focus:outline-none"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1) // reset to page 1
                  }}
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  )
}
