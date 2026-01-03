import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface ForgotPasswordState {
  loading: boolean
  error: string | null
  success: boolean
}
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const initialState: ForgotPasswordState = {
  loading: false,
  error: null,
  success: false,
}

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}user/forgot-pass`,
        new URLSearchParams({ email }), // sends as application/x-www-form-urlencoded
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong')
    }
  }
)

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    resetForgotPasswordState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.success = false
      })
  },
})

export const { resetForgotPasswordState } = forgotPasswordSlice.actions
export default forgotPasswordSlice.reducer
