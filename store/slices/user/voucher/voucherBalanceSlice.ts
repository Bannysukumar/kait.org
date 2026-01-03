import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface VoucherResponse {
  total: number
  max_allowed_voucher_limit: number
  kait_value: number
  voucher_generated: number
  voucher_wallet: string
}

interface VoucherState {
  loading: boolean
  error: string | null
  balance: VoucherResponse | null
  generateSuccess: boolean
}

const initialState: VoucherState = {
  loading: false,
  error: null,
  balance: null,
  generateSuccess: false,
}

export const fetchVoucherBalance = createAsyncThunk(
  'voucher/fetchBalance',
  async (
    voucher_kind: string,
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.get(
        `${baseURL}voucher/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          params: {
            voucher_kind, 
          },
        }
      )

      return response.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to fetch voucher balance'
      )
    }
  }
)

/* ----------------------- GENERATE VOUCHER ----------------------- */
export const generateVoucher = createAsyncThunk(
  'voucher/generate',
  async (
    {
      otp,
      transaction_pin,
      amount,
      voucher_kind,
    }: { otp: string; transaction_pin: string; amount: number; voucher_kind: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token')

      const form = new URLSearchParams()
      form.append('otp', otp)
      form.append('transaction_pin', transaction_pin)
      form.append('amount', amount.toString())
      form.append('voucher_kind', voucher_kind) // <-- REQUIRED

      await axios.post(`${baseURL}voucher/generate`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      })

      return true
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Voucher generation failed'
      )
    }
  }
)

/* ----------------------- SLICE ----------------------- */
const voucherBalanceSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    resetVoucherState: (state) => {
      state.generateSuccess = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch Balance */
      .addCase(fetchVoucherBalance.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchVoucherBalance.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload
      })
      .addCase(fetchVoucherBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      /* Generate Voucher */
      .addCase(generateVoucher.pending, (state) => {
        state.loading = true
        state.error = null
        state.generateSuccess = false
      })
      .addCase(generateVoucher.fulfilled, (state) => {
        state.loading = false
        state.generateSuccess = true
      })
      .addCase(generateVoucher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetVoucherState } = voucherBalanceSlice.actions
export default voucherBalanceSlice.reducer
