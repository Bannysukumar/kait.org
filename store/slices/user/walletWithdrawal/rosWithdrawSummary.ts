import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface SummaryItem {
  status: string
  date_time: string
  amount: number
  transaction: string
  transaction_link: string
  wallet: string
  beneficiary_nick_name: string
  description: string
}

interface RosSummaryState {
  items: SummaryItem[]
  loading: boolean
  error: string | null
  total: number
  page: number
  total_pages: number
}

const initialState: RosSummaryState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  total_pages: 0,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchRosWithdrawSummary = createAsyncThunk(
  'Ros/fetchWithdrawSummary',
  async (
    {
      review_status = 'any',
      page = 1,
      page_size = 10,
    }: { review_status?: string; page?: number; page_size?: number },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token') || ''
      const response = await axios.get(
        `${baseURL}withdraw/ros/summary?review_status=${review_status}&page=${page}&page_size=${page_size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Fetch failed')
    }
  },
)

const RosSummarySlice = createSlice({
  name: 'RosSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRosWithdrawSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRosWithdrawSummary.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.total_pages = action.payload.total_pages || 0
        state.error = null
      })
      .addCase(fetchRosWithdrawSummary.rejected, (state, action) => {
        state.loading = false
        const errorMsg = action.payload as string
        state.error = errorMsg === 'No records found' ? null : errorMsg
        if (errorMsg === 'No records found') {
          state.items = []
        }
      })
  },
})

export default RosSummarySlice.reducer
