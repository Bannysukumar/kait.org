import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

interface SendOtpState {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
}

const initialState: SendOtpState = {
  loading: false,
  success: false,
  error: null,
  message: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// ✅ Async thunk with type-safe return
export const transferWalletOtp = createAsyncThunk<
  { message: string }, // return type
  void,                // argument type
  { rejectValue: string } // reject type
>(
  'otp/transferWalletOtp',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token')
      const response = await axios.post(
        `${baseURL}transfer/confirmation_otp`,
        '', // POST body (empty string here)
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      return {
        message: response.data.detail || 'OTP sent successfully',
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail || 'Failed to send OTP'
      return rejectWithValue(errorMsg)
    }
  }
)

const transferWalletOtpSlice = createSlice({
  name: 'transferWalletOtp',
  initialState,
  reducers: {
    resetOtpState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(transferWalletOtp.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
        state.message = null
      })
      .addCase(transferWalletOtp.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.message = action.payload.message
      })
      .addCase(transferWalletOtp.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || 'Something went wrong'
        state.message = null
      })
  },
})

export const { resetOtpState } = transferWalletOtpSlice.actions
export default transferWalletOtpSlice.reducer
