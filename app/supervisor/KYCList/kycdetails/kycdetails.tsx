'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchKycData } from '@/store/slices/admin/kycDetails'
import { approveKycApplication } from '@/store/slices/index'
import { RootState, AppDispatch } from '@/store/store'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  MoreVertical,
  Download,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  SquareCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { downloadKycDocument } from '@/store/slices/kycListdownload'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'

const KycDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()


  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || getCookie('token')
      : null

  const { kycData, status, error } = useSelector(
    (state: RootState) => state.fetchKycData,
  )
  const [message, setMessage] = useState('')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(null)
  const openDialog = (action: 'approve' | 'reject') => {
    setSelectedAction(action)
    setActionComment('')
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedAction(null)
  }
  const handleDialogAction = async () => {
    if (!selectedAction) return
    await handleKycAction(selectedAction)
    closeDialog()
  }
  const handleApprove = () => {
    console.log('Approved with message:', message)
    // Call API to approve with message
    closeDialog()
  }

  const handleReject = () => {
    console.log('Rejected with message:', message)
    // Call API to reject with message
    closeDialog()
  }


  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [actionComment, setActionComment] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)
  const getMimeTypeFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'pdf':
        return 'application/pdf'
      default:
        return 'application/octet-stream'
    }
  }

  const userId = searchParams.get('userId')


  const openZoom = (file: string) => {
    setSelectedImage(file)
    setIsZoomOpen(true)
  }

  const closeZoom = () => {
    setIsZoomOpen(false)
    setSelectedImage(null)
  }

  const handleDownload = (userId: string, documentName: string) => {
    dispatch(
      downloadKycDocument({ user_id: userId, document_name: documentName }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle size={16} />
      case 'rejected':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const handleKycAction = async (action: 'approve' | 'reject') => {
    if (!userId || !token) return
    try {
      setIsActionLoading(true)
      await dispatch(
        approveKycApplication({ user_id: userId, action, message: message })
      ).unwrap()
      toast(`KYC ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
      dispatch(fetchKycData({ user_id: userId, token }))
      closeDialog()
    } catch (err: any) {
      console.error(err)
      toast(err || 'Failed to update KYC status')
    } finally {
      setIsActionLoading(false)
    }
  }


  useEffect(() => {
    if (userId && token) {
      dispatch(fetchKycData({ user_id: userId, token }))
    }
  }, [dispatch, userId, token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium text-center">Loading KYC details...</p>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl max-w-md w-full">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-red-600 text-sm">
              {typeof error === 'string' ? error : error?.detail}
            </p>
            <Link href="/admin/KYCList">
              <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to KYC List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href="/supervisor/KYCList">
              <Button
                variant="ghost"
                className="p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all shadow-lg text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
              <User className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                KYC Details
              </h1>
              <p className="text-white/80 text-lg">
                {kycData?.first_name} {kycData?.last_name}
              </p>
            </div>
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all shadow-lg text-white"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <SquareCheck className="w-4 h-4 mr-2" />
                Approve / Reject
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Submitted By</p>
                <p className="text-xl font-bold">{kycData?.user_name || '—'}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <User className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Reviewed By</p>
                <p className="text-xl font-bold">{kycData?.kyc_reviewed_by || 'Pending'}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Eye className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Reviewed On</p>
                <p className="text-xl font-bold">{kycData?.kyc_reviewed_at || 'Pending'}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <Calendar className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(kycData?.kyc_status || '')}
                  <span className="text-xl font-bold capitalize">
                    {kycData?.kyc_status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircle className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20 mb-6">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <User className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <User className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium text-gray-900">{kycData?.first_name || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <User className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium text-gray-900">{kycData?.last_name || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{kycData?.email || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{kycData?.mobile || '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{kycData?.dob || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">
                        {kycData?.address_1 && kycData?.address_2
                          ? `${kycData.address_1}, ${kycData.address_2}`
                          : kycData?.address_1 || kycData?.address_2 || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">City & State</p>
                      <p className="font-medium text-gray-900">
                        {kycData?.city && kycData?.state
                          ? `${kycData.city}, ${kycData.state}`
                          : kycData?.city || kycData?.state || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Country & Postal Code</p>
                      <p className="font-medium text-gray-900">
                        {kycData?.country && kycData?.postal_code
                          ? `${kycData.country}, ${kycData.postal_code}`
                          : kycData?.country || kycData?.postal_code || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </Card>

          {/* Bank Information */}
          <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Building className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Bank Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Building className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="font-medium text-gray-900">{kycData?.bank_data?.bank_name || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <CreditCard className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium text-gray-900">{kycData?.bank_data?.account_type || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <CreditCard className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-medium text-gray-900">{kycData?.bank_data?.account_no || '—'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Building className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">IFSC Code</p>
                    <p className="font-medium text-gray-900">{kycData?.bank_data?.ifsc_code || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Documents Section */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <FileText className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
              </div>

              {kycData?.kyc_files && kycData.kyc_files.length > 0 ? (
                <div className="space-y-4">
                  {kycData.kyc_files.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                      <h3 className="font-medium text-gray-900 mb-3">{file.file_name}</h3>
                      <div
                        className="aspect-video bg-gray-100 rounded-lg mb-3 cursor-pointer overflow-hidden hover:shadow-lg transition-all"
                        onClick={() => openZoom(file.file)}
                      >
                        <img
                          src={`data:image/png;base64,${file.file}`}
                          alt={file.file_name}
                          className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 truncate">{file.file_name}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all"
                          onClick={() => {
                            const mimeType = getMimeTypeFromFileName(file.file_name)
                            const byteCharacters = atob(file.file)
                            const byteNumbers = Array.from(byteCharacters).map(
                              (c) => c.charCodeAt(0),
                            )
                            const byteArray = new Uint8Array(byteNumbers)
                            const blob = new Blob([byteArray], { type: mimeType })

                            const blobUrl = URL.createObjectURL(blob)

                            const link = document.createElement('a')
                            link.href = blobUrl
                            link.download =
                              file.file_name_download ||
                              file.file_name ||
                              'document'
                            link.click()

                            URL.revokeObjectURL(blobUrl)
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No documents uploaded</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeZoom}
                className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={`data:image/jpeg;base64,${selectedImage}`}
                alt="Zoomed Document"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" bg-purple-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Approve or Reject KYC</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>Make Sure Before Approve</p>
            <div className="flex flex-col">
              <label htmlFor="adminMessage" className="mb-1 font-medium">Message (optional)</label>
              <textarea
                id="adminMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note or reason here..."
                className="border rounded-md p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleKycAction('approve')}
            >
              Approve
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleKycAction('reject')}
            >
              Reject
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog> */}
      <div className="flex gap-3 mb-6">
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => openDialog('approve')}
        >
          Approve
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={() => openDialog('reject')}
        >
          Reject
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedAction === 'approve' ? 'Approve KYC' : 'Reject KYC'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-gray-600">
              {selectedAction === 'approve'
                ? 'Are you sure you want to approve this KYC?'
                : 'Are you sure you want to reject this KYC?'}
            </p>
            <div className="flex flex-col">
              <label htmlFor="adminMessage" className="mb-1 font-medium text-gray-700">
                Message (optional)
              </label>
              <textarea
                id="adminMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note or reason here..."
                className="border rounded-md p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button
              className={
                selectedAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              disabled={isActionLoading}
              onClick={() => handleKycAction(selectedAction!)}
            >
              {isActionLoading
                ? 'Processing...'
                : selectedAction === 'approve'
                  ? 'Confirm Approve'
                  : 'Confirm Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

export default KycDetailsPage
