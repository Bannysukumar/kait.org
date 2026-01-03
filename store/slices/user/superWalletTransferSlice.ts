import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const initiateSelfTransfer = createAsyncThunk(
  'wallet/initiateSelfTransfer',
  async (
    {
      otp,
      transaction_pin,
      wallet,
      amount,
    }: {
      otp: string
      transaction_pin: string
      wallet: string
      amount: number
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')
      const data = new URLSearchParams()
      data.append('otp', otp)
      data.append('transaction_pin', transaction_pin)
      data.append('wallet', wallet)
      data.append('amount', String(amount))

      const res = await axios.post(
        `${baseURL}transfer/intiate/self_super_to_adhoc_or_income`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return {
        message: res.data.detail || res.data.message || 'Transfer successful',
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Self transfer failed')
    }
  }
)

export const initiateUplineDownlineTransfer = createAsyncThunk(
  'wallet/initiateUplineDownlineTransfer',
  async (
    {
      otp,
      transaction_pin,
      receiver_user_id,
      amount,
    }: {
      otp: string
      transaction_pin: string
      receiver_user_id: string
      amount: number
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')
      const data = new URLSearchParams()
      data.append('otp', otp)
      data.append('transaction_pin', transaction_pin)
      data.append('receiver_user_id', receiver_user_id)
      data.append('amount', String(amount))

      const res = await axios.post(
        `${baseURL}transfer/intiate/super_to_upline_downline`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return {
        message: res.data.detail || res.data.message || 'Transfer successful',
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Transfer to upline/downline failed'

      return rejectWithValue(backendMessage)
    }
  }
)


interface TransferState {
  loading: boolean
  error: string | null
  success: boolean
  message: string | null
}

const initialState: TransferState = {
  loading: false,
  error: null,
  success: false,
  message: null,
}

const transferSlice = createSlice({
  name: 'SuperWalletTransfer',
  initialState,
  reducers: {
    resetTransferState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateSelfTransfer.pending, (state) => {
        state.loading = true
        state.message = null
        state.error = null
      })
      .addCase(initiateSelfTransfer.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
      })
      .addCase(initiateSelfTransfer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(initiateUplineDownlineTransfer.pending, (state) => {
        state.loading = true
        state.message = null
        state.error = null
      })
      .addCase(initiateUplineDownlineTransfer.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
      })
      .addCase(initiateUplineDownlineTransfer.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
  },
})

export const { resetTransferState } = transferSlice.actions
export default transferSlice.reducer
