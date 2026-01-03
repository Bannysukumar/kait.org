import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import qs from 'qs'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface LoadKaitWalletParams {
  user_id: string
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

export const loadKaitWalletThunk = createAsyncThunk(
  'wallet/loadKaitWallet',
  async ({ user_id, amount, token }: LoadKaitWalletParams, { rejectWithValue }) => {
    try {
      const data = qs.stringify({
        user_id,
        transaction_type: 'credit',
        amount,
      })

      const response = await axios.post(
        `${baseURL}wallet/load_kait_wallet`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Kait Wallet Load Failed')
    }
  }
)

const kaitWalletLoadSlice = createSlice({
  name: 'kaitWalletLoad',
  initialState,
  reducers: {
    resetKaitWalletLoad: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadKaitWalletThunk.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(loadKaitWalletThunk.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(loadKaitWalletThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})


export const { resetKaitWalletLoad } = kaitWalletLoadSlice.actions
export default kaitWalletLoadSlice.reducer
