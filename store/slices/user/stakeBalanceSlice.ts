import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface StakeBalance {
  total_stake: number
  total_ros: number
}

interface StakeState {
  data: StakeBalance | null
  loading: boolean
  error: string | null
}

const initialState: StakeState = {
  data: null,
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchStakeBalance = createAsyncThunk(
  'stake/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}stake/balance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      })
      return res.data as StakeBalance
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch stake balance')
    }
  }
)

const stakeBalanceSlice = createSlice({
  name: 'stakeBalance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStakeBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStakeBalance.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchStakeBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default stakeBalanceSlice.reducer
