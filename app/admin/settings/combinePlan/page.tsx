'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailsComboList } from '@/store/slices/admin/detailesComboListSlice'
import { fetchComboOptions } from '@/store/slices/admin/comboPlanOptionSlice'
import { createCombo } from '@/store/slices/admin/createComboPlanSlice'
import { updateCombo, clearUpdateState } from '@/store/slices/admin/updateComboPlanSlice'
import type { RootState, AppDispatch } from '@/store/store'
import { Edit2, Plus, Check, X, Package, Clock, DollarSign, FileText, Layers } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PlanComboList() {
    const dispatch = useDispatch<AppDispatch>()

    const detailState = useSelector((state: RootState) => state.DetailesComboList)
    const comboState = useSelector((state: RootState) => state.comboOption)
    const createState = useSelector((state: RootState) => state.CreateComboPlan)
    const updateState = useSelector((state: RootState) => state.UpdateComboPlan)

    const [planName, setPlanName] = useState('')
    const [description, setDescription] = useState('')
    const [minAmount, setMinAmount] = useState(0)
    const [lipy, setLipy] = useState(0)
    const [selectedPlans, setSelectedPlans] = useState<string[]>([])
    const [planStatus, setPlanStatus] = useState(false)
    const [editingComboId, setEditingComboId] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchDetailsComboList())
        dispatch(fetchComboOptions())
    }, [dispatch])

    useEffect(() => {
        if (createState.success) {
            toast.success(createState.success);
            setPlanName('');
            setDescription('');
            setMinAmount(0);
            setLipy(0);
            setSelectedPlans([]);
        }

        if (createState.error) {
            toast.error(createState.error);
        }

        if (updateState.success) {
            toast.success(updateState.success);
            handleCancelEdit();
            dispatch(clearUpdateState());
        }

        if (updateState.error) {
            toast.error(updateState.error);
            dispatch(clearUpdateState());
        }
    }, [createState.success, createState.error, updateState.success, updateState.error, dispatch]);



    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!planName || !description || !minAmount || !lipy || selectedPlans.length === 0) return
        dispatch(createCombo({ plan_name: planName, description, min_amount: minAmount, lipy, plan_ids: selectedPlans }))
    }

    const handlePlanSelect = (planId: string) => {
        setSelectedPlans((prev) => {
            const newSelected = prev.includes(planId)
                ? prev.filter((id) => id !== planId)
                : [...prev, planId];

            const selectedPlanDetails = comboState.items.filter(plan => newSelected.includes(plan.plan_id));

            const totalMinAmount = selectedPlanDetails.reduce((sum, plan) => sum + plan.min_amount, 0);
            setMinAmount(totalMinAmount);

            const lockPeriods = selectedPlanDetails.map(plan => plan.lock_in_period);
            const uniquePeriods = Array.from(new Set(lockPeriods));
            const displayLipy = uniquePeriods.length === 1 ? uniquePeriods[0] : Math.max(...lockPeriods);
            setLipy(displayLipy);

            return newSelected;
        });
    };


    const handleEditClick = (combo: any) => {
        setEditingComboId(combo.plan_combo_id)
        setPlanName(combo.name)
        setDescription(combo.description)
        setMinAmount(combo.min_amount)
        setLipy(combo.lock_in_period)
        setSelectedPlans(combo.plans.map((p: any) => p.plan_id))
        setPlanStatus(combo.plan_status || false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setEditingComboId(null)
        setPlanName('')
        setDescription('')
        setMinAmount(0)
        setLipy(0)
        setSelectedPlans([])
        setPlanStatus(false)
    }

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingComboId || !planName || !description || !minAmount || !lipy || selectedPlans.length === 0) return
        dispatch(updateCombo({
            plan_combo_id: editingComboId,
            plan_name: planName,
            description,
            min_amount: minAmount,
            lipy,
            plan_ids: selectedPlans,
            plan_status: planStatus
        }))
    }

    if (detailState.loading || comboState.loading || createState.loading || updateState.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        )
    }



    return (
        <div className="max-w-7xl bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className=" pb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Layers className="w-8 h-8  text-white" />
                    Plan Combo Management
                </h1>
                <p className="mt-2 text-white/50">Create and manage combination plans for your customers</p>
            </div>


            {/* Create / Update Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`px-6 py-4 ${editingComboId ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {editingComboId ? (
                            <>
                                <Edit2 className="w-5 h-5" />
                                Update Plan Combo
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Create New Plan Combo
                            </>
                        )}
                    </h2>
                </div>

                <form
                    onSubmit={editingComboId ? handleUpdateSubmit : handleCreateSubmit}
                    className="p-6 space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="planName">
                                <Package className="w-4 h-4 text-gray-500" />
                                Plan Combo Name
                            </label>
                            <input
                                id="planName"
                                type="text"
                                placeholder="e.g., Premium Investment Bundle"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700" htmlFor="description">
                                <FileText className="w-4 h-4 text-gray-500" />
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                placeholder="Brief description of the combo"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                Minimum Amount
                            </label>
                            <input
                                type="number"
                                value={minAmount}
                                readOnly
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Clock className="w-4 h-4 text-gray-500" />
                                Lock-in Period (years)
                            </label>
                            <input
                                type="number"
                                value={lipy}
                                readOnly
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                    </div>

                    {/* Plan Selection */}
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-500" />
                            Select Plans to Include ({selectedPlans.length} selected)
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                            {comboState.items.map((plan) => (
                                <label
                                    key={plan.plan_id}
                                    className={`relative flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlans.includes(plan.plan_id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={plan.plan_id}
                                        checked={selectedPlans.includes(plan.plan_id)}
                                        onChange={() => handlePlanSelect(plan.plan_id)}
                                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                Min: {plan.min_amount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {plan.lock_in_period} years
                                            </span>
                                        </div>
                                    </div>
                                    {selectedPlans.includes(plan.plan_id) && (
                                        <div className="absolute top-2 right-2">
                                            <Check className="w-5 h-5 text-blue-600" />
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Plan Status Toggle for Update */}
                    {editingComboId && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                id="planStatus"
                                checked={planStatus}
                                onChange={() => setPlanStatus(prev => !prev)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="planStatus" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Active Status
                            </label>
                            <span className={`ml-auto px-3 py-1 text-xs font-semibold rounded-full ${planStatus ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                {planStatus ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${editingComboId
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30'
                                }`}
                        >
                            {editingComboId ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Update Combo
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Create Combo
                                </>
                            )}
                        </button>

                        {editingComboId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Plan Combos List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Package className="w-6 h-6 text-white" />
                    Active Plan Combos
                    <span className="ml-2 px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {detailState.items.length}
                    </span>
                </h2>

                {detailState.items.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No plan combos yet</h3>
                        <p className="text-gray-600">Create your first plan combo to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {detailState.items.map((combo) => (
                            <div
                                key={combo.plan_combo_id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{combo.name}</h3>
                                            <p className="text-sm text-gray-600">{combo.description}</p>


                                        </div>
                                        <button
                                            onClick={() => handleEditClick(combo)}
                                            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit combo"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-2 bg-green-50 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Min Amount</p>
                                                <p className="font-semibold text-gray-900">{combo.min_amount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Lock-in Period</p>
                                                <p className="font-semibold text-gray-900">{combo.lock_in_period} years</p>
                                            </div>
                                               <div className="flex items-center gap-2 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${combo.status ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                                        }`}
                                                >
                                                    {combo.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Layers className="w-4 h-4" />
                                            Included Plans ({combo.plans.length})
                                        </h4>
                                        <ul className="space-y-2">
                                            {combo.plans.map((plan) => (
                                                <li
                                                    key={plan.plan_id}
                                                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                                                >
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm">{plan.name}</p>
                                                        <p className="text-xs text-gray-600 mt-0.5">{plan.description}</p>
                                                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-3 h-3" />
                                                                {plan.min_amount}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {plan.lock_in_period} years
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Standalone Plans */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-white" />
                    Available Standalone Plans
                    <span className="ml-2 px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-700 rounded-full">
                        {comboState.items.length}
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {comboState.items.map((plan) => (
                        <div
                            key={plan.plan_id}
                            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{plan.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-700">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">{plan.min_amount}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-700">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">{plan.lock_in_period} years</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
