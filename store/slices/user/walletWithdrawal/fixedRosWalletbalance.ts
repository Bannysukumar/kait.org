import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const fixedRosWalletBalance = createAsyncThunk(
  'wallet/fixedRosWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${baseURL}withdraw/balance/fixed_ros`, {
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

interface fixedRosWalletBalance {
  total: number
  max_allowed_to_withdraw: number
  eligible: boolean
  remaining_days: number
  last_request_date: string | null
}

interface WalletState {
  fixedRos: fixedRosWalletBalance | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  fixedRos: null,
  loading: false,
  error: null,
}

const fixedRoswalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fixedRosWalletBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fixedRosWalletBalance.fulfilled, (state, action) => {
        state.loading = false
        state.fixedRos = action.payload
      })
      .addCase(fixedRosWalletBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default fixedRoswalletSlice.reducer
