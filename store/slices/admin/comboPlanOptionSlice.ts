import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Plan interface
export interface Plan {
  plan_id: string
  name: string
  description: string
  min_amount: number
  lock_in_period: number
}

// Slice state
interface ComboOptionState {
  items: Plan[]
  loading: boolean
  error: string | null
}

const initialState: ComboOptionState = {
  items: [],
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// Thunk to fetch combo options
export const fetchComboOptions = createAsyncThunk(
  'comboOption/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get<Plan[]>(`${baseURL}plan/combo_option`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch combo options'
      )
    }
  }
)

// Slice
const comboOptionSlice = createSlice({
  name: 'comboOption',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComboOptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComboOptions.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchComboOptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default comboOptionSlice.reducer
