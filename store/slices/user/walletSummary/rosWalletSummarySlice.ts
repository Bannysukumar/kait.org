import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface TransactionItem {
  description: string
  date_time: string
  amount: number
  transaction_type: string
  closing_balance: number
}

interface WalletSummaryState {
  items: TransactionItem[]
  total: number
  total_pages: number
  page: number
  loading: boolean
  error: string | null
}

const initialState: WalletSummaryState = {
  items: [],
  total: 0,
  total_pages: 1,
  page: 1,
  loading: false,
  error: null,
}

export const fetchRosWalletSummary = createAsyncThunk(
  'wallet/fetchSummary',
  async (
    {
      page = 1,
      page_size = 10,
      search = '',
    }: { page: number; page_size?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

      const response = await axios.get(
        `${baseURL}wallet/summary/ros?page=${page}&page_size=${page_size}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch')
    }
  }
)



const RosWalletSummarySlice = createSlice({
  name: 'walletSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRosWalletSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRosWalletSummary.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.total_pages = action.payload.total_pages
        state.page = action.payload.page
      })
      .addCase(fetchRosWalletSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default RosWalletSummarySlice.reducer
