// @/store/slices/admin/clubSyncSlice.ts

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ClubSyncState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: ClubSyncState = {
  loading: false,
  success: false,
  error: null,
}

export const syncClub = createAsyncThunk(
  'club/sync',
  async ({ user_id, token }: { user_id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}club/sync?user_id=${encodeURIComponent(user_id)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Sync failed')
    }
  }
)

const clubSyncSlice = createSlice({
  name: 'clubSync',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(syncClub.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(syncClub.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(syncClub.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
  },
})

export default clubSyncSlice.reducer
