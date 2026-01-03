import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface RosRestakePayload {
  otp: string
  transaction_pin: string
  amount: number
  token: string
}

interface RosRestakeState {
  loading: boolean
  success: boolean
  successMessage: string | null
  error: string | null
}

const initialState: RosRestakeState = {
  loading: false,
  success: false,
  successMessage: null,
  error: null,
}


export const initiateRosToRestake = createAsyncThunk(
  'rosRestake/initiate',
  async ({ otp, transaction_pin, amount, token }: RosRestakePayload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}transfer/intiate/self_ros_to_restake`,
        new URLSearchParams({
          otp,
          transaction_pin,
          amount: amount.toString(),
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        },
      )

      // ✅ If response has a detail message
      return response.data
    } catch (error: any) {
      const errMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to initiate ROS restake transfer.'
      return thunkAPI.rejectWithValue(errMessage)
    }
  },
)

const rosRestakeSlice = createSlice({
  name: 'rosRestake',
  initialState,
  reducers: {
    resetRosRestakeState: (state) => {
      state.loading = false
      state.success = false
      state.successMessage = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateRosToRestake.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(initiateRosToRestake.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.successMessage =
          action.payload?.detail || 'ROS-to-Restake transfer successful.'
      })
      .addCase(initiateRosToRestake.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
  },
})

export const { resetRosRestakeState } = rosRestakeSlice.actions
export default rosRestakeSlice.reducer
