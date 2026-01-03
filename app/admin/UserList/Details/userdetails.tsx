'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchInvestorDetails } from '@/store/slices/admin/investorSlice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TeamTreeMUI from '@/components/materialui/TeamTreeMUI'
import WalletManipulationDialog from '../walletmanupulatedialog'
import { loadKaitWalletThunk, resetKaitWalletLoad } from '@/store/slices/admin/kaitwalletloadSlice'
import KaitWalletDialog from '../kaitwalletload'


import {
  ArrowLeft,
  MoreVertical,
  QrCode,
  CheckCircle2,
  Pencil,
  Mail,
  Wallet,
  Activity,
  Lock,
  Unlock,
  CreditCard,
  Power,
  MoreHorizontal,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { InvestorDetails } from '@/store/slices/admin/investorSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateUserPermission } from '@/store/slices/admin/permisionSlice'
import toast from 'react-hot-toast'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import kaitimg from '../../../../assets/logo2x.png'
import { fetchUserTree } from '@/store/slices/admin/usertreeSlice'
import { CircularProgress } from '@mui/material'
import { buildTeamTree } from '@/utils/TeamBuilders'
import { TeamMember } from '@/components/materialui/TreeWrap'
import CountUp from 'react-countup'
import { fetchBinaryInfo } from '@/store/slices/binaryinfoslice'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function InvestorDetailsPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>()
  const { details, detailsLoading, detailsError } = useSelector(
    (state: RootState) => state.investor,
  )
  const { data: BinaryInfo, loading: BinaryInfoloading, error: Binaryerror } = useSelector((state: RootState) => state.binaryInfo)

  const walletNameMap: Record<string, string> = {
    IncomeWallet: 'Income',
    AdhocWallet: 'Adhoc',
    RosWallet: 'ROS',
    ReStakeWallet: 'Restaking',
    SuperWallet: 'Super',
    FiatWallet: 'Fiat',
    BonusWallet: 'Bonus',
    VpayVoucher: 'Vpay',
    EcommerceVoucher: 'Ecommerce',
  }

  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const [kaitDialogOpen, setKaitDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    userId: string
    permissionType: keyof typeof permissionLabels
    permissionValue: boolean
    label: string
  } | null>(null)



  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [walletUserId, setWalletUserId] = useState('')
  const [walletType, setWalletType] = useState('')

  const handleWalletManipulation = (userId: string, wallet: string) => {
    const mappedType = walletNameMap[wallet] || wallet
    setWalletUserId(userId)
    setWalletType(mappedType)
    setWalletDialogOpen(true)
  }

  const handleKaitWalletManipulation = (userId: string, walletType: string) => {
    if (walletType === 'KaitWallet') {
      setSelectedUserId(userId)
      setKaitDialogOpen(true)
    } else {
      setSelectedUserId(userId)
    }
  }

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : ''
  const rootUserId = searchParams.get('userId') || ''
  const [filterUserId, setFilterUserId] = useState(rootUserId)

  const {
    data: userTree,
    loading,
    error,
  } = useSelector((state: RootState) => state.userTreeId)

  useEffect(() => {
    if (rootUserId && filterUserId && token) {
      dispatch(
        fetchUserTree({
          root_user_id: rootUserId,
          filter_user_id: filterUserId,
          token,
        }),
      )
    }
  }, [rootUserId, filterUserId, token])

  const handleUserClick = (user_id: string) => {
    setFilterUserId(user_id)

  }
  const teamWithChildren = buildTeamTree(userTree)

  useEffect(() => {
    // console.log('Route id:', userId)
    if (userId) {
      dispatch(fetchInvestorDetails(userId))
      dispatch(fetchBinaryInfo(userId))

    }
  }, [userId, dispatch])

  const handleFetchUserChildren = async (
    user_id: string,
  ): Promise<TeamMember[]> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return []

      const result = await dispatch(
        fetchUserTree({
          root_user_id: rootUserId,
          filter_user_id: user_id,
          token,
        }),
      ).unwrap()

      return buildTeamTree(result)
    } catch (error) {
      console.error('Failed to fetch user children:', error)
      return []
    }
  }

  if (detailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (detailsError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {detailsError}
      </div>
    )
  }

  if (!details || !details.user_id) {
    return <div>No investor details available</div>
  }

  interface StatusBadge {
    label: string
    className: string
    condition: boolean
    disabledLabel?: string
  }
  const permissionLabels = {
    transfer: 'Transfer',
    withdraw: 'Withdraw',
    withdraw_staking: 'Withdraw Staking',
    level_income: 'Level Income',
    credit: 'Credit',
    suspend: 'Suspend',
    adhoc_income: 'Adhoc Income',
    adhoc_transfer: 'Adhoc Transfer',
  } as const

  const getStatusBadges = (details: InvestorDetails): StatusBadge[] => {
    const badges: StatusBadge[] = [
      {
        label: 'Active',
        className: 'bg-green-500 text-white',
        condition: !details.suspend,
        disabledLabel: 'suspend',
      },
      {
        label: 'Transfer Enabled',
        className: 'bg-blue-500 text-white',
        condition: details.transfer,
        disabledLabel: 'Transfer Disabled',
      },
      {
        label: 'Withdraw Enabled',
        className: 'bg-purple-500 text-white',
        condition: details.withdraw,
        disabledLabel: 'Withdraw Disabled',
      },
      {
        label: 'Withdraw Stake Wallet Enable',
        className: 'bg-orange-500 text-white',
        condition: !details.withdraw_staking,
        disabledLabel: 'Withdraw Stake Wallet Disabled',
      },
      {
        label: 'Level Income Enabled',
        className: 'bg-teal-500 text-white',
        condition: !details.level_income,
        disabledLabel: 'Level Income Disabled',
      },
      {
        label: 'Adhoc Income Enabled',
        className: 'bg-indigo-500 text-white',
        condition: details.adhoc_income,
        disabledLabel: 'Adhoc Income Disabled',
      },
      {
        label: 'Adhoc Transfer Enabled',
        className: 'bg-green-700 text-white',
        condition: details.adhoc_transfer,
        disabledLabel: 'Adhoc Transfer Disabled',
      },
      {
        label: 'Credit',
        className: 'bg-red-500 text-white',
        condition: details.credit,
        disabledLabel: 'Credit',
      },
    ]

    return badges.map((b) => ({
      ...b,
      label: b.condition ? b.label : b.disabledLabel || b.label,
      className: b.condition ? b.className : 'bg-gray-400 text-white',
    }))
  }
  const handlePermissionChange = (
    userId: string,
    permissionType: keyof typeof permissionLabels,
    permissionValue: boolean,
  ) => {
    const label = permissionLabels[permissionType]
    setPendingAction({ userId, permissionType, permissionValue, label })
    setConfirmDialogOpen(true)
  }
  const confirmPermissionChange = async () => {
    if (!pendingAction) return
    const { userId, permissionType, permissionValue, label } = pendingAction
    setConfirmDialogOpen(false)

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Authorization token missing. Please log in again.')
      return
    }

    const userName = details?.full_name || 'User'

    try {
      const resultAction = await dispatch(
        updateUserPermission({
          userId,
          permissionType,
          permissionValue,
          token,
        }),
      )

      if (updateUserPermission.fulfilled.match(resultAction)) {
        toast.success(
          `${label} permission ${permissionValue ? 'enabled' : 'disabled'} for ${userName}`,
        )
        dispatch(fetchInvestorDetails(userId))
      } else {
        toast.error(`Failed to update ${label} permission for ${userName}`)
      }
    } catch (error) {
      console.error('Error updating permission:', error)
      toast.error(`An error occurred while updating ${label} permission.`)
    }
  }


  const statusBadges = getStatusBadges(details)
  const walletOptions = [
    'IncomeWallet',
    'AdhocWallet',
    'RosWallet',
    'ReStakeWallet',
    'SuperWallet',
    'FiatWallet',
    'BonusWallet',
    'VpayVoucher',
    'EcommerceVoucher',
  ]


  const totalUsers =
    details?.level_info?.levels.reduce((sum, lvl) => sum + lvl.total_users, 0) ||
    0
  const leftUsers = Math.floor(totalUsers / 2)
  const rightUsers = totalUsers - leftUsers
  const earned = Number(details?.income_eligibility?.total_income ?? 0)
  const maxLimit = details?.income_eligibility?.user_max_income_limit ?? 1
  const remaining = Math.max(maxLimit - earned, 0)

  const earnedPercent = Math.min((earned / maxLimit) * 100, 100)
  const remainingPercent = 100 - earnedPercent

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-7xl mx-auto bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/UserList">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">
                User Details
                <span className="text-gray-400">› {details.user_name}</span>
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white z-50 max-h-80 overflow-y-auto"
              >
                <DropdownMenuItem>
                  <Pencil className="w-4 h-4 mr-2" /> Update User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" /> Send Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleKaitWalletManipulation(details.user_id, 'KaitWallet')}
                >
                  <Wallet className="w-4 h-4 mr-2" /> KaitWallet - Manipulate
                </DropdownMenuItem>



                {walletOptions.map((wallet) => (
                  <DropdownMenuItem
                    key={wallet}
                    onClick={() => handleWalletManipulation(details.user_id, wallet)}
                  >
                    <Wallet className="w-4 h-4 mr-2" /> {wallet} - Manipulate
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Activity className="w-4 h-4 mr-2" /> Activities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Lock className="w-4 h-4 mr-2" /> Reset Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'transfer',
                      !details.transfer,
                    )
                  }
                >
                  {details.transfer ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Transfer Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Transfer Enable
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'withdraw',
                      !details.withdraw,
                    )
                  }
                >
                  {details.withdraw ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Withdraw Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Withdraw Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'withdraw_staking',
                      !details.withdraw_staking,
                    )
                  }
                >
                  {!details.withdraw_staking ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Withdraw Staking Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Withdraw Staking Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'level_income',
                      !details.level_income,
                    )
                  }
                >
                  {details.level_income ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Level Income Suspend
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Level Income Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'adhoc_income',
                      !details.adhoc_income,
                    )
                  }
                >
                  {details.adhoc_income ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Adhoc Income Disable
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Adhoc Income Enable
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'credit',
                      !details.credit,
                    )
                  }
                >
                  {details.credit ? (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Remove Credit ID
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Set Credit ID
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handlePermissionChange(
                      details.user_id,
                      'suspend',
                      !details.suspend,
                    )
                  }
                >
                  {!details.suspend ? (
                    <>
                      <Power className="w-4 h-4 mr-2 text-red-600" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2 text-red-600" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statusBadges.map((badge, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          {/* Investment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Total Staked</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details?.invested || '0'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Fixed ROS Wallet</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className="object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.fixed_ros_wallet ? Number(details.fixed_ros_wallet).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">ROS Used</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className="object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.ros_spent ? Number(details.ros_spent).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>


            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500">ROS Wallet Balance</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.ros_wallet || '0'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Total Level Income</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain "
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.total_level_income || '0'}
                </span>
              </div>
            </div>

            {/* <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Total Binary Income</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
    0
                </span>
              </div>
            </div> */}

            {/* <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Total Income</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.total_level_income || '0'}
                </span>
              </div>
            </div> */}

            {/* <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Total Income Used</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.invested || '0'}
                </span>
              </div>
            </div> */}


            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Income Wallet Balance</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain "
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.income_wallet || '0'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500">Vpay Voucher</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.vpay_voucher || '0'}
                </span>
              </div>
            </div>

            {/* <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Ecom Voucher</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.ecommerce_voucher || '0'}
                </span>
              </div>
            </div> */}



            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500">Team Business</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.team_business || '0'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500">Kait Wallet</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.kiat_wallet || '0'}
                </span>
              </div>
            </div>
            {/* <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Balance</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.balance || '0'}
                </span>
              </div>
            </div> */}

            {/* <div className="space-y-1 border-2">
              <div className="text-sm text-gray-500 ml-2">Stake Wallet</div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain ml-2"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.stake_wallet || '0'}
                </span>
              </div>
            </div> */}
            <div className="flex gap-4 justify-center rounded-3xl shadow-xl border-2 ">
              <div className="flex items-center">
                {details.email_verified ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 gap-1" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Email</span>
              </div>
              <div className="flex items-center gap-1">
                {details.kyc_verified ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>KYC</span>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">USER INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info - Left Column */}
              <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  </div>
                  <div className="font-medium text-gray-900">{details.full_name || 'N/A'}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <label className="text-sm font-semibold text-gray-600">Email Address</label>
                  </div>
                  <div className="font-medium text-gray-900">{details.email || 'N/A'}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <label className="text-sm font-semibold text-gray-600">Mobile Number</label>
                  </div>
                  <div className="font-medium text-gray-900">{details.mobile || 'N/A'}</div>
                </div>
              </div>

              {/* Basic Info - Right Column */}
              <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <label className="text-sm font-semibold text-gray-600">Wallet Address</label>
                  </div>
                  <div className="font-medium text-gray-900 break-all">{details.wallet || 'N/A'}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                  </div>
                  <div className="font-medium text-gray-900">{details.dob || 'N/A'}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <label className="text-sm font-semibold text-gray-600">Nationality</label>
                  </div>
                  <div className="font-medium text-gray-900">{details.nationality || 'N/A'}</div>
                </div>
              </div>

              {/* Nominee Details Card - Full Width */}
              <div className="md:col-span-2 space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <label className="text-sm font-semibold text-gray-700">Nominee Details</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">Name</label>
                    <span className="font-medium text-gray-900 block">{details.nominee?.name || 'N/A'}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">PAN</label>
                    <span className="font-medium text-gray-900 block">{details.nominee?.pan || 'N/A'}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">Relationship</label>
                    <span className="font-medium text-gray-900 block">{details.nominee?.relationship || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details Card - Full Width (as provided, but fixed for consistency) */}
              <div className="md:col-span-2 space-y-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <label className="text-sm font-semibold text-gray-700">Bank Details</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">Bank Name</label>
                    <span className="font-medium text-gray-900 block">{details.bank?.bank_name || 'N/A'}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">IFSC Code</label>
                    <span className="font-medium text-gray-900 block">{details.bank?.ifsc_code || 'N/A'}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">Account Number</label>
                    <span className="font-medium text-gray-900 block">{details.bank?.account_no || 'N/A'}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 block">Account Type</label>
                    <span className="font-medium text-gray-900 block">{details.bank?.account_type || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium mt-6">MORE INFORMATION</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Capping Info Card */}
              <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                <h4 className="text-[15px] flex gap-1 justify-center items-center font-semibold">
                  <Image
                    alt="KAIT Logo"
                    src={kaitimg}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  Capping 3X - {maxLimit.toLocaleString()}
                </h4>

                <div className="text-sm text-gray-700 font-medium flex justify-between">
                  {/* Earned */}
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Earned:</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <Image
                        alt="KAIT Logo"
                        src={kaitimg}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <CountUp end={earned} duration={1.5} separator="," />
                    </span>
                  </div>

                  {/* Remaining */}
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Remaining:</span>
                    <span className="text-red-500 flex items-center gap-1">
                      <Image
                        alt="KAIT Logo"
                        src={kaitimg}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <CountUp end={remaining} duration={1.5} separator="," />
                    </span>
                  </div>
                </div>
              </div>


              {/* Joining Date */}
              <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
                <label className="text-sm text-gray-500">Joining Date</label>
                <div className="font-medium text-sm">{details.joining_date}</div>
              </div>

              {/* Sponsor */}
              <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
                <label className="text-sm text-gray-500">Sponsor</label>
                <div className="font-medium text-sm">{details.sponsor}</div>
              </div>

              {/* Total Members */}
              <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
                <label className="text-sm text-gray-500">Total Members</label>
                <div className="font-medium text-sm">{details.total_members}</div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 mb-6">
            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Super Wallet</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details?.super_wallet || '0'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Fiat Wallet</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className="object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.fiat_wallet}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Restake Wallet</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className="object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details?.restake_wallet}
                </span>
              </div>
            </div>


            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500">Adhoc Wallet</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain"
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.adhoc_wallet || '0'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-3xl border-2 text-center shadow-xl">
              <div className="text-sm text-gray-500 ">Ecommerce Voucher</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-red-500">
                  {' '}
                  <Image
                    src={kaitimg}
                    width={20}
                    height={20}
                    className=" object-contain "
                    alt="Picture of the author"
                  />
                </span>
                <span className="text-lg font-medium">
                  {details.ecommerce_voucher || '0'}
                </span>
              </div>
            </div>
          </div>


          <div className="bg-white p-4 rounded-lg shadow-md space-y-3 md:col-span-2">
            <h4 className="text-sm font-semibold mb-2">Club Counts</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
              {Object.entries(details.club_counts).map(([club, count]) => (
                <div
                  key={club}
                  className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm"
                >
                  <span className="text-[13px] text-gray-500">{club}</span>
                  <span className="text-base font-semibold text-gray-800">{count}</span>

                </div>


              ))}
              <div className='bg-gray-50 border border-gray-200 rounded-md p-3  text-center justify-center shadow-sm space-y-3 md:col-span-1'>
                <span className="text-[13px] text-gray-500 text-center">User Club</span><br />
                <span className="text-base font-semibold text-gray-800  text-center">{details.user_club}</span>
              </div>
            </div>

          </div>

          <div className="bg-white p-4 rounded-lg shadow-md space-y-3 md:col-span-2">
            <h4 className="text-sm font-semibold mb-2">Team Binary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Left Direct Count</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.left_direct_count?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Right Direct Count</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.right_direct_count?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Left Team Count</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.left_team_count?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Right Team Count</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.right_team_count?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Left Volume</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.left_team_business?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Right Volume</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.right_team_business?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm">
                <span className="text-[13px] text-gray-500">Pair Matching</span>
                <span className="text-base font-semibold text-gray-800">
                  {BinaryInfo?.pair_matching?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">TEAM INFORMATION</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[300px]">

              <TeamTreeMUI
                team={teamWithChildren}
                onUserClick={handleUserClick}
                fetchUserChildren={handleFetchUserChildren}
              />

            </div>
          </div>
        </div>

        <WalletManipulationDialog
          open={walletDialogOpen}
          onOpenChange={setWalletDialogOpen}
          userId={walletUserId}
          walletType={walletType}
        />

        <KaitWalletDialog
          open={kaitDialogOpen}
          onOpenChange={setKaitDialogOpen}
          userId={selectedUserId}
        />
      </Card>
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white shadow-2xl rounded-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Confirm Action
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {pendingAction && (
              <p className="text-gray-700 leading-relaxed">
                Are you sure you want to{' '}
                <span className="font-semibold text-blue-600">
                  {pendingAction.permissionValue ? 'enable' : 'disable'}
                </span>{' '}
                the{' '}
                <span className="font-semibold text-indigo-600">
                  {pendingAction.label}
                </span>{' '}
                permission for{' '}
                <span className="font-semibold text-gray-900">
                  {details?.full_name || 'this user'}
                </span>
                ?
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              onClick={confirmPermissionChange}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
