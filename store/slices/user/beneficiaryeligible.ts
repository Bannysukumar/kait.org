import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface BeneficiaryEligible {
  beneficiary_id: string
  user_id: string
  nick_name: string
  wallet_address: string
}

interface BeneficiaryState {
  beneficiaries: BeneficiaryEligible[]
  loading: boolean
  error: string | null
}

const initialState: BeneficiaryState = {
  beneficiaries: [],
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchEligibleBeneficiaries = createAsyncThunk(
  'beneficiary/fetchEligible',
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('token') || ''
        : ''

      const response = await axios.get(`${baseURL}beneficiary/eligible/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch eligible beneficiaries')
    }
  }
)

const beneficiaryEligibleSlice = createSlice({
  name: 'beneficiaryEligible',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEligibleBeneficiaries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEligibleBeneficiaries.fulfilled, (state, action) => {
        state.loading = false
        state.beneficiaries = action.payload
      })
      .addCase(fetchEligibleBeneficiaries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default beneficiaryEligibleSlice.reducer
