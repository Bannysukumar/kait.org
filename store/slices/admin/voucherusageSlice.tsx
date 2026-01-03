import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface VoucherUsageItem {
  voucher: string;
  date_time: string;
  total_amount: number;
  used_amount: number;
  remaining_amount: number;
  description: string;
  coin: number;
  is_redeemed: boolean;
}

interface VoucherUsageSummaryState {
  items: VoucherUsageItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  loading: boolean;
  error: string | null;
}

const initialState: VoucherUsageSummaryState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 1,
  loading: false,
  error: null,
};

export const fetchVoucherUsageSummary = createAsyncThunk(
  "voucher/usageSummary",
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
      emails?: string;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get("token");

      const response = await axios.get(`${baseURL}voucher/admin/usage/summary`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          voucher_kind,
          emails,
          search,
          page,
          page_size
        },
      });

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch voucher usage summary"
      );
    }
  }
);


const voucherUsageSummarySlice = createSlice({
  name: "voucherUsageSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherUsageSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVoucherUsageSummary.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.detail) {
          state.items = [];
          state.error = action.payload.detail;
        } else {
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
          state.page = action.payload.page || 1;
          state.page_size = action.payload.page_size || 10;
          state.total_pages = action.payload.total_pages || 1;
          state.error = null;
        }
      })

      .addCase(fetchVoucherUsageSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default voucherUsageSummarySlice.reducer;
