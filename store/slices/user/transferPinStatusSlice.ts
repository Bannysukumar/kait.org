import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface TransferPinStatusState {
  status: boolean | null
  loading: boolean
  error: string | null
}

const initialState: TransferPinStatusState = {
  status: null,
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchTransferPinStatus = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>('transferPinStatus/fetch', async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseURL}transfer/transfer_pin_status`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    return response.data?.transfer_pin_status
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch transfer pin status',
    )
  }
})

const transferPinStatusSlice = createSlice({
  name: 'transferPinStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferPinStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTransferPinStatus.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload
      })
      .addCase(fetchTransferPinStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch status'
        state.status = null
      })
  },
})

export default transferPinStatusSlice.reducer
