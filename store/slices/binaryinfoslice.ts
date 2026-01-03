import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface BinaryInfo {
  left_direct_count: number
  right_direct_count: number
  left_team_count: number
  right_team_count: number
  left_team_business: number
  right_team_business: number
  pair_matching: number
  left_prev_business: number
  right_prev_business: number
  prev_month_pair_matching: number
  left_cur_business: number
  right_cur_business: number
  current_month_pair_matching: number
  left_carry_forward: string
  right_carry_forward: string
}

interface BinaryInfoState {
  data: BinaryInfo | null
  loading: boolean
  error: string | null
}

const initialState: BinaryInfoState = {
  data: null,
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchBinaryInfo = createAsyncThunk<
  BinaryInfo, // Return type
  string, // userId
  { rejectValue: string } // reject type
>(
  'binaryInfo/fetch',
  async (userId, thunkAPI) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) return thunkAPI.rejectWithValue('No token found')

      const response = await axios.get<BinaryInfo>(`${baseURL}user/binary_info`, {
        params: { user_id: userId },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch binary info'
      )
    }
  }
)

const binaryInfoSlice = createSlice({
  name: 'binaryInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBinaryInfo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBinaryInfo.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchBinaryInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export default binaryInfoSlice.reducer
