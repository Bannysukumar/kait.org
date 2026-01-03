'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { submitWalletSplit } from '@/store/slices/admin/walletSplitConfigSlice'
import { fetchSplitConfigList } from '@/store/slices/admin/walletSplitListSlice'
import { updateWalletSplit } from '@/store/slices/admin/walletSplitUpdateSlice'
import {
  Wallet,
  DollarSign,
  PiggyBank,
  TrendingUp,
  Gift,
  ShoppingCart,
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Percent,
  Calculator,
  Edit3,
  RotateCcw,
  Shuffle,
  Target,
  Info,
  X,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import toast from 'react-hot-toast'

const WalletSplitForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [showConfigList, setShowConfigList] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null)

  const {
    items,
    loading: listLoading,
    error: listError,
  } = useSelector((state: RootState) => state.walletSplitList)

  const {
    loading: submitLoading,
    error: submitError,
    success,
  } = useSelector((state: RootState) => state.WalletSplit)

  const {
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
  } = useSelector((state: RootState) => state.walletSplitUpdate)

  const [formData, setFormData] = useState({
    kait_wallet: 0,
    fiat_wallet: 0,
    income_wallet: 0,
    adhoc_wallet: 0,
    ros_wallet: 0,
    restake_wallet: 0,
    vpay_voucher_wallet: 0,
    ecommerce_voucher_wallet: 0,
    bonus_wallet: 0,
    super_wallet: 0,
  })

  const totalPercentage = Object.values(formData).reduce(
    (sum, value) => sum + value,
    0,
  )

  const walletConfig = {
    kait_wallet: {
      icon: <Wallet className="w-5 h-5" />,
      label: 'KAIT Wallet',
      color: 'from-purple-500 to-indigo-600',
      description: 'Main wallet for KAIT tokens',
    },
    fiat_wallet: {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Fiat Wallet',
      color: 'from-green-500 to-emerald-600',
      description: 'Traditional currency wallet',
    },
    income_wallet: {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Income Wallet',
      color: 'from-blue-500 to-cyan-600',
      description: 'Earnings and revenue wallet',
    },
    adhoc_wallet: {
      icon: <PiggyBank className="w-5 h-5" />,
      label: 'Adhoc Wallet',
      color: 'from-orange-500 to-red-600',
      description: 'Flexible purpose wallet',
    },
    ros_wallet: {
      icon: <Calculator className="w-5 h-5" />,
      label: 'ROS Wallet',
      color: 'from-teal-500 to-green-600',
      description: 'Return on Stake wallet',
    },
    restake_wallet: {
      icon: <RefreshCw className="w-5 h-5" />,
      label: 'Restake Wallet',
      color: 'from-pink-500 to-rose-600',
      description: 'Automatic restaking wallet',
    },
    vpay_voucher_wallet: {
      icon: <Gift className="w-5 h-5" />,
      label: 'VPay Voucher',
      color: 'from-indigo-500 to-purple-600',
      description: 'VPay voucher system',
    },
    ecommerce_voucher_wallet: {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: 'E-commerce Voucher',
      color: 'from-cyan-500 to-blue-600',
      description: 'E-commerce voucher wallet',
    },
       bonus_wallet: {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: 'Bonus Voucher',
      color: 'from-cyan-500 to-blue-600',
      description: 'Bonus voucher wallet',
    },
       super_wallet: {
      icon: <ShoppingCart className="w-5 h-5" />,
      label: 'Super Voucher',
      color: 'from-cyan-500 to-blue-600',
      description: 'Super voucher wallet',
    },
  }

  useEffect(() => {
    dispatch(fetchSplitConfigList())
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value))) // Clamp between 0-100
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (totalPercentage !== 100) return

    const payload = {
      ...formData,
      ...(isEditMode && editingConfigId
        ? { split_config_id: editingConfigId }
        : {}),
    }

    const action = isEditMode ? updateWalletSplit : submitWalletSplit

    dispatch(action(payload as any)).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') {
        const message =
          res.payload?.detail ||
          (isEditMode
            ? 'Configuration updated successfully!'
            : 'Configuration saved successfully!')
        toast.success(message)
      } else {
        const errorMessage =
          res.payload?.detail || res.payload || 'Something went wrong.'
        toast.error(errorMessage)
      }

      dispatch(fetchSplitConfigList())
      resetForm()
      setIsEditMode(false)
      setEditingConfigId(null)
    })
  }

  const resetForm = () => {
    setFormData({
      kait_wallet: 0,
      fiat_wallet: 0,
      income_wallet: 0,
      adhoc_wallet: 0,
      ros_wallet: 0,
      restake_wallet: 0,
      vpay_voucher_wallet: 0,
      ecommerce_voucher_wallet: 0,
      bonus_wallet: 0,
      super_wallet: 0,
    })
  }

  const distributeEvenly = () => {
    const evenSplit = Math.floor(100 / 8)
    const remainder = 100 - evenSplit * 8

    const newFormData = Object.keys(formData).reduce(
      (acc, key, index) => {
        acc[key as keyof typeof formData] =
          evenSplit + (index < remainder ? 1 : 0)
        return acc
      },
      {} as typeof formData,
    )

    setFormData(newFormData)
  }

  const cancelEdit = () => {
    setIsEditMode(false)
    setEditingConfigId(null)
    resetForm()
  }

  const editConfiguration = (item: any) => {
    setFormData({
      kait_wallet: item.value.kait_wallet ?? 0,
      fiat_wallet: item.value.fiat_wallet ?? 0,
      income_wallet: item.value.income_wallet ?? 0,
      adhoc_wallet: item.value.adhoc_wallet ?? 0,
      ros_wallet: item.value.ros_wallet ?? 0,
      restake_wallet: item.value.restake_wallet ?? 0,
      vpay_voucher_wallet: item.value.vpay_voucher_wallet ?? 0,
      ecommerce_voucher_wallet: item.value.ecommerce_voucher_wallet ?? 0,
      bonus_wallet: item.value.bonus_wallet ?? 0,
      super_wallet: item.value.bonus_wallet ?? 0,
    })
    setEditingConfigId(item.id)
    setIsEditMode(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Wallet Split Configuration
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Configure how funds are distributed across different wallet types.
            Ensure the total percentage equals 100% for optimal allocation.
          </p>

          {/* Edit Mode Indicator */}
          {isEditMode && (
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full">
              <Edit3 className="w-4 h-4" />
              <span className="font-medium">Editing Configuration</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEdit}
                className="h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {(submitError || updateError) && (
          <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {submitError || updateError}
            </AlertDescription>
          </Alert>
        )}

        {(success || updateSuccess) && (
          <Alert className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              {isEditMode ? 'Configuration updated' : 'Configuration saved'}{' '}
              successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Main Configuration Form */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Total Percentage Indicator */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Allocation
                  </h3>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    totalPercentage === 100
                      ? 'text-green-600'
                      : totalPercentage > 100
                        ? 'text-red-600'
                        : 'text-orange-600'
                  }`}
                >
                  {totalPercentage}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-500 ${
                    totalPercentage === 100
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : totalPercentage > 100
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-orange-500 to-yellow-600'
                  }`}
                  style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      totalPercentage === 100
                        ? 'bg-green-500'
                        : totalPercentage > 100
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {totalPercentage === 100
                      ? 'Perfect allocation - Ready to save!'
                      : totalPercentage > 100
                        ? 'Over-allocated - Please reduce percentages'
                        : 'Under-allocated - Add more percentages'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={distributeEvenly}
                    className="text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  >
                    <Shuffle className="w-3 h-3 mr-1" />
                    Auto-distribute
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetForm}
                    className="text-xs hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(formData).map(([key, value]) => {
                const config = walletConfig[key as keyof typeof walletConfig]
                return (
                  <div key={key} className="group">
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div
                        className={`bg-gradient-to-r ${config.color} p-4 text-white`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                              {config.label}
                            </h3>
                            <p className="text-xs opacity-90 truncate">
                              {config.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <Label
                          htmlFor={key}
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Allocation Percentage
                        </Label>
                        <div className="relative">
                          <Input
                            id={key}
                            type="number"
                            name={key}
                            value={value}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="pr-8 text-lg font-semibold text-center border-2 focus:border-indigo-500 dark:focus:border-indigo-400"
                            placeholder="0"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Percent className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Visual Percentage Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${config.color} transition-all duration-300`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>

                        {/* Percentage Display */}
                        <div className="text-center">
                          <span
                            className={`text-sm font-medium ${
                              value > 0
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400'
                            }`}
                          >
                            {value}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="px-8 py-3 text-lg font-semibold"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel Edit
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  submitLoading || updateLoading || totalPercentage !== 100
                }
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading || updateLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {isEditMode ? 'Update Configuration' : 'Save Configuration'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configuration History</span>
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowConfigList(!showConfigList)}
              className="flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            >
              {showConfigList ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{showConfigList ? 'Hide' : 'Show'} History</span>
            </Button>
          </div>

          {showConfigList && (
            <div className="space-y-4">
              {listLoading && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Loading configurations...
                  </span>
                </div>
              )}

              {listError && (
                <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {listError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Configuration #{index + 1}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {item.id}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editConfiguration(item)}
                        className="flex items-center space-x-2 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(item.value).map(([key, val]) => {
                        const config =
                          walletConfig[key as keyof typeof walletConfig]
                        return (
                          <div
                            key={key}
                            className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600"
                          >
                            <div
                              className={`p-1 rounded bg-gradient-to-r ${config?.color || 'from-gray-400 to-gray-500'}`}
                            >
                              {config?.icon || (
                                <Wallet className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
                                {config?.label || key}
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {val}%
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && !listLoading && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Settings className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No configurations found
                  </h3>
                  <p className="text-sm">
                    Create your first wallet split configuration above.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default WalletSplitForm
