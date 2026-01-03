import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import qs from 'qs'


interface WithdrawRosPayload {
  otp: string
  transaction_pin: string
  beneficiary_id: string
  amount: number
}
interface WithdrawError {
  detail?: string
  [key: string]: any
}
interface WalletState {
  loading: boolean
  success: boolean
  error: string | null
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const initialState: WalletState = {
  loading: false,
  success: false,
  error: null,
}

export const withdrawRos = createAsyncThunk(
  'wallet/withdrawRos',
  async (payload: WithdrawRosPayload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${baseURL}withdraw/ros`,
        qs.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      return response.data
    } catch (error: any) {
      const detail = error.response?.data?.detail || 'Withdrawal failed'
      return rejectWithValue(detail)
    }
  },
)

const RoswithdrawFormSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWithdrawState(state) {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(withdrawRos.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(withdrawRos.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(withdrawRos.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
  },
})

export const { resetWithdrawState } = RoswithdrawFormSlice.actions
export default RoswithdrawFormSlice.reducer
