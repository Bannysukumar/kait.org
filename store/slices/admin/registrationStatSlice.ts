import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface RegistrationStat {
  id: string
  value: number
}

interface RegistrationStatState {
  data: RegistrationStat[]
  loading: boolean
  error: string | null
}

const initialState: RegistrationStatState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchRegistrationStats = createAsyncThunk<
  RegistrationStat[],  
  string,             
  { rejectValue: string }
>(
  'registrationStat/fetch',
  async (period, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${baseURL}user/registration/stat?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      return response.data 
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.detail || 'Failed to fetch registration stats')
    }
  }
)

const registrationStatSlice = createSlice({
  name: 'registrationStat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRegistrationStats.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchRegistrationStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch registration stats'
      })
  },
})

export default registrationStatSlice.reducer
