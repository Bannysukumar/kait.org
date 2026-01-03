'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchStakePlans,
  createStakePlan,
  updateStakePlan,
} from '@/store/slices/admin/stakePlansSlice'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'
import { Plus, Edit2, TrendingUp, DollarSign, Clock, Zap, Check, X } from 'lucide-react'

interface FormState {
  plan_id?: string
  plan_name: string
  description: string
  min_amount: number
  lock_in_period: number
  return_on_staking: number
  ros_pay_out_frenquency: string
  ros_wallet: string
  capital_pay_out_frequency: string
  capital_wallet: string
  plan_status: boolean
  type: string
}

const initialFormState: FormState = {
  plan_name: '',
  description: '',
  min_amount: 0,
  lock_in_period: 0,
  return_on_staking: 0,
  ros_pay_out_frenquency: 'daily',
  ros_wallet: '',
  capital_pay_out_frequency: 'daily',
  capital_wallet: '',
  plan_status: true,
  type: 'stake',
}

export default function StakePlansAdmin() {
  const dispatch = useAppDispatch()
  const { stakePlans, loading, error } = useAppSelector((state) => state.stakePlans)
  const { data: dropdownOptions } = useAppSelector((state) => state.dropDownOptions)
  const formRef = useRef<HTMLDivElement | null>(null)

  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  useEffect(() => {
    dispatch(fetchStakePlans())
    dispatch(fetchDropdownOptions())
  }, [dispatch])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === 'checkbox' && 'checked' in e.target
        ? (e.target as HTMLInputElement).checked
        : value

    setFormState((prev) => ({
      ...prev,
      [name]:
        type === 'number' || ['min_amount', 'lock_in_period', 'return_on_staking'].includes(name)
          ? Number(newValue)
          : newValue,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formState.plan_name.trim()) newErrors.plan_name = 'Plan Name is required'
    if (!formState.description.trim()) newErrors.description = 'Description is required'
    if (formState.min_amount <= 0) newErrors.min_amount = 'Min amount must be greater than 0'
    if (formState.lock_in_period <= 0) newErrors.lock_in_period = 'Lock-in period is required'
    if (formState.return_on_staking <= 0) newErrors.return_on_staking = 'Return on staking is required'
    if (!formState.ros_wallet) newErrors.ros_wallet = 'Select a ROS Wallet'
    if (!formState.capital_wallet) newErrors.capital_wallet = 'Select a Capital Wallet'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting.')
      return
    }

    const payload = { ...formState }

    try {
      if (editingPlanId) {
        await dispatch(updateStakePlan({ plan_id: editingPlanId, ...payload })).unwrap()
        toast.success('Stake plan updated successfully!')
      } else {
        await dispatch(createStakePlan(payload)).unwrap()
        toast.success('Stake plan created successfully!')
      }

      setFormState(initialFormState)
      setEditingPlanId(null)
      setErrors({})
      dispatch(fetchStakePlans())
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const handleEdit = (plan: any) => {
    setEditingPlanId(plan.plan_id)
    setFormState({
      plan_name: plan.name || '',
      description: plan.description || '',
      min_amount: plan.min_amount ?? 0,
      lock_in_period: plan.lock_in_period ?? 0,
      return_on_staking: plan.return_on_staking ?? 0,
      ros_pay_out_frenquency: plan.ros_pay_out_frenquency || 'daily',
      ros_wallet: plan.ros_pay_out_wallet || '',
      capital_pay_out_frequency: plan.capital_pay_out_frequency || 'daily',
      capital_wallet: plan.capital_pay_out_wallet || '',
      plan_status: plan.status ?? true,
      type: plan.type || 'stake',
    })

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleCancel = () => {
    setFormState(initialFormState)
    setEditingPlanId(null)
    setErrors({})
  }

  if (loading && stakePlans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading stake plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className=" pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-white" />
          Stake Plans Management
        </h1>
        <p className="mt-2 text-white/50">Create and manage staking investment plans for your platform</p>
      </div>

      {/* Form Section */}
      <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={`px-6 py-4 ${editingPlanId ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {editingPlanId ? (
              <>
                <Edit2 className="w-5 h-5" />
                Edit Stake Plan
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create New Stake Plan
              </>
            )}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <X className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="plan_name"
              label="Plan Name"
              value={formState.plan_name}
              onChange={handleChange}
              error={errors.plan_name}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <InputField
              name="description"
              label="Description"
              value={formState.description}
              onChange={handleChange}
              error={errors.description}
              icon={<Zap className="w-4 h-4" />}
            />
            <InputField
              name="min_amount"
              // type="number"
              label="Minimum Amount"
              value={formState.min_amount}
              onChange={handleChange}
              error={errors.min_amount}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <InputField
              name="lock_in_period"
              // type="number"
              label="Lock-in Period (years)"
              value={formState.lock_in_period}
              onChange={handleChange}
              error={errors.lock_in_period}
              icon={<Clock className="w-4 h-4" />}
            />
            <InputField
              name="return_on_staking"
              // type="number"
              label="Return on Staking (%)"
              value={formState.return_on_staking}
              onChange={handleChange}
              error={errors.return_on_staking}
              icon={<TrendingUp className="w-4 h-4" />}
            />

            {dropdownOptions ? (
              <>
                <SelectField
                  name="ros_pay_out_frenquency"
                  value={formState.ros_pay_out_frenquency}
                  onChange={handleChange}
                  label="ROS Payout Frequency"
                  options={dropdownOptions.payout_frequencies}
                  error={errors.ros_pay_out_frenquency}
                />
                <SelectField
                  name="capital_pay_out_frequency"
                  value={formState.capital_pay_out_frequency}
                  onChange={handleChange}
                  label="Capital Payout Frequency"
                  options={dropdownOptions.payout_frequencies}
                  error={errors.capital_pay_out_frequency}
                />
                <SelectField
                  name="ros_wallet"
                  value={formState.ros_wallet}
                  onChange={handleChange}
                  label="ROS Wallet Type"
                  options={dropdownOptions.ros_pay_wallet_kinds}
                  error={errors.ros_wallet}
                />
                <SelectField
                  name="capital_wallet"
                  value={formState.capital_wallet}
                  onChange={handleChange}
                  label="Capital Wallet Type"
                  options={dropdownOptions.capital_pay_wallet_kinds}
                  error={errors.capital_wallet}
                />
                <SelectField
                  name="type"
                  value={formState.type}
                  onChange={handleChange}
                  label="Plan Type"
                  options={[
                    { id: 'stake', value: 'Stake' },
                    { id: 'restake', value: 'ReStake' },
                    { id: 'combo', value: 'Combo' },
                  ]}
                />
              </>
            ) : (
              <div className="col-span-full flex items-center justify-center h-12 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Loading payout options...</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Plan Status</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  formState.plan_status
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {formState.plan_status ? 'Active' : 'Inactive'}
                </span>
                <Switch
                  checked={formState.plan_status}
                  onCheckedChange={(value) =>
                    setFormState((prev) => ({ ...prev, plan_status: value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                editingPlanId
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {editingPlanId ? 'Update Plan' : 'Create Plan'}
                </>
              )}
            </button>

            {editingPlanId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stakes Plans List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-white" />
            Active Stake Plans
            <span className="ml-2 px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
              {stakePlans.length}
            </span>
          </h2>
        </div>

        {stakePlans.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stake plans yet</h3>
            <p className="text-gray-600">Create your first stake plan to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakePlans.map((plan) => (
              <div
                key={plan.plan_id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`px-6 py-4 border-b border-gray-200 ${
                  plan.type === 'stake' ? 'bg-blue-50' : plan.type === 'restake' ? 'bg-purple-50' : 'bg-teal-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{plan.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      plan.type === 'stake' ? 'bg-blue-100 text-blue-700' :
                      plan.type === 'restake' ? 'bg-purple-100 text-purple-700' :
                      'bg-teal-100 text-teal-700'
                    }`}>
                      {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                      <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600">Min Amount</p>
                        <p className="font-semibold text-gray-900 text-sm">{plan.min_amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600">Return</p>
                        <p className="font-semibold text-gray-900 text-sm">{plan.return_on_staking}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600">Lock-in</p>
                        <p className="font-semibold text-gray-900 text-sm">{plan.lock_in_period}y</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-gray-300">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        plan.plan_status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {plan.plan_status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2"><span className="font-semibold">Capital:</span> {plan.capital_pay_out_frequency}</p>
                    <p className="text-xs text-gray-600"><span className="font-semibold">ROS:</span> {plan.ros_pay_out_frenquency}</p>
                  </div>

                  <button
                    onClick={() => handleEdit(plan)}
                    className="w-full mt-3 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface InputFieldProps {
  name: string
  value: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  type?: string
  error?: string
  icon?: React.ReactNode
}

function InputField({ name, value, onChange, label, type = 'text', error, icon }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {icon && <span className="text-gray-500">{icon}</span>}
        {label}
      </label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        className={`px-4 py-2.5 ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'} transition-all`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

interface SelectFieldProps {
  name: string
  value: any
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  label: string
  options: any[]
  error?: string
}

function SelectField({ name, value, onChange, label, options, error }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white ${
          error ? 'border-red-500' : ''
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>
            {opt.value}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}
