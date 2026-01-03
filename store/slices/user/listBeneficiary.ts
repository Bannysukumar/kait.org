import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Beneficiary {
  beneficiary_id: string
  user_id: string
  nick_name: string
  wallet_address: string
  email: string
  mobile: string
  limit: number
  status: string
}

interface BeneficiaryState {
  items: Beneficiary[]
  loading: boolean
  error: string | null
  total: number
  page: number
  page_size: number
  total_pages: number
}

const initialState: BeneficiaryState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 1,
}

export const fetchBeneficiaries = createAsyncThunk(
  'user/fetchBeneficiaries',
  async (
    {
      page = 1,
      review_status = 'any',
    }: { page?: number; review_status?: string },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) return rejectWithValue({ detail: 'Not authenticated' })

      const response = await axios.get(`${BASE_URL}beneficiary/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          page_size: 10,
          review_status,
        },
      })

      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { detail: 'Unknown error' })
    }
  },
)

const beneficiarySlice = createSlice({
  name: 'beneficiaries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.page_size = action.payload.page_size
        state.total_pages = action.payload.total_pages
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false

        const err = action.payload

        if (typeof err === 'string') {
          state.error = err
        } else if (err && typeof err === 'object' && 'detail' in err) {
          state.error = (err as any).detail
        } else {
          state.error = 'An unexpected error occurred.'
        }
      })
  },
})

export default beneficiarySlice.reducer
