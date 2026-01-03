import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface TransferErrorObject {
  detail?: string
  [key: string]: any
}

interface RosState {
  loading: boolean
  success: boolean
  successMessage: string | null
  error: string | TransferErrorObject | null
}

const initialState: RosState = {
  loading: false,
  success: false,
  successMessage: null,
  error: null,
}

interface RosPayload {
  otp: string
  transaction_pin: string
  amount: number
  token: string
}

export const initiateRos = createAsyncThunk(
  'transfer/initiateRos',
  async ({ otp, transaction_pin, amount, token }: RosPayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}transfer/intiate/self_ros_to_kait`,
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

const RosSlice = createSlice({
  name: 'Rostransfer',
  initialState,
  reducers: {
    resetRosState: (state) => {
      state.loading = false
      state.success = false
      state.successMessage = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateRos.pending, (state) => {
        state.loading = true
        state.success = false
        state.successMessage = null
        state.error = null
      })
      .addCase(initiateRos.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.successMessage =
          action.payload?.detail || 'ROS Wallet transfer successful'
        state.error = null
      })
      .addCase(initiateRos.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export const { resetRosState } = RosSlice.actions
export default RosSlice.reducer
