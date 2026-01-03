'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addBeneficiary,
  resetBeneficiaryState,
} from '@/store/slices/user/addBeneficiary'
import {
  updateBeneficiary,
  resetUpdateState,
} from '@/store/slices/user/updateBeneficiary'
import { fetchBeneficiaries } from '@/store/slices/user/listBeneficiary'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Edit,
  Wallet,
  Mail,
  Phone,
  User,
  CreditCard,
  Check,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
} from 'lucide-react'
import toast from 'react-hot-toast'

const REVIEW_STATUSES = ['any', 'approved', 'pending', 'rejected'] as const

export default function AddBeneficiaryForm() {
  const dispatch = useAppDispatch()

  const {
    loading: addLoading,
    success,
    error: addError,
  } = useAppSelector((state) => state.addbeneficiary)

  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useAppSelector((state) => state.updateBeneficiary)

  const {
    items,
    loading: listLoading,
    error: listError,
    total_pages,
    page,
  } = useAppSelector((state: RootState) => state.listbeneficiary)

  const [currentPage, setCurrentPage] = useState(1)
  const [reviewStatus, setReviewStatus] = useState<
    'any' | 'approved' | 'pending' | 'rejected'
  >('any')

  const [formData, setFormData] = useState({
    nick_name: '',
    wallet_address: '',
    mobile: '',
    email: '',
    limit: '',
  })

  const [editMode, setEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const skipNextFetch = useRef(false)

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false
      return
    }
    dispatch(fetchBeneficiaries({ page: currentPage, review_status: reviewStatus }))
  }, [dispatch, currentPage, reviewStatus])

  useEffect(() => {
    if (success) {
      toast.success('Beneficiary added successfully!')
      resetForm()
      skipNextFetch.current = true
      dispatch(fetchBeneficiaries({ page: currentPage, review_status: reviewStatus }))
      setTimeout(() => dispatch(resetBeneficiaryState()), 2000)
    }
  }, [success])

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Beneficiary updated successfully!')
      resetForm()
      skipNextFetch.current = true
      dispatch(fetchBeneficiaries({ page: currentPage, review_status: reviewStatus }))
      setTimeout(() => dispatch(resetUpdateState()), 2000)
    }
  }, [updateSuccess])

  useEffect(() => {
    if (addError) toast.error(renderError(addError))
    if (updateError) toast.error(renderError(updateError))
  }, [addError, updateError])

  const resetForm = () => {
    setFormData({
      nick_name: '',
      wallet_address: '',
      mobile: '',
      email: '',
      limit: '',
    })
    setEditMode(false)
    setEditingBeneficiaryId(null)
    setEditingUserId(null)
    setOpenDialog(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      limit: formData.limit === '' ? null : Number(formData.limit),
    }

    skipNextFetch.current = true

    if (editMode && editingBeneficiaryId) {
      dispatch(
        updateBeneficiary({
          ...payload,
          beneficiary_id: editingBeneficiaryId!,
          user_id: editingUserId!,
        })
      )
    } else {
      dispatch(addBeneficiary(payload))
    }
  }

  const renderError = (error: any) => {
    if (!error) return null
    return typeof error === 'string'
      ? error
      : error?.detail || 'An unexpected error occurred.'
  }

  const filteredItems =
    reviewStatus === 'any'
      ? items
      : items.filter((b) => b.status === reviewStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const truncateAddress = (address: string, length = 20) => {
    if (!address) return '—'
    if (address.length <= length) return address
    return `${address.slice(0, length)}...`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Beneficiary Management
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your trusted beneficiaries and wallet addresses
                </p>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  Beneficiary List
                </CardTitle>

                {/* Add / Edit Dialog */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      onClick={() => {
                        setEditMode(false)
                        resetForm()
                        setOpenDialog(true)
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Users
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-lg bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-gray-900">
                        {editMode ? 'Edit Beneficiary' : 'Add New Beneficiary'}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {editMode
                          ? 'Update the beneficiary details below.'
                          : 'Enter the details to add a new beneficiary.'}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        {[
                          { id: 'nick_name', label: 'Nick Name', icon: <User className="w-4 h-4 inline mr-2" />, type: 'text' },
                          { id: 'wallet_address', label: 'Wallet Address', icon: <Wallet className="w-4 h-4 inline mr-2" />, type: 'text' },
                          { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4 inline mr-2" />, type: 'email' },
                          { id: 'mobile', label: 'Mobile', icon: <Phone className="w-4 h-4 inline mr-2" />, type: 'text' },
                          { id: 'limit', label: 'Limit (Optional)', icon: <CreditCard className="w-4 h-4 inline mr-2" />, type: 'number' },
                        ].map(({ id, label, icon, type }) => (
                          <div key={id}>
                            <Label htmlFor={id} className="text-sm font-medium text-gray-700">
                              {icon}
                              {label}
                            </Label>
                            <Input
                              id={id}
                              name={id}
                              type={type}
                              placeholder={`Enter ${label.toLowerCase()}`}
                              value={(formData as any)[id]}
                              onChange={handleChange}
                              className="mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required={id !== 'limit'}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => resetForm()}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={addLoading || updateLoading}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {addLoading || updateLoading
                            ? editMode
                              ? 'Updating...'
                              : 'Adding...'
                            : editMode
                              ? 'Update'
                              : 'Add'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            {/* Only Table Reloads */}
            <CardContent className="p-0">
              {/* Status Tabs */}
              <div className="border-b bg-gray-50/50">
                <div className="flex space-x-0">
                  {REVIEW_STATUSES.map((status) => (
                    <Button
                      key={status}
                      variant="ghost"
                      className={`rounded-none px-6 py-4 text-base font-medium transition-all duration-200 ${reviewStatus === status
                        ? 'border-b-3 border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      onClick={() => {
                        setReviewStatus(status)
                        setCurrentPage(1)
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* ✅ Table Section (reloads only) */}
              <div className="p-6 transition-opacity duration-200" style={{ opacity: listLoading ? 0.5 : 1 }}>
                {listLoading ? (
                  <div className="flex justify-center items-center py-16 text-gray-600">
                    Loading beneficiaries...
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No beneficiaries found
                    </h3>
                    <p className="text-gray-500 text-base">
                      {reviewStatus === 'any'
                        ? 'Start by adding your first beneficiary'
                        : `No ${reviewStatus} beneficiaries at the moment`}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nickname</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Wallet</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Beneficiary ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mobile</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredItems.map((b, index) => (
                            <tr
                              key={b.beneficiary_id}
                              className={`transition-colors hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{b.nick_name || '—'}</div>
                                    <div className="text-sm text-gray-500">{b.email || '—'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                    {truncateAddress(b.wallet_address)}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(b.wallet_address)}
                                    className="h-6 w-6 p-0 hover:bg-gray-200"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                    {truncateAddress(b.beneficiary_id, 15)}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(b.beneficiary_id)}
                                    className="h-6 w-6 p-0 hover:bg-gray-200"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{b.mobile || '—'}</td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(b.status)} capitalize font-medium`}
                                >
                                  {getStatusIcon(b.status)}
                                  <span className="ml-1">{b.status || '—'}</span>
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditMode(true)
                                    setEditingBeneficiaryId(b.beneficiary_id)
                                    setEditingUserId(b.user_id)
                                    setFormData({
                                      nick_name: b.nick_name || '',
                                      wallet_address: b.wallet_address || '',
                                      mobile: b.mobile || '',
                                      email: b.email || '',
                                      limit: b.limit?.toString() || '',
                                    })
                                    setOpenDialog(true)
                                  }}
                                  className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 px-2">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </Button>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full font-medium">
                          Page {page} of {total_pages}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        disabled={currentPage === total_pages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
