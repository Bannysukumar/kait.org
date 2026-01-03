import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const fetchRosWalletBalance = createAsyncThunk(
  'wallet/fetchRosWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')
      const response = await axios.get(`${baseURL}wallet/balance/ros`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch balance')
    }
  },
)

interface RosWalletBalance {
  total: number
  max_allowed_to_withdraw: number
  eligible: boolean
  remaining_days: number
  last_request_date: string | null
}

interface WalletState {
  Ros: RosWalletBalance | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  Ros: null,
  loading: false,
  error: null,
}

const RoswalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRosWalletBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRosWalletBalance.fulfilled, (state, action) => {
        state.loading = false
        state.Ros = action.payload
      })
      .addCase(fetchRosWalletBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default RoswalletSlice.reducer
