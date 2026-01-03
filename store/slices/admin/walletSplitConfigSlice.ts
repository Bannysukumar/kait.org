import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface SplitConfigPayload {
  kait_wallet: number
  fiat_wallet: number
  income_wallet: number
  adhoc_wallet: number
  ros_wallet: number
  restake_wallet: number
  vpay_voucher_wallet: number
  ecommerce_voucher_wallet: number
  bonus_wallet: number
  super_wallet: number
}

interface WalletSplitState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: WalletSplitState = {
  loading: false,
  error: null,
  success: false,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const submitWalletSplit = createAsyncThunk(
  'walletSplit/submit',
  async (payload: SplitConfigPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')

      // Convert payload to x-www-form-urlencoded format
      const formData = new URLSearchParams()
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      const response = await axios.post(
        `${baseURL}wallet/split_config/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error submitting split config'
      )
    }
  }
)

const walletSplitSlice = createSlice({
  name: 'walletSplit',
  initialState,
  reducers: {
    resetWalletSplitState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitWalletSplit.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitWalletSplit.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(submitWalletSplit.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
  },
})

export const { resetWalletSplitState } = walletSplitSlice.actions
export default walletSplitSlice.reducer
