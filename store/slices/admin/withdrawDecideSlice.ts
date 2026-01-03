// store/slices/user/withdrawActionSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface WithdrawActionPayload {
  withdraw_request_id: string
  user_id: string
  action: 'approve' | 'reject'
  comment: string
  notify_user: boolean
}

interface WithdrawActionState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: WithdrawActionState = {
  loading: false,
  success: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const decideWithdrawRequest = createAsyncThunk(
  'withdraw/decide',
  async (payload: WithdrawActionPayload, thunkAPI) => {
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

      const formData = new URLSearchParams()
      formData.append('withdraw_request_id', payload.withdraw_request_id)
      formData.append('user_id', payload.user_id)
      formData.append('action', payload.action)
      formData.append('comment', payload.comment)
      formData.append('notify_user', String(payload.notify_user))

      const response = await axios.put(
        `${baseURL}withdraw/admin/decide`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      )

      // ✅ Return full data — even if it has "detail"
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Action failed'
      return thunkAPI.rejectWithValue(errorMessage)
    }
  }
)



const withdrawActionSlice = createSlice({
  name: 'withdrawAction',
  initialState,
  reducers: {
    resetWithdrawAction: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(decideWithdrawRequest.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(decideWithdrawRequest.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(decideWithdrawRequest.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
  },
})

export const { resetWithdrawAction } = withdrawActionSlice.actions
export default withdrawActionSlice.reducer
