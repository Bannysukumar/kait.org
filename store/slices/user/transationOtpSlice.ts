import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const sendTransactionOTP = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('transaction/sendOTP', async (_, thunkAPI) => {
  try {
    const token = Cookies.get('token')
    await axios.post(
      `${baseURL}user/transaction_otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    )
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'Failed to send OTP'
    return thunkAPI.rejectWithValue(message)
  }
})

interface TransactionOtpState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: TransactionOtpState = {
  loading: false,
  error: null,
  success: false,
}

const transactionOtpSlice = createSlice({
  name: 'transactionOtp',
  initialState,
  reducers: {
    resetTransactionOtpState(state) {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTransactionOTP.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(sendTransactionOTP.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(sendTransactionOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'OTP request failed'
      })
  },
})

export const { resetTransactionOtpState } = transactionOtpSlice.actions
export default transactionOtpSlice.reducer
