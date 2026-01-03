import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export interface UpdateSplitConfigPayload {
  split_config_id: string
  kait_wallet: number
  fiat_wallet: number
  income_wallet: number
  adhoc_wallet: number
  ros_wallet: number
  restake_wallet: number
  vpay_voucher_wallet: number
  ecommerce_voucher_wallet: number
}

interface UpdateState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: UpdateState = {
  loading: false,
  error: null,
  success: false,
}

export const updateWalletSplit = createAsyncThunk(
  'walletSplit/update',
  async (payload: UpdateSplitConfigPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new URLSearchParams()
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      const response = await axios.put(
        `${baseURL}wallet/split_config/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update split config')
    }
  }
)

const walletSplitUpdateSlice = createSlice({
  name: 'walletSplitUpdate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateWalletSplit.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateWalletSplit.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(updateWalletSplit.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
  },
})

export default walletSplitUpdateSlice.reducer
