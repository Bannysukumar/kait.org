import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'
import { createSlice } from '@reduxjs/toolkit'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface ComboStakePayload {
  plan_combo_id: string
  wallet_split_id: string
  amount: number
}

export const ComboStakeperform = createAsyncThunk<
  void,
  ComboStakePayload,
  { rejectValue: string }
>(
  'staking/ComboStakeperform',
  async ({ plan_combo_id, wallet_split_id, amount }, thunkAPI) => {
    try {
      if (amount <= 0) {
        return thunkAPI.rejectWithValue("'amount' should contain only numbers and greater than zero")
      }

      const token = typeof window !== 'undefined' ? Cookies.get('token') : null
      if (!token) return thunkAPI.rejectWithValue('No token found')

      const payload = qs.stringify({ plan_combo_id, wallet_split_id, amount })

      await axios.post(`${baseURL}stake/perform_combo`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Failed to perform combo stake'
      )
    }
  }
)
interface ComboStakeState {
  loading: boolean
  error: string | null
}

const initialState: ComboStakeState = {
  loading: false,
  error: null,
}

const comboStakeSlice = createSlice({
  name: 'comboStake',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ComboStakeperform.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(ComboStakeperform.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(ComboStakeperform.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to perform combo stake'
      })
  },
})

export default comboStakeSlice.reducer;
