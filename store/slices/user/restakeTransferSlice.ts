import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface RosState {
  loading: boolean
  success: boolean
  successMessage: string | null
  error: string | object | null
}

const initialState: RosState = {
  loading: false,
  success: false,
  successMessage: null,
  error: null,
}

interface RestakePayload {
  otp: string
  transaction_pin: string
  amount: number
  token: string
}

export const initiateRestake = createAsyncThunk(
  'transfer/initiateRestake',
  async ({ otp, transaction_pin, amount, token }: RestakePayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}transfer/intiate/self_restake_to_fiat`,
        new URLSearchParams({
          otp,
          transaction_pin,
          amount: amount.toString(),
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      return response.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.detail || err.response?.data || err.message,
      )
    }
  },
)

const restakeSlice = createSlice({
  name: 'restake',
  initialState,
  reducers: {
    resetRestakeState: (state) => {
      state.loading = false
      state.success = false
      state.successMessage = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateRestake.pending, (state) => {
        state.loading = true
        state.success = false
        state.successMessage = null
        state.error = null
      })
      .addCase(initiateRestake.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.successMessage = action.payload?.detail || 'Restake transfer successful'
        state.error = null
      })
      .addCase(initiateRestake.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export const { resetRestakeState } = restakeSlice.actions
export default restakeSlice.reducer
