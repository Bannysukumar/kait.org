'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchStakeBalance } from '@/store/slices/user/stakeBalanceSlice'
import { fetchStakeList } from '@/store/slices/user/stakeListSlice'
import Image from 'next/image'
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Pagination,
} from '@mui/material'
import image from '../../../../assets/contract1.jpg'
import Logo from '../../../../assets/logo2x.png'
import {
  Share,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Clock,
  CheckCircle,
  Target,
  Wallet,
  Activity
} from 'lucide-react'

const YourStakingContracts = () => {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)

  const {
    data: stakeBalanceData,
    loading: balanceLoading,
    error: balanceError,
  } = useAppSelector((state) => state.stakeBalance)

  const {
    data: stakeListData,
    loading: listLoading,
    error: listError,
  } = useAppSelector((state) => state.stakeList)

  useEffect(() => {
    dispatch(fetchStakeBalance())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchStakeList({ page, page_size: 10 }))
  }, [dispatch, page])

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'basic':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'silver':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'diamond':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateProgress = (completed: number, total: number) => {
    return Math.min(100, Math.round((completed / total) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
            <Share className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Staking Contracts
            </h1>
            <p className="text-white/80 text-lg">
              Monitor your investments and track performance
            </p>
          </div>
        </div>

        {/* Balance Cards */}
        {balanceLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <CircularProgress size={24} sx={{ color: 'white' }} />
              <span className="text-white font-medium">Loading balance...</span>
            </div>
          </div>
        ) : balanceError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <Typography color="error" className="font-medium">{balanceError}</Typography>
          </div>
        ) : stakeBalanceData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Total Stake</p>
                  <div className="flex items-center space-x-2">
                    <Image src={Logo} alt="KAIT" width={24} height={24} />
                    <p className="text-3xl font-bold">{stakeBalanceData.total_stake.toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <Wallet className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Total ROS</p>
                  <div className="flex items-center space-x-2">
                    <Image src={Logo} alt="KAIT" width={24} height={24} />
                    <p className="text-3xl font-bold">{stakeBalanceData.total_ros.toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
          <h2 className="text-2xl font-bold text-white">Contract Portfolio</h2>
          <p className="text-white/80 mt-1">Track your active and completed staking contracts</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Image */}
            {/* <div className="lg:w-1/3 flex-shrink-0">
              <div className="relative group">
                <Image
                  src={image}
                  alt="Staking Contract"
                  width={400}
                  height={400}
                  className="rounded-2xl shadow-lg w-full h-auto group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div> */}

            {/* Right Panel - Contract List */}
            <div className="lg:w-2/3 flex-1">
              {listLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-3">
                    <CircularProgress size={32} sx={{ color: '#6366f1' }} />
                    <span className="text-gray-600 font-medium text-lg">Loading contracts...</span>
                  </div>
                </div>
              ) : listError ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <Typography color="error" className="font-medium">{listError}</Typography>
                </div>
              ) : !stakeListData?.items?.length ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contracts Found</h3>
                  <p className="text-gray-600">You haven't created any staking contracts yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Activity className="text-blue-600" size={16} />
                        <span className="text-blue-800 text-sm font-medium">Active</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mt-1">
                        {stakeListData.items.filter(item => !item.matured).length}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-green-800 text-sm font-medium">Completed</span>
                      </div>

                      <p className="text-2xl font-bold text-green-900 mt-1">
                        {stakeListData?.items?.filter(i => i.matured).length ?? 0}
                      </p>
                    </div>


                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center space-x-2">
                        {/* <DollarSign className="text-purple-600" size={16} /> */}
                        <span className="text-purple-800 text-sm font-medium">Total Invested</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 mt-1">
                        {stakeListData.items.reduce((sum, item) => sum + item.invested, 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center space-x-2">
                        <Award className="text-orange-600" size={16} />
                        <span className="text-orange-800 text-sm font-medium">Total ROS</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900 mt-1">
                        {stakeListData.items.reduce((sum, item) => sum + item.ros_earned, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Contract Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stakeListData.items.map((item) => (
                      <div
                        key={item.contract}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        {/* Status Banner */}
                        <div className="relative">
                          <div
                            className={`absolute top-3 right-[-35px] w-[120px] text-center rotate-45 text-xs font-bold py-1 shadow-md z-10 ${item.matured
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white'
                              }`}
                          >
                            {item.matured ? 'Completed' : 'Active'}
                          </div>

                          {/* Header */}
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                            <div className="text-center">
                              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg">
                                <Target size={16} />
                                <span>{item.contract}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                          {/* Investment Amount */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-center space-x-2">
                              {/* <DollarSign className="text-blue-600" size={18} /> */}
                              <span className="text-blue-800 font-medium text-sm">Invested:</span>
                              <Image src={Logo} alt="KAIT" width={16} height={16} />
                              <span className="text-blue-900 font-bold text-lg">
                                {item.invested.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Plan Badge */}
                          <div className="text-center">
                            <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium border ${getPlanColor(item.plan)}`}>
                              <Award size={14} />
                              <span>{item.plan}</span>
                            </span>
                          </div>

                          {/* Description */}
                          <div className="text-center">
                            <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3 border">
                              {item.description}
                            </p>
                          </div>

                          {/* Investment Date */}
                          <div className="flex items-center justify-center space-x-2 text-gray-700">
                            <Calendar size={16} className="text-gray-500" />
                            <span className="text-sm font-medium">Invested On:</span>
                            <span className="text-sm">{item.invested_on}</span>
                          </div>

                          {/* Progress Section */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Clock className="text-blue-600" size={16} />
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {item.completed} / {item.completed + item.remaining} Days
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{
                                  width: `${calculateProgress(item.completed, item.completed + item.remaining)}%`,
                                }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-600">
                              <span className="font-medium">
                                {calculateProgress(item.completed, item.completed + item.remaining)}% Complete
                              </span>
                              <span>{item.remaining} days remaining</span>
                            </div>
                          </div>

                          {/* ROS Earned */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-center space-x-2">
                              <TrendingUp className="text-green-600" size={18} />
                              <span className="text-green-800 font-medium text-sm">ROS Earned:</span>
                              <Image src={Logo} alt="KAIT" width={16} height={16} />
                              <span className="text-green-900 font-bold text-lg">
                                {item.ros_earned.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {stakeListData?.total_pages && stakeListData.total_pages > 1 && (
                    <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-4">
                        <div className="text-sm text-gray-600 font-medium">
                          Page {page} of {stakeListData.total_pages}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Total Contracts: {stakeListData.total}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Pagination
                          count={stakeListData.total_pages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          shape="rounded"
                          siblingCount={1}
                          boundaryCount={1}
                          showFirstButton
                          showLastButton
                          sx={{
                            '& .MuiPaginationItem-root': {
                              '&.Mui-selected': {
                                background: 'linear-gradient(to right, #2563eb, #7c3aed, #4338ca)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(to right, #1d4ed8, #6d28d9, #3730a3)',
                                },
                              },
                              '&:hover': {
                                backgroundColor: '#f3f4f6',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourStakingContracts