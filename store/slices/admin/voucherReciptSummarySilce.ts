import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VoucherReceiptItem {
    description: string;
    voucher_description: string;
    voucher: string;
    pin: string;
    amount: number;
    used_amount: number;
    balance_amount: number;
    coin: number;
    is_redeemed: boolean;
}

interface VoucherReceiptSummaryState {
    items: VoucherReceiptItem[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    loading: boolean;
    error: string | null;
}

const initialState: VoucherReceiptSummaryState = {
    items: [],
    total: 0,
    page: 1,
    page_size: 10,
    total_pages: 1,
    loading: false,
    error: null,
};

export const fetchVoucherReceiptSummary = createAsyncThunk(
    "voucher/receiptSummary",
    async (
        {
            page = 1,
            page_size = 10,
            voucher_kind,
            emails,
            search
        }: {
            page?: number;
            page_size?: number;
            voucher_kind: string;
            emails?: string;   // MUST BE STRING
            search?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.get(`${baseURL}voucher/admin/receipt/summary`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    voucher_kind,
                    emails,   // now correctly a string param
                    search,
                    page,
                    page_size
                }
            });

            return response.data;

        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.detail ||
                "Failed to fetch voucher receipt summary"
            );
        }
    }
);


const voucherReceiptSummarySlice = createSlice({
    name: "voucherReceiptSummary",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVoucherReceiptSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVoucherReceiptSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.total = action.payload.total || 0;
                state.page = action.payload.page || 1;
                state.page_size = action.payload.page_size || 10;
                state.total_pages = action.payload.total_pages || 1;
            })
            .addCase(fetchVoucherReceiptSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default voucherReceiptSummarySlice.reducer;
