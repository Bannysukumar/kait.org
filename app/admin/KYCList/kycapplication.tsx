'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import { approveKycApplication } from '../../../store/slices/index'
import { fetchKycApplications } from '../../../store/slices/admin/kyclist'
import { downloadKycDocument } from '../../../store/slices/kycListdownload'
import { RootState, AppDispatch } from '../../../store/store'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  MoreVertical,
  SquareCheck,
  Trash2,
  Search,
  Filter,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useDebounce } from 'use-debounce'
import { useAppSelector } from '@/store/hooks'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'

const KycApplications = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const userIdString = searchParams.get('userId')
  const statusParam = (searchParams.get('status') || 'pending').toLowerCase()
  const pageParam = parseInt(searchParams.get('page') || '5', 10)
  const pageSizeParam = parseInt(searchParams.get('page_size') || '10', 10)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 300)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [actionLoading, setActionLoading] = useState(false)

  const kycApplications = useSelector(
    (state: RootState) => state.auth?.kycApplications ?? [],
  )

  const totalPages = useSelector(
    (state: RootState) => state.auth?.totalPages ?? 1,
  )

  const isLoading = useSelector(
    (state: RootState) => state.auth?.isLoading ?? false,
  )

  const error = useSelector((state: RootState) => state.auth?.error ?? null)

  const {
    data: dropDownOptions,
    loading: loadingOptions,
    error: optionsError,
  } = useAppSelector((state: RootState) => state.dropDownOptions)

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchDropdownOptions())

      dispatch(
        fetchKycApplications({
          page: pageParam,
          page_size: pageSizeParam,
          status: statusParam,
          search: debouncedSearch,
        }),
      )
    }, 300)

    return () => clearTimeout(delay)
  }, [dispatch, pageParam, pageSizeParam, statusParam, debouncedSearch])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('search', searchQuery)
      params.set('page', '1')
    } else {
      params.delete('search')
      params.set('page', '1')
    }
    router.push(`/admin/KYCList?${params.toString()}`, { scroll: false })
  }, [searchQuery])

  const generatePageNumbers = (
    total: number,
    current: number,
  ): (number | string)[] => {
    if (total <= 1) return [1]

    const delta = 2
    const range: (number | string)[] = []
    const rangeWithDots: (number | string)[] = []

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (current + delta < total - 1) {
      rangeWithDots.push('...', total)
    } else if (total > 1) {
      rangeWithDots.push(total)
    }

    return rangeWithDots
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.trim().toLowerCase() || 'pending'
    switch (normalizedStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status?.trim().toLowerCase() || 'pending'
    switch (normalizedStatus) {
      case 'approved':
        return <CheckCircle size={14} />
      case 'rejected':
        return <XCircle size={14} />
      case 'pending':
      default:
        return <Clock size={14} />
    }
  }

  // const filteredApplications = useMemo(() => {
  //   return kycApplications.filter((app) => {
  //     const userName = app.user_name ?? ''
  //     const userId = app.user_id ?? ''
  //     const search = debouncedSearch.toLowerCase()

  //     const matchesSearch =
  //       userName.toLowerCase().includes(search) ||
  //       userId.toLowerCase().includes(search)

  //     const appStatus = app.status?.trim().toLowerCase() || 'pending'

  //     const statusMatch =
  //       statusParam === 'all' ||
  //       statusParam === 'any' ||
  //       statusParam === appStatus ||
  //       (statusParam === 'unsubmitted' && !app.submitted) ||
  //       (statusParam === 'submitted' && !!app.submitted)

  //     return matchesSearch && statusMatch
  //   })
  // }, [kycApplications, debouncedSearch, statusParam])

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/admin/KYCList?${params.toString()}`, { scroll: false })
  }

  const changePageSize = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page_size', newSize.toString())
    params.set('page', '1')
    router.push(`/admin/KYCList?${params.toString()}`, { scroll: false })
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', value.toLowerCase())
    params.set('page', '1')
    router.push(`/admin/KYCList?${params.toString()}`, { scroll: false })
  }

  const handleRefresh = () => {
    dispatch(
      fetchKycApplications({
        page: pageParam,
        page_size: pageSizeParam,
        status: statusParam,
        search: searchQuery,
      }),
    )
  }

  const openDialog = (userId: string) => {
    setSelectedUserId(userId)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelectedUserId(null)
    setMessage('')
  }

  const handleDownload = (userId: string, documentName: string) => {
    dispatch(
      downloadKycDocument({ user_id: userId, document_name: documentName }),
    )
  }

  const handleAction = (action: 'approve' | 'reject') => {
    if (!selectedUserId) return
    setActionLoading(true)

    dispatch(
      approveKycApplication({
        user_id: selectedUserId,
        action,
        message,
      }),
    )
      .unwrap()
      .then(({ user_id, newStatus, message }) => {
        closeDialog()

        dispatch(
          fetchKycApplications({
            page: pageParam,
            page_size: pageSizeParam,
            status: statusParam,
            search: searchQuery,
          }),
        )

        toast.success(`${message}`)
      })
      .catch(() => {
        toast.error(`${action === 'approve' ? 'Approval' : 'Rejection'} failed`)
      })
      .finally(() => setActionLoading(false))
  }

  const totalUsers = useSelector(
    (state: RootState) => state.kyclist?.total ?? 0,
  )

  const startItem = (pageParam - 1) * pageSizeParam + 1
  const endItem = Math.min(startItem + kycApplications.length - 1, totalUsers)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                KYC Applications
              </h1>
              <p className="text-white/80 text-lg">
                Manage and review KYC applications
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all shadow-lg text-white"
            >
              <RefreshCw
                className={`${isLoading ? 'animate-spin' : ''}`}
                size={16}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Total Applications
                </p>
                <p className="text-3xl font-bold">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Approved
                </p>
                <p className="text-3xl font-bold">
                  {
                    kycApplications.filter(
                      (app) => app.status?.toLowerCase() === 'approved',
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Rejected
                </p>
                <p className="text-3xl font-bold">
                  {
                    kycApplications.filter(
                      (app) => app.status?.toLowerCase() === 'rejected',
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <XCircle className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  Pending
                </p>
                <p className="text-3xl font-bold">
                  {
                    kycApplications.filter(
                      (app) =>
                        !app.status || app.status.toLowerCase() === 'pending',
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </div>




        </div>
      </div>

      <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20">
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  className="pl-10 pr-4 py-3 w-full sm:w-80"
                  placeholder="Search by Username or User ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Page Size Selector */}

            </div>
          </div>

          {/* Status Tabs */}
          <Tabs
            value={statusParam.toLowerCase()}
            onValueChange={handleTabChange}
            className="mb-6"
          >
            <TabsList className="bg-muted p-1 rounded-lg space-x-2">
              {dropDownOptions?.kyc_status?.map((type) => (
                <TabsTrigger
                  key={type.id}
                  value={type.id.toLowerCase()}
                  className="text-sm px-4 py-2 rounded-md transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  {type.value}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <XCircle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">
                    Error Loading Data
                  </h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          {!isLoading && kycApplications.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Documents</TableHead>
                      <TableHead className="font-semibold">Submitted</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycApplications.map((app) => (
                      <TableRow
                        key={app.user_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {app.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{app.user_name}
                            </div>

                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">
                            {app?.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {app.docs && typeof app.docs === 'object' ? (
                              Object.entries(app.docs).map(
                                ([docType, files]) => (
                                  <div
                                    key={docType}
                                    className="flex flex-wrap gap-2"
                                  >
                                    {files.map((file, index) => {
                                      const cleanLabel =
                                        file
                                          .split('/')
                                          .pop()
                                          ?.replace(/^\d{14}_/, '') ||
                                        'Document'
                                      return (
                                        <Button
                                          key={index}
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-8"
                                          onClick={() =>
                                            handleDownload(app.user_id, file)
                                          }
                                        >
                                          <Download className="w-3 h-3 mr-1" />
                                          {cleanLabel}
                                        </Button>
                                      )
                                    })}
                                  </div>
                                ),
                              )
                            ) : (
                              <span className="text-gray-500 text-sm">
                                No documents
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {app.submitted}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}
                          >
                            {getStatusIcon(app.status)}
                            <span className="capitalize">
                              {app.status || 'Pending'}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white"
                            >
                              <Link
                                href={`/admin/KYCList/kycdetails?userId=${encodeURIComponent(app.user_id)}`}
                              >
                                <DropdownMenuItem className="text-sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                className="text-sm"
                                onClick={() => openDialog(app.user_id)}
                              >
                                <SquareCheck className="w-4 h-4 mr-2" />
                                Approve/Reject
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem className="text-sm text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
                  {/* Info */}
                  <div className="text-sm text-gray-600">
                    Page <strong>{pageParam}</strong> of <strong>{totalPages}</strong> •
                    Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
                    <strong>{totalUsers}</strong> users
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-3">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(1)}
                      disabled={pageParam === 1}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>

                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(pageParam - 1)}
                      disabled={pageParam === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {generatePageNumbers(totalPages, pageParam).map((pageNum, idx) => (
                        <Button
                          key={idx}
                          variant={pageNum === pageParam ? "default" : "outline"}
                          size="sm"
                          disabled={pageNum === "..."}
                          onClick={() => typeof pageNum === "number" && changePage(pageNum)}
                          className={
                            pageNum === pageParam
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : ""
                          }
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(pageParam + 5)}
                      disabled={pageParam === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changePage(totalPages)}
                      disabled={pageParam === totalPages}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>


                  </div>
                  {/* Rows per page */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Show:</label>
                    <Select
                      value={String(pageSizeParam)}
                      onValueChange={(value) => {
                        const newSize = parseInt(value)
                        changePageSize(newSize)   // uses your defined function
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select page size">
                          {pageSizeParam}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {[10, 20, 50, 100].map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className="text-sm text-gray-600">per page</span>
                  </div>

                </div>
              )}

            </>
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'No KYC applications match the selected filters'}
                </p>
              </div>
            )
          )}
        </div>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Take Action on KYC Application</DialogTitle>
            <DialogDescription>
              Please confirm your decision. You can also leave a message for the
              user.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Add optional message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
            />
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            {dropDownOptions?.kyc_application_actions?.map((type) => {
              const action = String(type.value).toLowerCase()
              if (action !== 'approve' && action !== 'reject') return null

              return (
                <Button
                  key={type.id}
                  className={`${action === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  disabled={actionLoading}
                  onClick={() => handleAction(action as 'approve' | 'reject')}
                >
                  {actionLoading ? 'Processing...' : type.value}
                </Button>
              )
            })}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default KycApplications

