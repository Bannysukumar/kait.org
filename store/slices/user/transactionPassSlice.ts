import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


interface TransactionState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: TransactionState = {
  loading: false,
  error: null,
  success: false,
}

export const setTransactionPassword = createAsyncThunk<
  void,
  {
    otp: string
    transaction_password: string
    confirm_transaction_password: string
  },
  { rejectValue: string }
>('transaction/setTransactionPassword', async (data, thunkAPI) => {
  try {
    const token = Cookies.get('token')

    const payload = qs.stringify(data)

    await axios.put(`${baseURL}user/transaction_password`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to set transaction password'

    return thunkAPI.rejectWithValue(message)
  }
})

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransactionState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTransactionPassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(setTransactionPassword.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(setTransactionPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export const { resetTransactionState } = transactionSlice.actions
export default transactionSlice.reducer
