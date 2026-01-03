// store/slices/admin/passwordReset.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ResetPasswordPayload {
  userId: string
  newPassword: string
}

interface ResetPasswordState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: ResetPasswordState = {
  loading: false,
  error: null,
  success: false,
}

// Thunk to reset user password
export const resetUserPassword = createAsyncThunk(
  'admin/resetUserPassword',
  async (
    { userId, newPassword }: ResetPasswordPayload,
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${baseURL}user/password_reset?user_id=${encodeURIComponent(userId)}`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset failed.',
      )
    }
  },
)

const resetPasswordSlice = createSlice({
  name: 'resetpassword',
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearStatus } = resetPasswordSlice.actions
export default resetPasswordSlice.reducer
