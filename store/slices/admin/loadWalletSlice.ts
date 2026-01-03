import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import qs from 'qs'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// Types
interface LoadWalletParams {
  user_id: string
  wallet_kind: string
  transaction_type: 'credit' | 'debit'
  comment: string
  amount: number
  token: string
}

interface WalletState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: WalletState = {
  loading: false,
  success: false,
  error: null,
}

export const loadWalletThunk = createAsyncThunk(
  'wallet/loadWallet',
  async (
    {
      user_id,
      wallet_kind,
      transaction_type,
      comment,
      amount,
      token,
    }: LoadWalletParams,
    { rejectWithValue },
  ) => {
    try {
      const data = qs.stringify({
        user_id,
        wallet_kind,
        transaction_type,
        comment,
        amount,
      })

      const response = await axios.post(
        `${baseURL}wallet/load_wallet`, // ✅ updated endpoint
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Wallet load failed',
      )
    }
  },
)

// Slice
const loadWalletSlice = createSlice({
  name: 'loadWallet',
  initialState,
  reducers: {
    resetWalletLoad: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWalletThunk.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(loadWalletThunk.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(loadWalletThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetWalletLoad } = loadWalletSlice.actions
export default loadWalletSlice.reducer
