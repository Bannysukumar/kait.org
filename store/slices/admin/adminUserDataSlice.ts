import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface StakeStats {
  total_contracts: number
  total_contract_count: number
  total_users_with_contracts: number
  total_users_without_contracts: number
}

interface UserStats {
  total_users: number
  total_active_users: number
  total_inactive_users: number
  kyc_completed: number
  last_day_users: number
  last_week_users: number
  last_month_users: number
  last_year_users: number
}

interface MetricStats {
  total_roi: number
  total_roc: number
  total_level: number
  total_earnings: number
  total_withdraw: number
  total_balance: number
}

// Updated to match the lowercase + underscore keys in the API response
type ClubName =
  | 'basic'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'double_diamond'
  | 'triple_diamond'
  | 'kait_king'

interface DashboardData {
  stakes: StakeStats
  users: UserStats
  clubs: Record<ClubName, number>
  metrics: MetricStats
}

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchDashboardStats = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${baseURL}user/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    return res.data as DashboardData
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Error fetching dashboard data',
    )
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error fetching dashboard data'
      })
  },
})

export default dashboardSlice.reducer
