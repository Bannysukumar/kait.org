import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface StakeItem {
  user: string
  email: string
  contract: string
  invested: number
  invested_on: string
  plan: string
  completed: number
  remaining: number
  total: number
  ros_earned: number
  matured: boolean
}

export interface StakeListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: StakeItem[]
}

interface StakeListState {
  items: StakeItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: StakeListState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  loading: false,
  error: null,
}

export const fetchStakeList = createAsyncThunk<
  StakeListResponse,
  { stake_status?: string; search?: string; page?: number; page_size?: number },
  { rejectValue: string }
>('stake/fetchList', async (params, { rejectWithValue }) => {
  try {
    const token =
      (typeof window !== 'undefined' && localStorage.getItem('token')) ||
      (typeof document !== 'undefined' ? document.cookie : '')

    const res = await axios.get<StakeListResponse>(`${baseURL}stake/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      params: {
        stake_status: params.stake_status ?? 'any',
        search: params.search ?? '',
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    })

    return res.data
  } catch (err: any) {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error'

    // Return an empty list if no records found
    if (message === 'No records found') {
      return {
        items: [],
        total: 0,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
        total_pages: 1,
      }
    }

    return rejectWithValue(message)
  }
})

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
      .addCase(fetchStakeList.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.page_size
        state.totalPages = action.payload.total_pages
      })
      .addCase(fetchStakeList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch stake list'
      })
  },
})

export default stakeListSlice.reducer
