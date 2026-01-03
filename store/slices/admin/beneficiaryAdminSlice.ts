import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Beneficiary {
  beneficiary_id: string
  user_id: string
  nick_name: string
  wallet_address: string
  email: string
  mobile: string
  limit: number | null
  status: string
}

interface BeneficiaryState {
  items: Beneficiary[]
  total_pages: number
  total: number
  loading: boolean
  error: string | null
  actionLoading: boolean
}

const initialState: BeneficiaryState = {
  items: [],
  total_pages: 0,
  total: 0,
  loading: false,
  error: null,
  actionLoading: false,
}

// ✅ Updated thunk with optional `search`
export const fetchBeneficiaries = createAsyncThunk(
  'beneficiary/fetch',
  async (
    {
      review_status = 'any',
      search = '',
      page = 1,
      page_size = 10,
    }: {
      review_status?: string
      search?: string
      page?: number
      page_size?: number
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token')

      // Build query params dynamically
      const params = new URLSearchParams({
        review_status,
        page: String(page),
        page_size: String(page_size),
      })

      if (search) params.append('search', search)

      const response = await axios.get(`${baseURL}beneficiary/admin/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return {
        items: response.data.items || [],
        total_pages: response.data.total_pages,
        total: response.data.total,
      }
    } catch (error: any) {
      const status = error.response?.status
      const detail = error.response?.data?.detail

      if (status === 404 && detail === 'No records found') {
        return {
          items: [],
          total_pages: 0,
          total: 0,
        }
      }

      return rejectWithValue(detail || 'Failed to fetch data')
    }
  },
)

export const decideBeneficiary = createAsyncThunk(
  'beneficiary/decide',
  async (
    {
      beneficiary_id,
      user_id,
      action,
      comment,
      notify_user,
    }: {
      beneficiary_id: string
      user_id: string
      action: 'approve' | 'reject'
      comment: string
      notify_user: boolean
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new URLSearchParams()
      formData.append('beneficiary_id', beneficiary_id)
      formData.append('user_id', user_id)
      formData.append('action', action)
      formData.append('comment', comment)
      formData.append('notify_user', String(notify_user))

      const response = await axios.put(`${baseURL}beneficiary/admin/decide`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Action failed')
    }
  },
)

const beneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total_pages = action.payload.total_pages
        state.total = action.payload.total
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Approve / Reject action
      .addCase(decideBeneficiary.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(decideBeneficiary.fulfilled, (state) => {
        state.actionLoading = false
      })
      .addCase(decideBeneficiary.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload as string
      })
  },
})

export default beneficiarySlice.reducer
