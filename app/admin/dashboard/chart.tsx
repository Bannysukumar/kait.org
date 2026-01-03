'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchDashboardStats } from '@/store/slices/admin/adminUserDataSlice'
import { fetchRegistrationStats } from '@/store/slices/admin/registrationStatSlice'
import {
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Bar,
  Cell,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Logo from '@/assets/logo2x.png'

export default function Dashboard() {
  const dispatch = useAppDispatch()

  const dashboardData = useAppSelector((state) => state.AdminUser.data)
  const dashboardError = useAppSelector((state) => state.AdminUser.error)
  const registrationData = useAppSelector(
    (state) => state.registrationStat.data,
  )
  const registrationLoading = useAppSelector(
    (state) => state.registrationStat.loading,
  )
  const registrationError = useAppSelector(
    (state) => state.registrationStat.error,
  )

  const [period, setPeriod] = useState('day')
  const [selectedBar, setSelectedBar] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<'kyc' | 'user'>('user')
  const [expandedClub, setExpandedClub] = useState('Basic')

  const periodOptions = [
    { label: 'Last Day', value: 'day' },
    { label: 'Last Week', value: 'week' },
    { label: 'Last 15 Days', value: '15days' },
    { label: 'Last Month', value: 'month' },
  ]

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchRegistrationStats(period))
  }, [dispatch, period])

  useEffect(() => {
    if (dashboardError) toast.error(dashboardError)
    if (registrationError) toast.error(registrationError)
  }, [dashboardError, registrationError])

  const kycPercentage = dashboardData?.users?.total_users
    ? Math.round(
        (dashboardData.users.kyc_completed / dashboardData.users.total_users) *
          100,
      )
    : 0

  const activePercentage = dashboardData?.users?.total_users
    ? Math.round(
        (dashboardData.users.total_active_users /
          dashboardData.users.total_users) *
          100,
      )
    : 0

  return (
    <div className="  bg-blue-100 rounded-2xl">
      <div className=" bg-white white:bg-gray-900/50 rounded-2xl">
        <div className=" space-y-8">

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-lg">Registration Statistics</h2>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[150px] border-none text-sm text-gray-500">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-[300px]">
                {registrationLoading ? (
                  <p className="text-center pt-12">Loading...</p>
                ) : registrationData?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={registrationData}
                      onClick={(e: any) => {
                        if (e?.activePayload?.[0]?.payload) {
                          setSelectedBar(e.activePayload[0].payload)
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="id" />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value} users`,
                          'Registrations',
                        ]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]}>
                        {registrationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              selectedBar?.id === entry.id
                                ? '#4338CA'
                                : '#4F46E5'
                            }
                            cursor="pointer"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center pt-12 text-gray-500">
                    No data available
                  </p>
                )}
              </div>

              {selectedBar && (
                <div className="text-sm text-gray-700 border-t pt-4">
                  <strong>{selectedBar.id}</strong>: {selectedBar.value} user(s)
                  registered
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
