'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchDashboardStats } from '@/store/slices/admin/adminUserDataSlice'
import {
  CircleDollarSign,
  Users,
  Wallet,
  Eye,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Bar,
  Cell,
} from 'recharts'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/assets/logo2x.png'
import Chart from './chart'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.AdminUser)
  const [activeTab, setActiveTab] = useState<'kyc' | 'user'>('user')
  const [kaitactiveTab, setkaitActiveTab] = useState<
    'USDT' | 'OTHERS' | 'CORPORATE'
  >('USDT')

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const UsersGraph = [
    { label: 'Last Day', value: data?.users?.last_day_users },
    { label: 'Last Week', value: data?.users?.last_week_users },
    { label: 'Last Month', value: data?.users?.last_month_users },
    { label: 'Last Year', value: data?.users?.last_year_users },
  ]

  const registrationData = [
    { label: 'Last Day', value: data?.users?.last_day_users },
    { label: 'Last Week', value: data?.users?.last_week_users },
    { label: 'Last Month', value: data?.users?.last_month_users },
    { label: 'Last Year', value: data?.users?.last_year_users },
  ]
  const kycPercentage =
    (data?.users?.total_users ?? 0) > 0
      ? Math.round(
          ((data?.users?.kyc_completed ?? 0) /
            (data?.users?.total_users ?? 1)) *
            100,
        )
      : 0

  const totalUserPercentage =
    (data?.users?.total_active_users ?? 0) > 0
      ? Math.round(
          ((data?.users?.total_active_users ?? 0) /
            (data?.users?.total_users ?? 1)) *
            100,
        )
      : 0
  const [expandedClub, setExpandedClub] = useState('basic')
  const [selected, setSelected] = useState<null | (typeof registrationData)[0]>(
    null,
  )
  //  if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-4">
  //       <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
  //         <p className="text-white font-medium text-center">Loading data...</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-black">
      <div className="min-h-screen  rounded-2xl  white:bg-gray-900/50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Contracts Card */}
            <Card className="p-6 bg-white white:bg-gray-900/50 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] hover:shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500 white:text-gray-400">
                    TOTAL CONTRACTS
                  </h2>
                  <Image
                    alt="KAIT Logo"
                    src={Logo}
                    width={24}
                    height={24}
                    className="object-contain"
                  />{' '}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold">
                   {Number(data?.stakes?.total_contracts|| 0 ).toLocaleString("en-US")}
                  </span>
                </div>
                <Link href="/admin/stakingcontracts/allcontracts" passHref>
                  <button className="text-white  hover:cursor-pointer text-sm bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 rounded-full shadow hover:scale-105 transition-all">
                    VIEW
                  </button>
                </Link>
              </div>
            </Card>

            {/* Total Users Card */}
            <Card className="p-6 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500 white:text-gray-400">
                    TOTAL USERS
                  </h2>

                  {/* Tabs */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('kyc')}
                      className={`text-xs px-3 py-1 rounded transition ${
                        activeTab === 'kyc'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 white:bg-gray-800 text-gray-700'
                      }`}
                    >
                      KYC
                    </button>
                    <button
                      onClick={() => setActiveTab('user')}
                      className={`text-xs px-3 py-1 rounded transition ${
                        activeTab === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 white:bg-gray-800 text-gray-700'
                      }`}
                    >
                      USER
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold">
                  {Number(activeTab === 'kyc'
                      ? data?.users?.kyc_completed
                      : data?.users?.total_users|| 0).toLocaleString("en-US")}
                  </span>
                  <span className="text-sm bg-blue-100 white:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded">
                    {activeTab === 'kyc' ? kycPercentage : totalUserPercentage}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {activeTab === 'kyc' ? (
                      <>
                        <div>
                          KYC Completed:
                          <strong> {Number(data?.users?.kyc_completed|| 0).toLocaleString("en-US")}</strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          Last Week New Users:{' '}
                          <strong>  {Number(data?.users?.last_week_users || 0).toLocaleString("en-US")}</strong>
                        </div>
                      </>
                    )}
                  </span>

                  <Link
                    href={
                      activeTab === 'kyc'
                        ? '/admin/KYCList?page=1'
                        : '/admin/UserList?page=1'
                    }
                  >
                    <button className="text-white text-sm bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 rounded-full shadow hover:scale-105 transition-all hover:cursor-pointer">
                      VIEW
                    </button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500 white:text-gray-400">
                    KAIT WALLET
                  </h2>
                  <div className="flex gap-2">
                    <span className="text-xs bg-gray-100 white:bg-gray-800 px-2 py-1 rounded">
                      USDT
                    </span>
                    <span className="text-xs bg-gray-100 white:bg-gray-800 px-2 py-1 rounded">
                      OTHERS
                    </span>
                    <span className="text-xs bg-gray-100 white:bg-gray-800 px-2 py-1 rounded">
                      CORPORATE
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Image
                      alt="KAIT Logo"
                      src={Logo}
                      width={24}
                      height={24}
                      className="object-contain"
                    />{' '}
                   <span className="text-2xl font-semibold">
                     {Number(data?.metrics?.total_balance || 0).toLocaleString("en-US")}
                   </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      alt="KAIT Logo"
                      src={Logo}
                      width={24}
                      height={24}
                      className="object-contain"
                    />{' '}
                    <span className="text-2xl font-semibold">0</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 col-span-2 bg-white">
              <div className="space-y-4">
                <h2 className="text-sm text-gray-500 white:text-gray-400">
                  Total {Number(data?.users?.total_users || 0).toLocaleString("en-US")} Members
                </h2>

                <div className="flex flex-wrap gap-2">
                  {Object.entries(data?.clubs || {}).map(([clubName]) => (
                    <button
                      key={clubName}
                      onClick={() => setExpandedClub(clubName)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        expandedClub === clubName
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 white:bg-gray-800 text-gray-700 white:text-gray-200'
                      }`}
                    >
                      {clubName}
                    </button>
                  ))}
                </div>

                {expandedClub && (
                  <div className="mt-4 text-center text-lg font-semibold text-gray-800 white:text-gray-100">
                    {expandedClub}:{' '}
                    {Number(data?.clubs?.[expandedClub as keyof typeof data.clubs]|| 0).toLocaleString("en-US")}{' '} members
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm text-gray-500 white:text-gray-400">
                    Total Paid Members
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold">
                     {Number(data?.stakes?.total_users_with_contracts|| 0).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 white:text-gray-400">
                    Staked Members
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium">Important Metrics</h2>

                  <Link href={'/admin/stakingcontracts/walletSummary'}>
                    <button className="text-white  hover:cursor-pointer text-sm bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 rounded-full shadow hover:scale-105 transition-all">
                      VIEW
                       {/* <span className="text-lg">&gt;</span> */}
                    </button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {data?.metrics &&
                    [
                      { key: 'total_roi', label: 'Total ROI' },
                      { key: 'total_level', label: 'Total Level' },
                      { key: 'total_earnings', label: 'Total Earnings' },
                      { key: 'total_withdraw', label: 'Total Withdraw' },
                      { key: 'total_balance', label: 'Total Balance' },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 items-center gap-10 p-3 bg-gray-50 white:bg-gray-800/50 rounded-lg"
                      >
                        <span className="text-gray-600 white:text-gray-300 text-left">
                          {metric.label}
                        </span>
                        <div className="flex items-center justify-start gap-2 text-left">
                          <Image
                            alt="KAIT Logo"
                            src={Logo}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                          <span>
                            {Number(
                              data.metrics[
                                metric.key as keyof typeof data.metrics
                              ],
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Card>

            <div className="">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
