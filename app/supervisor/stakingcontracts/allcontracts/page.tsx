'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchStakeList } from '@/store/slices/admin/adminSliceListSlice'
import {
  Search,
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  User,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  Wallet,
  Target,
  Award,
  Activity,
} from 'lucide-react'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'
import { downloadStakeList } from '@/store/slices/admin/allcontractsDownload'
import toast from 'react-hot-toast'

const StakeListPage = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error, page, total, totalPages } = useAppSelector(
    (state) => state.AdminStakeList,
  )
  const [stakeStatus, setStakeStatus] = useState<'any' | 'active' | 'closed'>(
    'any',
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const { loading: downloadLoading, error: downloadError } = useAppSelector(
    (state) => state.AllContractsDownload,
  )

  const handleDownload = () => {
    toast.promise(
      dispatch(
        downloadStakeList({
          stake_status: stakeStatus,
          search: searchTerm,
          page,
          page_size: pageSize,
        }),
      ).unwrap(),
      {
        loading: 'Preparing download...',
        success: 'Stake contracts downloaded successfully!',
        error: (err: any) =>
          err === 'No records available for download'
            ? err
            : err || 'Download failed. Please try again.',
      },
    )
  }

  const [pageSize, setPageSize] = useState(10)


  useEffect(() => {
    // Fetch only on page or pageSize change
    dispatch(
      fetchStakeList({
        stake_status: stakeStatus,
        search: searchTerm,
        page,
        page_size: pageSize,
      })
    );
  }, [page, pageSize, dispatch]);






  const handleRefresh = () => {
    dispatch(fetchStakeList({ stake_status: stakeStatus, page, page_size: 10 }))
  }

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchStakeList({
        stake_status: stakeStatus,
        search: searchTerm,
        page: newPage,
        page_size: pageSize,
      }),
    )
  }

  const applyFilters = () => {
    dispatch(
      fetchStakeList({
        stake_status: stakeStatus,
        search: searchTerm,
        page: 1,
        page_size: pageSize,
      })
    )
  }





  // const filteredItems = items.filter(
  //   (item) =>
  //     item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.contract.toLowerCase().includes(searchTerm.toLowerCase()),
  // )


  const getStatusColor = (matured: boolean) => {
    return matured
      ? 'text-green-600 bg-green-50'
      : 'text-orange-600 bg-orange-50'
  }

  const getStatusIcon = (matured: boolean) => {
    return matured ? <CheckCircle size={16} /> : <Clock size={16} />
  }

  const getPlanColor = (plan: string) => {
    const colors = {
      Basic: 'bg-blue-100 text-blue-800',
      Premium: 'bg-purple-100 text-purple-800',
      Gold: 'bg-yellow-100 text-yellow-800',
      Platinum: 'bg-gray-100 text-gray-800',
    }
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const calculateProgress = (remaining: number, total: number) => {
    const progress = ((total - remaining) / total) * 100
    return Math.min(100, progress) // cap at 100
  }

  const getDisplayCompleted = (completed: number, total: number) => {
    return Math.min(completed, total) // cap at total
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center  space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl flex items-center gap-1 font-bold text-white mb-2">
                Stake Contracts
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw
                className={`${loading ? 'animate-spin' : ''}`}
                size={16}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={downloadLoading}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-800 transition-all shadow-sm"
            >
              <Download size={16} className="inline mr-1" />
              {downloadLoading ? 'Downloading...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl border shadow-sm p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Contracts</p>
                <p className="text-3xl font-bold  flex justify-center">
                  {total}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border shadow-sm p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Stakes</p>
                <p className="text-3xl font-bold  flex justify-center">
                  {items.filter((item) => !item.matured).length}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border shadow-sm p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Invested</p>
                <p className="text-3xl font-bold gap-2  flex justify-center">
                  <Image
                    alt="KAIT Logo"
                    src={kaitimg}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  {items
                    .reduce((sum, item) => sum + item.invested, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                {' '}
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border shadow-sm p-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Matured on this page</p>
                <p className="text-3xl font-bold  flex justify-center">
                  {items.filter((item) => item.matured).length}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search contracts, users, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-80"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={stakeStatus}
                  onChange={(e) => setStakeStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="any">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="closed">Closed Only</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-800 transition-all shadow-sm"
              >
                Apply Filters
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === 'table'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${viewMode === 'cards'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="text-gray-600 font-medium">
              Loading stake contracts...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <XCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Data</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <User size={14} />
                          <span>User</span>
                        </div>
                      </th>

                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FileText size={14} />
                          <span>Contract</span>
                        </div>
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Image
                            alt="KAIT Logo"
                            src={kaitimg}
                            width={14}
                            height={14}
                            className="object-contain"
                          />
                          <span>Investment</span>
                        </div>
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Target size={14} />
                          <span>Plan</span>
                        </div>
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <TrendingUp size={14} />
                          <span>Progress</span>
                        </div>
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={14} />
                          <span>Status</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr
                        key={item.contract}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors"
                      >
                        <td className="px-2 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {item.user.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.user}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {item.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-mono text-sm text-gray-900">
                                {item.contract}
                              </p>
                              <p className="text-gray-600 text-[12px]">
                                {item.invested_on}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center space-x-1">
                            {/* <DollarSign size={14} className="text-green-600" /> */}
                            <span className="font-semibold flex items-center gap-1 text-gray-900">
                              <Image
                                alt="KAIT Logo"
                                src={kaitimg}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                              {item.invested.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(item.plan)}`}
                          >
                            {item.plan}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>
                                {item.total - item.remaining} / {item.total}
                              </span>
                              <span>
                                {Math.round(
                                  calculateProgress(item.remaining, item.total),
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-700 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${calculateProgress(item.remaining, item.total)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.matured)}`}
                          >
                            {getStatusIcon(item.matured)}
                            <span>{item.matured ? 'Matured' : 'Active'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.contract}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {item.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.user}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.email}</p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.matured)}`}
                    >
                      {getStatusIcon(item.matured)}
                      <span>{item.matured ? 'Matured' : 'Active'}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Contract ID</span>
                      <span className="font-mono text-sm text-gray-900">
                        {item.contract}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Investment</span>
                      <span className="font-semibold flex items-center gap-1 text-gray-900">
                        <Image
                          alt="KAIT Logo"
                          src={kaitimg}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        {item.invested.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Start Date</span>
                      <span className="text-gray-900 text-sm">
                        {item.invested_on}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Plan</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(item.plan)}`}
                      >
                        {item.plan}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        Progress: {getDisplayCompleted(item.completed, item.total)} / {item.total}
                      </span>

                      {calculateProgress(item.remaining, item.total) >= 100 ? (
                        <span className="text-green-600 font-medium">Matured</span>
                      ) : (
                        <span>{Math.round(calculateProgress(item.remaining, item.total))}%</span>
                      )}
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${calculateProgress(item.remaining, item.total) >= 100
                          ? "bg-green-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-700"
                          }`}
                        style={{
                          width: `${calculateProgress(item.remaining, item.total)}%`,
                        }}
                      ></div>
                    </div>
                  </div>


                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-800 transition-all">
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No stake contracts found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'No contracts match the selected filters'}
              </p>
            </div>
          )}
        </>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100 gap-4">
        <div className="text-sm text-gray-600">
          Showing page {page} of {totalPages || 1}
        </div>

        <div className="flex items-center space-x-2">

          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {(() => {
              const pages: (number | string)[] = []
              const total = totalPages || 1

              if (total <= 7) {
                for (let i = 1; i <= total; i++) pages.push(i)
              } else {
                pages.push(1)

                if (page > 4) pages.push("...")

                const start = Math.max(2, page - 1)
                const end = Math.min(total - 1, page + 1)

                for (let i = start; i <= end; i++) pages.push(i)

                if (page < total - 3) pages.push("...")
                pages.push(total)
              }

              return pages.map((p, i) =>
                typeof p === "number" ? (
                  <button
                    key={i}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === p
                      ? "bg-gradient-to-r from-blue-500 to-purple-700 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={i} className="px-2 text-gray-400">
                    {p}
                  </span>
                )
              )
            })()}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>



        {/* Right: select page size */}
        <div className="flex items-center space-x-2 text-sm">
          <span>Rows per page:</span>
          <select
            className="border border-gray-200 rounded-md px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value)
              setPageSize(newSize)
              dispatch(
                fetchStakeList({
                  stake_status: stakeStatus,
                  page: 1,
                  page_size: newSize,
                }),
              )
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default StakeListPage
