import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface EligibleUser {
  id: string
  value: {
    name: string
    email: string
  }
}

interface State {
  users: EligibleUser[]
  loading: boolean
  error: string | null
}

const initialState: State = {
  users: [],
  loading: false,
  error: null,
}

export const fetchEligibleUsers = createAsyncThunk<
  EligibleUser[],
  string,
  { rejectValue: string }
>('referral/fetchEligibleUsers', async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post(
      `${baseURL}user/get_eligible_users_for_referral_update`,
      new URLSearchParams({ user_id: userId }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
    return res.data
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.detail || 'Failed to fetch eligible users',
    )
  }
})

const referralEligibleUsersSlice = createSlice({
  name: 'eligibleReferralUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEligibleUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEligibleUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchEligibleUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error'
      })
  },
})

export default referralEligibleUsersSlice.reducer
