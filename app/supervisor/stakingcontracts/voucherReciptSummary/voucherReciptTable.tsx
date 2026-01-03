'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchVoucherReceiptSummary, VoucherReceiptItem } from '@/store/slices/admin/voucherReciptSummarySilce'
import { fetchDropdownOptions } from '@/store/slices/dropdownOptions'
import { Select, MenuItem, TextField } from '@mui/material'
import { Search, Filter, ChevronLeft, ChevronRight, Wallet } from "lucide-react"

export default function VoucherReceiptTable() {
    const dispatch = useDispatch<AppDispatch>()

    const [voucherKind, setVoucherKind] = useState("")
    const [emailFilter, setEmailFilter] = useState("")
    const [search, setSearch] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const { data: dropdowns } = useSelector((state: RootState) => state.dropDownOptions)
    const { items, loading, error, total, total_pages } = useSelector(
        (state: RootState) => state.voucherReciptSummary
    )

    const [currentPage, setCurrentPage] = useState(1)

    // Fetch dropdown options
    useEffect(() => {
        dispatch(fetchDropdownOptions())
    }, [dispatch])

    // Set default voucher type
    useEffect(() => {
        if (!voucherKind && dropdowns?.voucher_kinds?.length) {
            setVoucherKind(String(dropdowns.voucher_kinds[0].value))
        }
    }, [dropdowns, voucherKind])

    // Fetch API when filters change
    useEffect(() => {
        if (!voucherKind) return

        const emailsParam = emailFilter || undefined;

        dispatch(
            fetchVoucherReceiptSummary({
                voucher_kind: voucherKind,
                emails: emailsParam,
                search,
                page: currentPage,
                page_size: rowsPerPage
            })
        )

    }, [dispatch, voucherKind, currentPage, emailFilter, search, rowsPerPage])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= total_pages) setCurrentPage(newPage)
    }

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 rounded-2xl shadow-xl text-white flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                        <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Voucher Receipt Summary</h1>
                        <p className="text-white/80 text-sm">Track redemption and receipt transactions</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search description..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full pl-11 pr-4 py-2 rounded-xl bg-white/20 backdrop-blur border border-white/30 placeholder-white/60 text-white focus:ring-2 focus:ring-white/50 outline-none"
                    />
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="p-4 mb-6 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center gap-6">

                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-700">Filters</span>
                </div>

                {/* Voucher Kind */}
                <Select
                    value={voucherKind}
                    onChange={(e) => {
                        setVoucherKind(e.target.value as string)
                        setCurrentPage(1)
                    }}
                    sx={{
                        minWidth: 200,
                        background: "white",
                        borderRadius: "10px",
                    }}
                >
                    {dropdowns?.voucher_kinds?.map((opt: any) => (
                        <MenuItem key={opt.id} value={String(opt.value)}>
                            {opt.value}
                        </MenuItem>
                    ))}
                </Select>

                {/* Email Filter */}
                <TextField
                    size="small"
                    label="Filter by Email"
                    value={emailFilter}
                    onChange={(e) => {
                        setEmailFilter(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="bg-white rounded-lg"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="bg-gray-100 text-gray-700 text-sm">
                        <tr>
                            {["Voucher", "Voucher Description", "Description", "Amount", "Used", "Balance", "Coin", "Redeemed"]
                                .map((h) => (
                                    <th key={h} className="p-3 border-b">{h}</th>
                                ))}
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item: VoucherReceiptItem, idx) => (
                            <tr key={idx} className="hover:bg-indigo-50/50 transition">
                                <td className="p-3 border-b">{item.voucher}</td>
                                <td className="p-3 border-b">{item.voucher_description}</td>
                                <td className="p-3 border-b">{item.description}</td>
                                <td className="p-3 border-b font-semibold">{item.amount}</td>
                                <td className="p-3 border-b text-blue-600">{item.used_amount}</td>
                                <td className="p-3 border-b text-green-600">{item.balance_amount}</td>
                                <td className="p-3 border-b">{item.coin}</td>
                                <td className="p-3 border-b">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                        ${item.is_redeemed ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"}`}>
                                        {item.is_redeemed ? "Yes" : "No"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION — Your Design */}
            {total > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t mt-4 rounded-xl shadow flex flex-col lg:flex-row items-center justify-between gap-4">

                    {/* Info */}
                    <div className="text-sm text-gray-600 text-center lg:text-left">
                        Page <strong>{currentPage}</strong> of <strong>{total_pages}</strong> • {total} total transactions
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">

                        {/* Previous */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className={`flex items-center px-3 py-1 rounded-lg border text-sm transition-all ${currentPage <= 1
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:border-purple-600 hover:text-purple-600"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                        </button>

                        {/* Page Numbers */}
                        {(() => {
                            const pages: (number | string)[] = []
                            if (total_pages <= 7) {
                                for (let i = 1; i <= total_pages; i++) pages.push(i)
                            } else {
                                pages.push(1)

                                if (currentPage > 4) pages.push("...")

                                const start = Math.max(2, currentPage - 2)
                                const end = Math.min(total_pages - 1, currentPage + 2)

                                for (let i = start; i <= end; i++) pages.push(i)

                                if (currentPage < total_pages - 3) pages.push("...")
                                pages.push(total_pages)
                            }

                            return pages.map((p, idx) =>
                                p === "..." ? (
                                    <span key={`e-${idx}`} className="px-2 text-gray-500">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={`p-${p}`}
                                        onClick={() => handlePageChange(p as number)}
                                        className={`min-w-[32px] px-3 py-1 rounded-md text-sm transition-all ${currentPage === p
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )
                        })()}

                        {/* Next */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= total_pages}
                            className={`flex items-center px-3 py-1 rounded-lg border text-sm transition-all ${currentPage >= total_pages
                                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                : "hover:border-purple-600 hover:text-purple-600"
                                }`}
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* Rows Per Page */}
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Rows per page:</span>
                        <select
                            className="border rounded-md px-2 py-1 text-sm focus:outline-none"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value))
                                setCurrentPage(1)
                            }}
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            )}
        </div>
    )
}
