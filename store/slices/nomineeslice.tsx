import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

interface NomineeState {
  data: any
  isLoading: boolean
  error: string | null
}
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const initialState: NomineeState = {
  data: null,
  isLoading: false,
  error: null,
}

export const fetchNomineeData = createAsyncThunk(
  'user/fetchNomineeData',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`${baseURL}user/nominee`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        validateStatus: () => true, 
      })

      if (response.status === 404) {
        return rejectWithValue('No nominee found') 
      }

      if (response.status >= 400) {
        return rejectWithValue(response.data?.message || 'Failed to fetch nominee data')
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching nominee data:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch nominee data',
      )
    }
  }
)


export const updateNomineeData = createAsyncThunk(
  'user/updateNomineeData',
  async (
    nomineeData: { nominee_name: string; nominee_pan: string; nominee_relationship: string },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found')
      }

      const formData = new URLSearchParams()
      formData.append('nominee_name', nomineeData.nominee_name)
      formData.append('nominee_pan', nomineeData.nominee_pan)
      formData.append('nominee_relationship', nomineeData.nominee_relationship)

      const response = await axios.put(`${baseURL}user/nominee`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('Error updating nominee data:', error)
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to update nominee data',
      )
    }
  }
)


const nomineeSlice = createSlice({
  name: 'nominee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNomineeData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNomineeData.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchNomineeData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateNomineeData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateNomineeData.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(updateNomineeData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default nomineeSlice.reducer
