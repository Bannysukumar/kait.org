// store/slices/eligibleUsersSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface EligibleUser {
  id: string
  name: string
  user_name: string
  email: string
}

interface EligibleUsersState {
  users: EligibleUser[]
  loading: boolean
  error: string | null
}

const initialState: EligibleUsersState = {
  users: [],
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchEligibleUsers = createAsyncThunk<
  EligibleUser[],
  string,
  { rejectValue: string }
>('eligibleUsers/fetch', async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${baseURL}user/get_eligible_users_for_transfer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    )

    const transformed = response.data.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      user_name: user.email.split('@')[0],
    }))



    return transformed
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch users',
    )
  }
})

const eligibleUsersSlice = createSlice({
  name: 'eligibleUsers',
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
        state.error = action.payload || 'Unknown error'
      })
  },
})

export default eligibleUsersSlice.reducer
