import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface UpdatePayload {
  beneficiary_id: string
  user_id: string
  nick_name?: string | null
  wallet_address?: string | null
  mobile?: string | null
  email?: string | null
  limit?: number | null
}

interface UpdateState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: UpdateState = {
  loading: false,
  success: false,
  error: null,
}

export const updateBeneficiary = createAsyncThunk(
  'beneficiary/update',
  async (data: UpdatePayload, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const formData = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value === null ? '' : String(value))
      })

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}beneficiary/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Something went wrong')
    }
  }
)

const updateBeneficiarySlice = createSlice({
  name: 'updateBeneficiary',
  initialState,
  reducers: {
    resetUpdateState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateBeneficiary.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(updateBeneficiary.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(updateBeneficiary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetUpdateState } = updateBeneficiarySlice.actions
export default updateBeneficiarySlice.reducer
