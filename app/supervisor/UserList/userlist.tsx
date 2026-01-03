'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, useAppSelector } from '@/store/store'
import { useSearchParams } from 'next/navigation'
import {
  fetchInvestorDetails,
  fetchInvestorList,
} from '@/store/slices/admin/investorSlice'
import { updateUserPermission } from '@/store/slices/admin/permisionSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import kaitimg from '../../../assets/logo2x.png'

import {
  MoreHorizontal,
  Download,
  UserPlus,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Mail,
  Wallet,
  Activity,
  Lock,
  Unlock,
  CreditCard,
  Power,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  TrendingUp,
  Shield,
  Settings,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ResetPasswordForm from './Resetpassword/page'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import AddUserDialog from './AddUserDialog/page'
import WalletManipulationDialog from './walletmanupulatedialog'
import EmailDialog from './SendEmail'
import { downloadInvestorList } from '@/store/slices/admin/investorSlice'
import UpdateInvestorDialog from './updateInvestorDilog'
import { fetchEligibleUsers } from '@/store/slices/user/eligibleUserTransferSlice'
import KaitWalletDialog from './kaitwalletload'
import { FaUserAltSlash, FaUserCheck } from 'react-icons/fa'

type permissionType =
  | 'transfer'
  | 'withdraw'
  | 'withdraw_staking'
  | 'level_income'
  | 'credit'
  | 'suspend'
  | 'adhoc_income'

export default function InvestorList() {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const { downloadLoading } = useSelector((state: RootState) => state.investor)

  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const handleResetPassword = (userId: string) => {
    setSelectedUserId(userId)
    setOpen(true)
  }
  const {
    loading,
    message,
    error: permissionError,
  } = useSelector((state: RootState) => state.updateUserPermission)

  const { list, isLoading, error, total } = useSelector(
    (state: RootState) => state.investor,
  )
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailUserId, setEmailUserId] = useState('')

  const handleEmailDialogOpen = (userId: string) => {
    setEmailUserId(userId)
    setEmailDialogOpen(true)
  }

  const searchParams = useSearchParams()

  const pageFromUrl = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(pageFromUrl)

  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.ceil(total / pageSize)

  const router = useRouter()
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', currentPage.toString())
    router.push(`?${params.toString()}`)
  }, [currentPage])

  useEffect(() => {
    dispatch(fetchDropdownOptions())

    dispatch(
      fetchInvestorList({
        page: currentPage,
        page_size: pageSize,
        searchQuery,
      }),
    )
  }, [dispatch, currentPage, pageSize])

  const handleSearch = () => {
    setCurrentPage(1);
    dispatch(
      fetchInvestorList({
        page: 1,
        page_size: pageSize,
        searchQuery,
      })
    );
  };

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  const handlePermissionChange = async (
    userId: string,
    permissionType: permissionType,
    permissionValue: boolean | undefined,
  ) => {
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Authorization token missing. Please log in again.')
      return
    }

    const investor = list.find((inv) => inv.user_id === userId)
    const userName = investor?.name || 'User'
    const permissionValueToSend =
      permissionValue === undefined ? false : permissionValue

    console.log('Attempting to update permission with values:', {
      userId,
      permissionType,
      permissionValueToSend,
    })

    try {
      const resultAction = await dispatch(
        updateUserPermission({
          userId,
          permissionType,
          permissionValue: permissionValueToSend,
          token,
        }),
      )

      if (updateUserPermission.fulfilled.match(resultAction)) {
        toast.success(
          `${permissionType} permission ${permissionValueToSend ? 'enabled' : 'disabled'} for ${userName}`,
        )

        dispatch(
          fetchInvestorList({
            page: currentPage,
            page_size: pageSize,
            searchQuery,
          }),
        )
      } else {
        toast.error(
          `Failed to update ${permissionType} permission for ${userName}`,
        )
      }
    } catch (error) {
      console.error('Error updating permission:', error)
      toast.error(
        `An error occurred while updating ${permissionType} permission for ${userName}`,
      )
    }
  }

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authorization token is missing')
        return
      }

      const blob = await dispatch(
        downloadInvestorList({
          token,
          page: currentPage,
          page_size: pageSize,
          search: searchQuery,
        }),
      ).unwrap()

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'investor_list.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download investor list')
    }
  }
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedUserToUpdate, setSelectedUserToUpdate] = useState<any>(null)

  const generatePageNumbers = (totalPages: number, currentPage: number) => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        )
      }
    }
    return pages
  }


  const handleViewDetails = async (userId: string) => {
    try {
      const resultAction = await dispatch(fetchInvestorDetails(userId))
      if (fetchInvestorDetails.fulfilled.match(resultAction)) {
        router.push(
          `/supervisor/UserList/Details?userId=${userId}&page=${currentPage}`,
        )
      } else {
        toast.error('Failed to fetch investor details.')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  const [activeTab, setActiveTab] = useState('Investor / Users')

  const tabs = ['Investor / Users']
  const [walletDialogOpen, setWalletDialogOpen] = useState(false)
  const [walletUserId, setWalletUserId] = useState('')
  const [walletType, setWalletType] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string>('')
  const [kaitDialogOpen, setKaitDialogOpen] = useState(false)
  const [selectedUserKaitId, setSelectedUserKaitId] = useState('')

  const handleWalletManipulation = (userId: string, type: string) => {
    setWalletUserId(userId)
    setWalletType(type)

    setSelectedUserId(userId)
    setSelectedWallet(type)

    setWalletDialogOpen(true)
    setDialogOpen(true)
  }

  const handleKaitWalletManipulation = (userId: string, walletType: string) => {
    if (walletType === 'KaitWallet') {
      setSelectedUserKaitId(userId)
      setKaitDialogOpen(true)
    } else {
      setSelectedUserKaitId('')
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-white bg-clip-text text-transparent">
              Investor Management
            </h1>
          </div>
          <p className="text-white ml-11">Manage and monitor all investor accounts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{total || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">{list?.filter(u => !u.suspend).length || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Verified KYC</p>
                <p className="text-2xl font-bold">{list?.filter(u => u.kyc_verified).length || 0}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Current Page</p>
                <p className="text-2xl font-bold">{currentPage}</p>
              </div>
              <Settings className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="p-8">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      className="pl-10 w-full sm:w-80 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Search by name, email, ID, or wallet address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>


                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200"
                    onClick={handleDownload}
                    disabled={downloadLoading}
                  >
                    <Download className="w-4 h-4" />
                    {downloadLoading ? 'Preparing...' : 'Export'}
                  </Button>
                  <AddUserDialog />
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        business
                      </th>
                      {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Team Business
                                </th> */}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Verification
                      </th>
                      {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Transfer
                                  Enable
                                </th> */}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">

                        Status Enable
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {isLoading ? (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="flex flex-col items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4" />
                            <p className="text-gray-600 text-lg font-medium">Loading investors...</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : error ? (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="flex flex-col items-center justify-center py-24">
                            <p className="text-red-500 text-lg font-medium">{error}</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (

                    <tbody className="divide-y divide-gray-200">
                      {list?.map((investor, index) => (
                        <tr key={investor.user_id} className="hover:bg-gray-50/50 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {investor.name?.charAt(0)?.toUpperCase() || 'U'}
                                      </div> */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-gray-900">{investor.name}</div>
                                  {investor.credit && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                      CREDIT
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {investor.referred_by || 'Direct'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{investor.email}</div>
                          </td>
                          {/* <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={kaitimg}
                                        width={20}
                                        height={20}
                                        className="object-contain"
                                        alt="KAIT Token"
                                      />
                                      <span className="font-medium text-gray-900">{investor.invested || 0}</span>
                                    </div>
                                  </td> */}
                          <td className="px-6 py-4">
                            <div className=' text-[14px] text-gray-900'>Invested </div>
                            <div className="flex items-center gap-2">
                              <Image
                                src={kaitimg}
                                width={20}
                                height={20}
                                className="object-contain"
                                alt="KAIT Token"
                              />
                              <span className="font-medium text-gray-900">{investor.invested || 0}</span>
                            </div>
                            <div className=' text-[14px] text-gray-900'> Team business </div>
                            <div className="flex items-center gap-2">
                              <Image
                                src={kaitimg}
                                width={20}
                                height={20}
                                className="object-contain"
                                alt="KAIT Token"
                              />
                              <span className="font-medium text-gray-900">{investor.team_business || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                {investor.email_verified ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm text-gray-600">Email</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {investor.kyc_verified ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm text-gray-600">KYC</span>
                              </div>
                            </div>
                          </td>
                          {/* <td className="px-6 py-4">
                                    <Switch
                                      checked={investor.transfer}
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                          investor.user_id,
                                          'transfer',
                                          checked,
                                        )
                                      }
                                      disabled={isLoading}
                                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                                    />
                                  </td> */}
                          <td className="px-6 py-4">
                            <div className=' text-[14px] text-gray-900'>Transfer</div>
                            <Switch
                              checked={investor.transfer}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  investor.user_id,
                                  'transfer',
                                  checked,
                                )
                              }
                              disabled={isLoading}
                              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                            /><br />
                            <div className=' text-[14px] text-gray-900'>Widthraw</div> <Switch
                              checked={investor.withdraw}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  investor.user_id,
                                  'withdraw',
                                  checked,
                                )
                              }
                              disabled={isLoading}
                              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${investor.suspend
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                                }`}
                            >
                              {investor.suspend ? <FaUserAltSlash /> : <FaUserCheck />}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white z-50 max-h-80 overflow-y-auto border border-gray-200 shadow-lg"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleViewDetails(investor.user_id)
                                  }
                                  className="hover:bg-gray-50"
                                >
                                  <Eye className="w-4 h-4 mr-2" /> View Details
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    const firstName =
                                      investor.first_name ||
                                      investor.name?.split(' ')[0] ||
                                      ''
                                    const lastName =
                                      investor.last_name ||
                                      investor.name?.split(' ')[1] ||
                                      ''

                                    const updatedUser = {
                                      user_id: investor.user_id,
                                      first_name: firstName,
                                      last_name: lastName,
                                      email: investor.email || '',
                                      mobile: investor.mobile || '',
                                      referral_user_id: investor.referred_by || '',
                                    }

                                    setSelectedUserToUpdate(updatedUser)
                                    dispatch(fetchEligibleUsers(investor.user_id))

                                    setTimeout(() => {
                                      setUpdateDialogOpen(true)
                                    }, 0)
                                  }}
                                  className="hover:bg-gray-50"
                                >
                                  <Pencil className="w-4 h-4 mr-2" /> Update User
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEmailDialogOpen(investor.user_id)
                                  }
                                  className="hover:bg-gray-50"
                                >
                                  <Mail className="w-4 h-4 mr-2" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(fetchInvestorDetails(investor.user_id))

                                    handleKaitWalletManipulation(investor.user_id, 'KaitWallet')
                                  }}
                                >
                                  <Wallet className="w-4 h-4 mr-2" /> KaitWallet - Manipulate
                                </DropdownMenuItem>
                                {dropDownOptions?.wallet_kinds.map((wallet) => (
                                  <DropdownMenuItem
                                    key={wallet.id}
                                    onClick={() => {
                                      dispatch(fetchInvestorDetails(investor.user_id))
                                      handleWalletManipulation(investor.user_id, String(wallet.value))
                                    }}
                                    className="hover:bg-gray-50"
                                  >
                                    <Wallet className="w-4 h-4 mr-2" /> {wallet.value} Wallet
                                  </DropdownMenuItem>
                                ))}


                                <DropdownMenuItem className="hover:bg-gray-50">
                                  <Activity className="w-4 h-4 mr-2" /> Activities
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleResetPassword(investor.user_id)
                                  }
                                  className="hover:bg-gray-50"
                                >
                                  <Lock className="w-4 h-4 mr-2" /> Reset Password
                                </DropdownMenuItem>

                                {dropDownOptions?.permission_types?.map(
                                  ({ id, value }) => {
                                    let label = ''
                                    let icon = null

                                    const isEnabled =
                                      investor[id as keyof typeof investor]

                                    switch (id) {
                                      case 'transfer':
                                        label = isEnabled
                                          ? 'Transfer Disable'
                                          : 'Transfer Enable'
                                        icon = isEnabled ? (
                                          <Lock className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Unlock className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'withdraw':
                                        label = isEnabled
                                          ? 'Withdraw Disable'
                                          : 'Withdraw Enable'
                                        icon = isEnabled ? (
                                          <Lock className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Unlock className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'withdraw_staking':
                                        label = !isEnabled
                                          ? 'Withdraw Staking Disable'
                                          : 'Withdraw Staking Enable'
                                        icon = isEnabled ? (
                                          <Unlock className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Lock className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'level_income':
                                        label = isEnabled
                                          ? 'Level Income Suspend'
                                          : 'Level Income Enable'
                                        icon = isEnabled ? (
                                          <Lock className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Unlock className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'adhoc_income':
                                        label = isEnabled
                                          ? 'Adhoc Income Disable'
                                          : 'Adhoc Income Enable'
                                        icon = isEnabled ? (
                                          <Lock className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Unlock className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'adhoc_transfer':
                                        label = isEnabled
                                          ? 'Adhoc Transfer Disable'
                                          : 'Adhoc Transfer Enable'
                                        icon = isEnabled ? (
                                          <Lock className="w-4 h-4 mr-2" />
                                        ) : (
                                          <Unlock className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'credit':
                                        label = isEnabled
                                          ? 'Remove Credit ID'
                                          : 'Set Credit ID'
                                        icon = (
                                          <CreditCard className="w-4 h-4 mr-2" />
                                        )
                                        break
                                      case 'suspend':
                                        label = isEnabled ? 'Activate' : 'Suspend'
                                        icon = (
                                          <Power className="w-4 h-4 mr-2 text-red-600" />
                                        )
                                        break
                                      default:
                                        label = String(value)
                                        icon = <Lock className="w-4 h-4 mr-2" />
                                    }

                                    return (
                                      <DropdownMenuItem
                                        key={id}
                                        onClick={() =>
                                          handlePermissionChange(
                                            investor.user_id,
                                            id as permissionType,
                                            !isEnabled,
                                          )
                                        }
                                        className="hover:bg-gray-50"
                                      >
                                        {icon}
                                        {label}
                                      </DropdownMenuItem>
                                    )
                                  },
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>)}
                </table>
              </div>
            </div>

            {/* Pagination */}
            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between flex-wrap gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {generatePageNumbers(totalPages, currentPage).map((pageNum, idx) => (
                    <Button
                      key={idx}
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="sm"
                      disabled={pageNum === '...'}
                      onClick={() =>
                        typeof pageNum === 'number' && setCurrentPage(pageNum)
                      }
                      className={
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0'
                          : 'bg-white hover:bg-gray-50'
                      }
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white hover:bg-gray-50"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      const size = parseInt(value)
                      setPageSize(size)
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="Page size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50, 100].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-600">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </div>
              </div>
            </div>

          </div>
        </Card>

        {/* Dialogs */}
        <EmailDialog
          open={emailDialogOpen}
          onClose={() => setEmailDialogOpen(false)}
          userId={emailUserId}
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <ResetPasswordForm userId={selectedUserId} />
          </DialogContent>
        </Dialog>

        <WalletManipulationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userId={walletUserId}
          walletType={walletType}
        />


        <KaitWalletDialog
          open={kaitDialogOpen}
          onOpenChange={setKaitDialogOpen}
          userId={selectedUserKaitId}
        />


        {
          selectedUserToUpdate && (
            <UpdateInvestorDialog
              key={selectedUserToUpdate.user_id}
              open={updateDialogOpen}
              onClose={() => setUpdateDialogOpen(false)}
              user={selectedUserToUpdate}
            />
          )
        }
      </div >
    </div >
  )
}