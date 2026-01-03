'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'
import {
  ClubVolumeItem,
  fetchClubVolume,
} from '@/store/slices/admin/clubVolumeSlice'
import { syncClub } from '@/store/slices/admin/clubSyncSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Trophy,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Award,
  Target,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { downloadClubVolume } from '@/store/slices/admin/clubVolumeDownloadSlice'
import VolumeDialog from './volumeDilogBox'
import { RiMenu2Fill } from 'react-icons/ri'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'

const CLUB_TYPES = [
  'Basic',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Double Diamond',
  'Triple Diamond',
  'Kait King',
]

const ClubVolume = () => {
  const dispatch = useAppDispatch()
  const [month, setMonth] = useState<number | ''>(new Date().getMonth() + 1)
  const [emailInput, setEmailInput] = useState('')
  const [clubTypes, setClubTypes] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [syncingUserId, setSyncingUserId] = useState<string | null>(null)
  const [year, setYear] = useState<number | ''>(new Date().getFullYear())

  const { items, total_pages, loading, error } = useAppSelector(
    (state: RootState) => state.clubVolume,
  )

  function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebounced(value)
      }, delay)

      return () => clearTimeout(handler)
    }, [value, delay])

    return debounced
  }

  const debouncedEmailInput = useDebounce(emailInput, 500)
  useEffect(() => {
    const token = localStorage.getItem('token') || ''

    const timeout = setTimeout(() => {
      const yearMonth =
        month && year
          ? `${year}-${month.toString().padStart(2, '0')}`
          : undefined

      const emails = emailInput
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)

      dispatch(
        fetchClubVolume({
          token,
          year_month: yearMonth,
          emails,
          club_types: clubTypes,
          page,
          page_size: pageSize,
        }),
      )
    }, 500)

    return () => clearTimeout(timeout)
  }, [month, year, debouncedEmailInput, emailInput, clubTypes, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [debouncedEmailInput, clubTypes, month, year])


  const handleClubSync = async (user_id: string) => {
    setSyncingUserId(user_id)

    const token =
      localStorage.getItem('token') ||
      (typeof window !== 'undefined' ? document.cookie : '')

    const res = await dispatch(syncClub({ user_id, token }))
    setSyncingUserId(null)

    const emails = emailInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (syncClub.fulfilled.match(res)) {
      toast.success('Club synced successfully!')
      dispatch(
        fetchClubVolume({
          year_month:
            month && year
              ? `${year}-${month.toString().padStart(2, '0')}`
              : undefined,
          emails,
          club_types: clubTypes,
          page,
          page_size: pageSize,
          token,
        }),
      )
    } else {
      toast.error(res.payload as string)
    }
  }

  const handleDownload = () => {
    const token = localStorage.getItem('token') || ''
    const emails = emailInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (!month || !year) {
      toast.error('Please select valid month and year before download.')
      return
    }

    const formattedMonth = month.toString().padStart(2, '0')
    const yearMonth = `${year}-${formattedMonth}`

    const downloadPromise = dispatch(
      downloadClubVolume({
        token,
        year_month: yearMonth,
        club_types: clubTypes,
        emails,
      }),
    ).unwrap()

    toast.promise(downloadPromise, {
      loading: 'Preparing download...',
      success: 'Download successful!',
      error: (err) =>
        err?.status === 404
          ? 'No data available to download.'
          : err || 'Download failed',
    })
  }

  const getClubIcon = (clubType: string) => {
    switch (clubType?.toLowerCase()) {
      case 'basic':
        return <Users className="w-4 h-4" />
      case 'bronze':
        return <Award className="w-4 h-4" />
      case 'silver':
        return <Star className="w-4 h-4" />
      case 'gold':
        return <Trophy className="w-4 h-4" />
      case 'platinum':
        return <Crown className="w-4 h-4" />
      case 'diamond':
        return <Zap className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getClubColor = (clubType: string) => {
    switch (clubType?.toLowerCase()) {
      case 'basic':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'silver':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'diamond':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'double diamond':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'triple diamond':
        return 'bg-violet-100 text-violet-800 border-violet-200'
      case 'kait king':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleEmailInputChange = (value: string) => {
    setEmailInput(value)
  }
  const [volumeDialogOpen, setVolumeDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<ClubVolumeItem | null>(
    null,
  )

  const handleClubTypeChange = (type: string, checked: boolean) => {
    setClubTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type),
    )
  }

 

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-1">
                    Club Volume Overview
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Monitor member progress and club achievements
                  </p>
                </div>
              </div>

              <div>
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:brightness-110"
                >
                  Download Report
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Members
                    </p>
                    <p className="text-3xl font-bold">{items.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Eligible for Rewards
                    </p>
                    <p className="text-3xl font-bold">
                      {items.filter((item) => item.eligible_for_reward).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Top Performers
                    </p>
                    <p className="text-3xl font-bold">
                      {
                        items.filter((item) =>
                          ['Gold', 'Platinum', 'Diamond'].includes(
                            item.club_type || '',
                          ),
                        ).length
                      }
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">
                      Growth Rate
                    </p>
                    <p className="text-3xl font-bold">+24%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="year"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Year (YYYY)
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        min={2000}
                        max={2100}
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value) || '')}
                      // placeholder="2025"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="month"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Month (1-12)
                      </Label>
                      <Input
                        id="month"
                        type="number"
                        min={1}
                        max={12}
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value) || '')}
                      // placeholder="6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="emails"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      <Search className="w-4 h-4 inline mr-2" />
                      Email Addresses (comma separated)
                    </Label>
                    <Input
                      id="emails"
                      placeholder="john@example.com, jane@example.com"
                      value={emailInput}
                      onChange={(e) => handleEmailInputChange(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column - Club Types */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Club Types
                  </Label>
                  <div className="grid grid-cols-2 gap-x-6">
                    {/* First Column */}
                    <div className="flex flex-col gap-3">
                      {CLUB_TYPES.slice(0, Math.ceil(CLUB_TYPES.length / 2)).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={clubTypes.includes(type)}
                            onCheckedChange={(checked) =>
                              handleClubTypeChange(type, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={type}
                            className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                          >
                            {getClubIcon(type)}
                            <span>{type}</span>
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col gap-3">
                      {CLUB_TYPES.slice(Math.ceil(CLUB_TYPES.length / 2)).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={clubTypes.includes(type)}
                            onCheckedChange={(checked) =>
                              handleClubTypeChange(type, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={type}
                            className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                          >
                            {getClubIcon(type)}
                            <span>{type}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-red-800 font-medium">
                      Error Loading Data
                    </h3>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Table */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="text-2xl font-bold">
                Member Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!loading && items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-500 text-base">
                    {month || debouncedEmailInput.length || clubTypes.length
                      ? 'Try adjusting your filters to see more results.'
                      : 'No data available yet.'}
                  </p>
                </div>
              ) : (

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          #
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Member
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Current Club
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Eligible
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Next Club
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr
                          key={item.user_id}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {(page - 1) * pageSize + index + 1}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {item.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {item.full_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {item.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <Badge
                              className={`${getClubColor(item.club_type || '')} font-medium`}
                            >
                              <span className="flex items-center space-x-1">
                                {getClubIcon(item.club_type || '')}
                                <span>{item.club_type || '—'}</span>
                              </span>
                            </Badge>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {item.eligible_for_reward ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <span className="text-green-700 font-medium">
                                    Yes
                                  </span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 text-red-500" />
                                  <span className="text-red-700 font-medium">
                                    No
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">
                              {item.next_step?.next_club || '—'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-3 min-w-[200px]">
                              {item.next_step?.progress?.map((p, i) => {
                                const current = Number(p.current)
                                const required = Number(p.required)
                                const percent = Math.min(
                                  100,
                                  Math.round((current / required) * 100),
                                )

                                return (
                                  <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs font-medium text-gray-700">
                                        {p.title}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {current.toLocaleString()} /{' '}
                                        {required.toLocaleString()}
                                      </span>
                                    </div>
                                    <Progress
                                      value={percent}
                                      className={`h-2 ${p.status ? 'bg-green-100' : 'bg-red-100'}`}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleClubSync(item.user_id)}
                                disabled={syncingUserId === item.user_id}
                                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                              >
                                <RefreshCw
                                  className={`w-4 h-4 mr-1 ${syncingUserId === item.user_id ? 'animate-spin' : ''}`}
                                />
                                Sync
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedMember(item)
                                  setVolumeDialogOpen(true)
                                }}
                                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                              >
                                <RiMenu2Fill />
                                Volume
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <VolumeDialog
                    open={volumeDialogOpen}
                    onClose={() => {
                      setVolumeDialogOpen(false)
                      setSelectedMember(null)
                    }}
                    member={selectedMember}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {total_pages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {/* Info */}
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                Page {page} of {total_pages}
              </div>

              {/* Pagination */}
              <Stack spacing={2}>
                <Pagination
                  count={total_pages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  shape="rounded"
                  variant="outlined"
                  color="primary"
                  siblingCount={1}
                  className=' text-white'
                  boundaryCount={1}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderColor: '#ddd',
                    },
                    '& .Mui-selected': {
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                      color: 'white',
                      border: 'none',
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                />
              </Stack>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClubVolume
