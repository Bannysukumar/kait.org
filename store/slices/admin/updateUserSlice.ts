import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface UpdateInvestorPayload {
  user_id: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  referral_user_id: string
  send_reset_password_link: boolean
  token: string
}

interface InvestorState {
  updateLoading: boolean
  updateError: string | null
  updateSuccess: boolean
}

const initialState: InvestorState = {
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
}

export const updateInvestor = createAsyncThunk(
  'investor/updateInvestor',
  async (payload: UpdateInvestorPayload, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams()
      Object.entries(payload).forEach(([key, value]) => {
        if (key !== 'token') {
          formData.append(key, value.toString())
        }
      })

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}user/update_investor`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${payload.token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      return response.data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Error updating investor'
      return rejectWithValue(errorMessage)
    }
  },
)

const investorSlice = createSlice({
  name: 'investor',
  initialState,
  reducers: {
    resetUpdateState(state) {
      state.updateSuccess = false
      state.updateError = null
      state.updateLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateInvestor.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
        state.updateSuccess = false
      })
      .addCase(updateInvestor.fulfilled, (state) => {
        state.updateLoading = false
        state.updateSuccess = true
      })
      .addCase(updateInvestor.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload as string
      })
  },
})

export const { resetUpdateState } = investorSlice.actions
export default investorSlice.reducer
