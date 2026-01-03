import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface TransferError {
  detail?: string
  [key: string]: any
}

interface RosTransferState {
  loading: boolean
  success: boolean
  successMessage: string | null
  error: string | TransferError | null
}

const initialState: RosTransferState = {
  loading: false,
  success: false,
  successMessage: null,
  error: null,
}

interface RosTransferPayload {
  otp: string
  transaction_pin: string
  amount: number
  token: string
}

export const initiateFixedRosTransfer = createAsyncThunk(
  'rosTransfer/initiateFixedRos',
  async ({ otp, transaction_pin, amount, token }: RosTransferPayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}transfer/intiate/self_fixed_ros_to_kait`,
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
        }
      )
      return response.data
    } catch (err: any) {
      const error = err.response?.data
      if (error?.detail) return thunkAPI.rejectWithValue(error.detail)
      return thunkAPI.rejectWithValue(err.message || 'Something went wrong')
    }
  }
)

const rosTransferSlice = createSlice({
  name: 'rosTransfer',
  initialState,
  reducers: {
    resetRosTransferState: (state) => {
      state.loading = false
      state.success = false
      state.successMessage = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateFixedRosTransfer.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(initiateFixedRosTransfer.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.successMessage = action.payload?.detail || 'Fixed ROS Transfer Successful'
      })
      .addCase(initiateFixedRosTransfer.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload || 'Transfer failed'
      })
  },
})

export const { resetRosTransferState } = rosTransferSlice.actions
export default rosTransferSlice.reducer
