import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface WithdrawItem {
  withdraw_request_id: string
  user_id: string
  full_name: string
  email: string
  status: string
  created_date_time: string
  reviewed_date_time: string | null
  source_wallet: string
  amount: number
  wallet: string
  beneficiary_nick_name: string
  transaction: string | null
  transaction_link: string
  description: string
}


interface WithdrawListState {
  items: WithdrawItem[]
  total: number
  total_pages: number
  page: number
  loading: boolean
  error: string | null
}

interface WithdrawListResponse {
  items: WithdrawItem[]
  total: number
  total_pages: number
  page: number
}

const initialState: WithdrawListState = {
  items: [],
  total: 0,
  total_pages: 0,
  page: 1,
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// Thunk with dynamic filters
export const fetchWithdrawList = createAsyncThunk<
  WithdrawListResponse,
  {
    review_status?: string
    search?: string
    page?: number
    page_size?: number
  },
  { rejectValue: string }
>('withdraw/list', async (params, thunkAPI) => {
  try {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null

    const query = new URLSearchParams()
    if (params.review_status) query.append('review_status', params.review_status)
    if (params.search) query.append('search', params.search)
    if (params.page) query.append('page', params.page.toString())
    if (params.page_size) query.append('page_size', params.page_size.toString())

    const response = await axios.get<WithdrawListResponse>(
      `${baseURL}withdraw/list?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )

    return response.data
  } catch (error: any) {
    if (
      error.response?.status === 404 &&
      error.response?.data?.detail === 'No records found'
    ) {
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        total_pages: 0,
      }
    }

    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch withdrawals'
    )
  }
})


const withdrawListSlice = createSlice({
  name: 'withdrawList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWithdrawList.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.total_pages = action.payload.total_pages
      })
      .addCase(fetchWithdrawList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})


export default withdrawListSlice.reducer
