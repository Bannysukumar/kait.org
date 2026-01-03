import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface KycApplication {
  user_id: string
  name: string
  user_name: string | null
  email: string
  doc_type: string
  docs: Record<string, string[]>
  submitted: string | null
  status: 'unsubmitted' | 'pending' | 'approved' | 'rejected'
  comment: string
  reviewed_by: string
  reviewed_at: string | null
  kycVerified?: boolean
}

interface KycListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: KycApplication[]
}

interface KycState {
  kycApplications: KycApplication[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: string | null
}

const initialState: KycState = {
  kycApplications: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  isLoading: false,
  error: null,
}

export const fetchKycApplications = createAsyncThunk<
  { applications: KycApplication[]; totalPages: number; totalUsers: number },
  { page: number; page_size: number; status?: string; search?: string },
  { rejectValue: string }
>(
  'kyc/fetchKycApplications',
  async ({ page, page_size, status, search }, { rejectWithValue }) => {
    try {
      const token =
        Cookies.get('token') ||
        (typeof window !== 'undefined' && localStorage.getItem('token'))

      if (!token) throw new Error('No token found')

      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('page_size', page_size.toString())

      if (status && status !== 'all') {
        params.append('kyc_status', status)
      }

      if (search && search.trim() !== '') {
        params.append('search', search.trim())
      }

      const response = await axios.get<KycListResponse>(
        `${baseURL}kyc/list?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const { items = [], total_pages = 1, total = 0 } = response.data

      return {
        applications: items,
        totalPages: total_pages,
        totalUsers: total,
      }
    } catch (error: any) {
      const detail = error.response?.data?.detail

      if (error.response?.status === 404 && detail === 'No records found') {
        return {
          applications: [],
          totalPages: 1,
          totalUsers: 0,
        }
      }

      console.error('Error fetching KYC applications:', error)
      return rejectWithValue(
        detail || 'Failed to fetch KYC applications. Please try again.',
      )
    }
  },
)

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKycPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setKycPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKycApplications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchKycApplications.fulfilled, (state, action) => {
        state.kycApplications = action.payload.applications
        state.totalPages = action.payload.totalPages
        state.total = action.payload.totalUsers
        state.isLoading = false
        state.error = null
      })
      .addCase(fetchKycApplications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Unexpected error occurred'
      })
  },
})

export const { setKycPage, setKycPageSize } = kycSlice.actions
export default kycSlice.reducer
