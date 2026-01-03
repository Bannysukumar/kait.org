import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface StakeItem {
  user: string
  email: string
  contract: string
  invested: number
  invested_on: string
  description?: string
  completed: number
  plan: string
  remaining: number
  total: number
  ros_earned: number
  matured: boolean
}

interface StakeListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: StakeItem[]
}

interface StakeListState {
  data: StakeListResponse | null
  loading: boolean
  error: string | null
}

const initialState: StakeListState = {
  data: null,
  loading: false,
  error: null
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchStakeList = createAsyncThunk(
  'stake/list',
  async (
    params: { stake_status?: string; page?: number; page_size?: number },
    { rejectWithValue }
  ) => {
    try {
      const { stake_status = 'any', page = 1, page_size = 10 } = params
      const res = await axios.get(`${baseURL}stake/list`, {
        params: { stake_status, page, page_size },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return res.data as StakeListResponse
    } catch (err: any) {
      if (err.response?.status === 404) {
        return {
          total: 0,
          page: 1,
          page_size: 10,
          total_pages: 1,
          items: [],
        } as StakeListResponse
      }
      return rejectWithValue(err.response?.data || 'Error fetching stake list')
    }
  }
)

const stakeListSlice = createSlice({
  name: 'stakeList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStakeList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStakeList.fulfilled, (state, action: PayloadAction<StakeListResponse>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchStakeList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default stakeListSlice.reducer
