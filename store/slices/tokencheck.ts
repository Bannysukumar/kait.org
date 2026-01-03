// store/slices/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.kaitcoin.org/user/verify_email/${token}`,
        {
          headers: { accept: 'application/json' },
        }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Verification failed')
    }
  }
)

interface AuthState {
  verificationStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  verificationMessage: string | null
}

const initialState: AuthState = {
  verificationStatus: 'idle',
  verificationMessage: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.verificationStatus = 'loading'
        state.verificationMessage = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verificationStatus = 'succeeded'
        state.verificationMessage = action.payload?.detail || 'Email verified successfully'
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verificationStatus = 'failed'
        state.verificationMessage =
          (action.payload as string) || 'Email verification failed'
      })
  },
})

export default authSlice.reducer
