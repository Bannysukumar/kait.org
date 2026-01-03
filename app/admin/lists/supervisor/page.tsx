"use client"

import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { Plus, Edit2, Users, Mail, Phone, User, Lock, Check, X } from "lucide-react"

import { AppDispatch, RootState } from "@/store/store"
import { addSupervisor, resetAddSupervisorState } from "@/store/slices/admin/supervisorAddSlice"
import { fetchSupervisorList } from "@/store/slices/admin/supervisorListSlice"
import { updateSupervisor, resetSupervisorUpdate } from "@/store/slices/admin/supervisorUpdateSlice"

export default function SupervisorManagement() {
    const dispatch = useDispatch<AppDispatch>()
    const formRef = useRef<HTMLDivElement | null>(null)

    // Add
    const { loading, error, success } = useSelector((state: RootState) => state.supervisorAdd)

    // Update
    const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector((state: RootState) => state.supervisorUpdate)

    // List
    const { list: supervisors, isLoading: listLoading, error: listError } = useSelector((state: RootState) => state.SuperVisorList)

    const [showForm, setShowForm] = useState<"create" | "edit" | null>(null)
    const [editSupervisor, setEditSupervisor] = useState<any | null>(null)
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        gender: "male" as "male" | "female",
        mobile: "",
        email: "",
        password: "",
        confirm_password: "",
    })

    // Fetch supervisor list
    useEffect(() => {
        dispatch(fetchSupervisorList({ page: 1, page_size: 10 }))
    }, [dispatch])

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Prefill edit form
    useEffect(() => {
        if (editSupervisor) {
            setForm({
                first_name: editSupervisor.first_name,
                last_name: editSupervisor.last_name,
                gender: editSupervisor.gender,
                mobile: editSupervisor.mobile,
                email: editSupervisor.email,
                password: "",
                confirm_password: "",
            })
            setShowForm("edit")
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [editSupervisor])

    const resetForm = () => {
        setForm({
            first_name: "",
            last_name: "",
            gender: "male",
            mobile: "",
            email: "",
            password: "",
            confirm_password: "",
        })
        setEditSupervisor(null)
        setShowForm(null)
    }

    // Handle Add
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password !== form.confirm_password) {
            toast.error("Passwords do not match")
            return
        }
        dispatch(addSupervisor(form))
    }

    // Handle Update
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editSupervisor) return

        if (!form.password || !form.confirm_password) {
            toast.error("Password is required for update")
            return
        }
        if (form.password !== form.confirm_password) {
            toast.error("Passwords do not match")
            return
        }

        dispatch(updateSupervisor({
            user_id: editSupervisor.user_id,
            first_name: form.first_name,
            last_name: form.last_name,
            gender: form.gender,
            mobile: form.mobile,
            email: form.email,
            password: form.password,
            confirm_password: form.confirm_password,
            supervisor_status: editSupervisor.status,
        }))
    }

    // Add success
    useEffect(() => {
        if (success) {
            toast.success("Supervisor added successfully")
            dispatch(fetchSupervisorList({ page: 1, page_size: 10 }))
            dispatch(resetAddSupervisorState())
            resetForm()
        }
    }, [success, dispatch])

    // Update success
    useEffect(() => {
        if (updateSuccess) {
            toast.success("Supervisor updated successfully")
            dispatch(fetchSupervisorList({ page: 1, page_size: 10 }))
            dispatch(resetSupervisorUpdate())
            resetForm()
        }
    }, [updateSuccess, dispatch])

    // Show errors
    useEffect(() => {
        if (error) toast.error(error)
        if (updateError) toast.error(updateError)
    }, [error, updateError])

    if (listLoading && supervisors.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading supervisors...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="pb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-white" />
                    Supervisor Management
                </h1>
                <p className="mt-2 text-white/50">Manage platform supervisors and their access</p>
            </div>

            {/* Errors */}
            {listError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3">
                    <X className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{listError}</span>
                </div>
            )}

            {/* Form Section */}
            {showForm && (
                <div ref={formRef} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className={`px-6 py-4 ${showForm === "create"
                        ? 'bg-gradient-to-r from-blue-500 to-purple-700'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600'
                        }`}>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {showForm === "create" ? (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Add New Supervisor
                                </>
                            ) : (
                                <>
                                    <Edit2 className="w-5 h-5" />
                                    Edit Supervisor
                                </>
                            )}
                        </h2>
                    </div>

                    <form
                        onSubmit={showForm === "create" ? handleSubmit : handleUpdate}
                        className="p-6 space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <User className="w-4 h-4 text-gray-500" />
                                    First Name
                                </label>
                                <input
                                    name="first_name"
                                    placeholder="Enter first name"
                                    onChange={handleChange}
                                    value={form.first_name}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <User className="w-4 h-4 text-gray-500" />
                                    Last Name
                                </label>
                                <input
                                    name="last_name"
                                    placeholder="Enter last name"
                                    onChange={handleChange}
                                    value={form.last_name}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    onChange={handleChange}
                                    value={form.gender}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    Mobile
                                </label>
                                <input
                                    name="mobile"
                                    placeholder="Enter mobile number"
                                    onChange={handleChange}
                                    value={form.mobile}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    onChange={handleChange}
                                    value={form.email}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    onChange={handleChange}
                                    value={form.password}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm password"
                                    onChange={handleChange}
                                    value={form.confirm_password}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Status Toggle for Edit */}
                        {showForm === "edit" && editSupervisor && (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-700">Supervisor Status</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${editSupervisor.status
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {editSupervisor.status ? 'Active' : 'Inactive'}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={editSupervisor.status}
                                        onChange={(e) => setEditSupervisor({ ...editSupervisor, status: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading || updateLoading}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${showForm === "create"
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/30'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {(loading || updateLoading) ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        {showForm === "create" ? "Add Supervisor" : "Update Supervisor"}
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm("create")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Supervisor
                </button>
            )}

            {/* Supervisors List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Active Supervisors
                    <span className="ml-2 px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {supervisors.length}
                    </span>
                </h2>

                {supervisors.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No supervisors yet</h3>
                        <p className="text-gray-600">Create your first supervisor to get started</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mobile</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gender</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {supervisors.map((sup) => (
                                        <tr key={sup.user_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{sup.first_name} {sup.last_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{sup.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{sup.mobile}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{sup.gender}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${sup.status
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {sup.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setEditSupervisor(sup)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
