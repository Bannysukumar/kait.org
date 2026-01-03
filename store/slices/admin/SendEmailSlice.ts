import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const sendEmail = createAsyncThunk<
  string,
  {
    user_id: string
    subject: string
    greeting: string
    message: string
    token: string
  },
  { rejectValue: string }
>(
  'email/send',
  async ({ user_id, subject, greeting, message, token }, thunkAPI) => {
    try {
      const params = new URLSearchParams({
        user_id,
        subject,
        greeting,
        message,
      }).toString()

      const res = await axios.post(
        `${baseURL}email/send?${params}`, // ✅ move to query
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )
      return res.data.message || 'Email sent successfully'
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to send email',
      )
    }
  },
)

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    loading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.loading = true
        state.successMessage = ''
        state.errorMessage = ''
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.loading = false
        state.successMessage = action.payload
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.loading = false
        state.errorMessage = action.payload || 'Error sending email'
      })
  },
})

export default emailSlice.reducer
