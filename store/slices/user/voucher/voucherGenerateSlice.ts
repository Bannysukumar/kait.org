import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface VoucherErrorDetail {
  type: string
  loc: string[]
  msg: string
  input?: any
  ctx?: Record<string, any>
}

export interface GenerateVoucherPayload {
  otp: string
  transaction_pin: string
  amount: number
  voucher_kind: string        
}

interface GenerateVoucherState {
  loading: boolean
  success: boolean
  error: string | { detail: VoucherErrorDetail[] } | null
  message: string | null
}

const initialState: GenerateVoucherState = {
  loading: false,
  success: false,
  error: null,
  message: null,
}

export const generateVoucher = createAsyncThunk<
  any,
  GenerateVoucherPayload,
  { rejectValue: string | { detail: VoucherErrorDetail[] } }
>(
  'voucher/generate',
  async (payload, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      const formData = new URLSearchParams({
        otp: payload.otp,
        transaction_pin: payload.transaction_pin,
        amount: payload.amount.toString(),
        voucher_kind: payload.voucher_kind,
      })

      const response = await axios.post(
        `${baseURL}voucher/generate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      return response.data
    } catch (error: any) {
      const apiError = error.response?.data
      return rejectWithValue(
        apiError?.detail ? apiError : apiError?.message || 'Failed to generate voucher'
      )
    }
  }
)

const generateVoucherSlice = createSlice({
  name: 'generateVoucher',
  initialState,
  reducers: {
    resetGenerateVoucherState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateVoucher.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(generateVoucher.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message || 'Voucher generated successfully'
      })
      .addCase(generateVoucher.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload ?? 'An unknown error occurred'
      })
  },
})

export const { resetGenerateVoucherState } = generateVoucherSlice.actions
export default generateVoucherSlice.reducer
