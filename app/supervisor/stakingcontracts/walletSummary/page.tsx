'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import {
  fetchTransferSummary,
  downloadTransferSummary,
  clearTransferErrors,
  setPageSize,
} from '@/store/slices/admin/transferSummarySlice'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import toast from 'react-hot-toast'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Calendar,
  Mail,
  Wallet,
  FileText,
  ExternalLink,
  Settings,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Trash2,
  WalletCardsIcon,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'
import { FormControl, MenuItem, Select } from '@mui/material'

const TransferSummary = () => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    items,
    total,
    loading,
    error,
    downloadLoading,
    downloadError,
    page_size: pageSize,
  } = useSelector((state: RootState) => state.AdminTransfer)

  const { data: dropdownOptions, loading: dropdownLoading } = useSelector(
    (state: RootState) => state.dropDownOptions,
  )

  const [wallets, setWallets] = useState<string[]>(["KaitWallet"])
  const [transactionTypes, setTransactionTypes] = useState<string[]>([])
  const [walletFilter, setWalletFilter] = useState<string[]>([])
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [page, setPage] = useState(1)

  const applyFilter = (
    updatedWallets = wallets,
    updatedTypes = transactionTypes,
    updatedEmails = emails,
    updatedWalletFilter = walletFilter,
    updatedPage = page,
    overridePageSize?: number,
  ) => {
    dispatch(
      fetchTransferSummary({
        wallets: updatedWallets,
        transaction_types: updatedTypes,
        emails: updatedEmails,
        wallet_filter: updatedWalletFilter,
        page: updatedPage,
        page_size: overridePageSize ?? pageSize,
      }),
    )
  }

  const handleAddEmail = () => {
    const trimmed = emailInput.trim()
    if (trimmed && !emails.includes(trimmed)) {
      const updatedEmails = [...emails, trimmed]
      setEmails(updatedEmails)
      setEmailInput('')
      setPage(1)
    }
  }

  const removeEmail = (emailToRemove: string) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove)
    setEmails(updatedEmails)
    setPage(1)
  }

  const handleWalletChange = (wallet: string) => {
    const updatedWallets = wallets.includes(wallet)
      ? wallets.filter((w) => w !== wallet)
      : [...wallets, wallet]
    setWallets(updatedWallets)
    setPage(1)
  }

  const handleTransactionTypeChange = (type: string) => {
    const updatedTypes = transactionTypes.includes(type)
      ? transactionTypes.filter((t) => t !== type)
      : [...transactionTypes, type]
    setTransactionTypes(updatedTypes)
    setPage(1)
  }

  const handleWalletFilterChange = (filter: string) => {
    const updatedFilters = walletFilter.includes(filter)
      ? walletFilter.filter((f) => f !== filter)
      : [...walletFilter, filter]
    setWalletFilter(updatedFilters)
    setPage(1)
  }


  useEffect(() => {
    dispatch(fetchDropdownOptions())
  }, [dispatch])

  // useEffect(() => {
  //   applyFilter(wallets, transactionTypes, emails, walletFilter, page)
  // }, [wallets, transactionTypes, emails, walletFilter, page, pageSize])
  useEffect(() => {
    applyFilter(wallets, transactionTypes, emails, walletFilter, 1)
  }, [])



  const pageSizeOptions = [10, 25, 50, 100]

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearTransferErrors())
    }
    if (downloadError) {
      toast.error(downloadError)
      dispatch(clearTransferErrors())
    }
  }, [error, downloadError, dispatch])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    applyFilter(wallets, transactionTypes, emails, walletFilter, newPage)
  }

  const getTransactionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case 'debit':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'deposit':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'debit':
      case 'withdrawal':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  if (dropdownLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 mx-auto"></div>
            <RefreshCw className="w-20 h-20 absolute inset-0 text-white animate-spin" />
          </div>
          <p className="text-white text-lg font-medium">
            Loading admin panel...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl flex items-center gap-1 font-bold text-white mb-2">
                Wallet Summary
              </h1>
              {/* <p className="text-blue-100 text-lg">
                Admin panel for transaction management
              </p> */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Records</p>
                  <p className="text-3xl font-bold">{total}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active Filters</p>
                  <p className="text-3xl font-bold">
                    {wallets.length +
                      transactionTypes.length +
                      emails.length +
                      walletFilter.length}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Filter className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Current Page</p>
                  <p className="text-3xl font-bold">{page}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Pages</p>
                  <p className="text-3xl font-bold">
                    {Math.ceil(total / pageSize)}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-700 rounded-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Advanced Filters
              </h2>
            </div>
            <Button
              onClick={() =>
                dispatch(
                  downloadTransferSummary({
                    wallets,
                    transaction_types: transactionTypes,
                    emails,
                    wallet_filter: walletFilter,
                  }),
                )
              }
              disabled={downloadLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 text-white shadow-lg"
            >
              {downloadLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Wallet Types */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Wallet Types</span>
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(dropdownOptions?.wallets || []).map((wallet) => (
                  <label
                    key={wallet.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={wallets.includes(wallet.value)}
                      onChange={() => handleWalletChange(wallet.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {wallet.value}
                    </span>
                  </label>
                ))}
              </div>
              {wallets.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {wallets.map((wallet) => (
                    <span
                      key={wallet}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {wallet}
                      <button
                        onClick={() => handleWalletChange(wallet)}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction Types */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Transaction Types</span>
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(dropdownOptions?.transaction_types || []).map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={transactionTypes.includes(type.value)}
                      onChange={() => handleTransactionTypeChange(type.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type.value}</span>
                  </label>
                ))}
              </div>
              {transactionTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {transactionTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {type}
                      <button
                        onClick={() => handleTransactionTypeChange(type)}
                        className="ml-1 hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Wallet Filters</span>
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(dropdownOptions?.wallet_filter || []).map((filter) => (
                  <label
                    key={filter.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={walletFilter.includes(filter.value)}
                      onChange={() => handleWalletFilterChange(filter.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {filter.value}
                    </span>
                  </label>
                ))}
              </div>
              {walletFilter.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {walletFilter.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      {filter}
                      <button
                        onClick={() => handleWalletFilterChange(filter)}
                        className="ml-1 hover:text-indigo-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Email Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Addresses</span>
              </Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                    placeholder="Enter email address..."
                    className="pl-10 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <Button
                  onClick={handleAddEmail}
                  disabled={
                    !emailInput.trim() || emails.includes(emailInput.trim())
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-700 hover:from-blue-600 hover:to-purple-800 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {emails.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between p-2 bg-cyan-50 rounded-lg"
                    >
                      <span className="text-sm text-cyan-700 truncate">
                        {email}
                      </span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-cyan-500 hover:text-cyan-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => applyFilter(wallets, transactionTypes, emails, walletFilter, 1)}
              className="bg-gradient-to-r from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white shadow-lg"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>

        </Card>


        {/* Transactions Table */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-700 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Transfer Records
                </h2>
              </div>
              <div className="text-sm text-gray-600">
                Showing {items.length} of {total} records
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-700 rounded">
                          <FileText className="w-3 h-3 text-white" />
                        </div>
                        <span>Transaction Details</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-700 rounded">
                          <Mail className="w-3 h-3 text-white" />
                        </div>
                        <span>User Info</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-700 rounded">
                          <Wallet className="w-3 h-3 text-white" />
                        </div>
                        <span>Wallet & Amount</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-700 rounded">
                          <Activity className="w-3 h-3 text-white" />
                        </div>
                        <span>Type & Status</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-700 rounded">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                        <span>Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {/* <div className="flex items-center space-x-2">
                              <div className="p-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded">
                                <FileText className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                #{item.id}
                              </span>
                            </div> */}
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{item.created_at}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                              <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Wallet className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {item.wallet_name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold flex items-center gap-1 text-lg text-gray-900">
                                <Image
                                  alt="KAIT Logo"
                                  src={kaitimg}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                                {item.amount}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTransactionColor(item.transaction_type)}`}
                          >
                            {getTransactionIcon(item.transaction_type)}
                            <span className="ml-1">
                              {item.transaction_type}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.transaction_link ? (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="hover:bg-blue-50"
                            >
                              <a
                                href={item.transaction_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>View</span>
                              </a>
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No link
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <FileText className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No transfer records found
                            </h3>
                            <p className="text-gray-500">
                              Try adjusting your filters or search criteria.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {total > pageSize && (
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <div className="flex items-center justify-between flex-wrap gap-4">

              {/* Info */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <span className="mx-2">•</span>
                <span>
                  Showing {items.length} of {total} records
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="flex items-center space-x-2 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {(() => {
                    const totalPages = Math.ceil(total / pageSize)
                    const maxVisiblePages = 5
                    const half = Math.floor(maxVisiblePages / 2)
                    let startPage = Math.max(1, page - half)
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1)
                    }

                    const pages: (number | string)[] = []

                    // Always show first page
                    if (startPage > 1) {
                      pages.push(1)
                      if (startPage > 2) pages.push("…") // left ellipsis
                    }

                    // Middle range
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(i)
                    }

                    // Always show last page
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) pages.push("…") // right ellipsis
                      pages.push(totalPages)
                    }

                    return pages.map((pageNum, idx) =>
                      pageNum === "…" ? (
                        <span key={`ellipsis-${idx}`} className="px-2">…</span>
                      ) : (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum as number)}
                          className={
                            page === pageNum
                              ? 'bg-gradient-to-r from-blue-500 to-purple-700 text-white'
                              : ''
                          }
                        >
                          {pageNum}
                        </Button>
                      ),
                    )
                  })()}
                </div>


                {/* Next Button */}
                <Button
                  variant="outline"
                  disabled={page >= Math.ceil(total / pageSize)}
                  onClick={() => handlePageChange(page + 1)}
                  className="flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <FormControl size="small">
                  <Select
                    value={String(pageSize)}
                    onChange={(e) => {
                      const newSize = Number(e.target.value)
                      setPage(1)
                      dispatch(setPageSize(newSize))
                      setTimeout(() => {
                        applyFilter(
                          wallets,
                          transactionTypes,
                          emails,
                          walletFilter,
                          1,
                          newSize,
                        )
                      }, 0)
                    }}
                    style={{ minWidth: 80 }}
                  >
                    {pageSizeOptions.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>


            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TransferSummary
