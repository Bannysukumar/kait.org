import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const fetchFiatWalletBalance = createAsyncThunk(
  'wallet/fetchFiatWalletBalance',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${baseURL}wallet/balance/fiat`, {
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

interface FiatWalletBalance {
  total: number
  max_allowed_to_withdraw: number
  eligible: boolean
  remaining_days: number
  last_request_date: string | null
}

interface WalletState {
  fiat: FiatWalletBalance | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  fiat: null,
  loading: false,
  error: null,
}

const FiatwalletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiatWalletBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFiatWalletBalance.fulfilled, (state, action) => {
        state.loading = false
        state.fiat = action.payload
      })
      .addCase(fetchFiatWalletBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default FiatwalletSlice.reducer
