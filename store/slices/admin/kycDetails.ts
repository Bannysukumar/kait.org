import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


interface KycData {
  first_name: string
  last_name: string
  user_name: string
  email: string
  gender: string
  dob: string
  mobile: string
  alternate_mobile: string
  country: string
  state: string
  city: string
  postal_code: string
  address_1: string
  address_2: string
  user_id: string
  bank_data: {
    bank_name: string | null
    account_type: string | null
    account_no: string | null
    ifsc_code: string | null
  }

  kyc_status: 'Approved' | 'Rejected' | 'Pending' | 'Unsubmitted'
  kyc_comment: string
  kyc_reviewed_by: string | null
  kyc_reviewed_at: string | null

  kyc_files: {
    file_name_download: string
    file_name: string
    file: string
  }[]
}

interface KycState {
  kycData: KycData | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | { detail: string } | null
}

type KycError = string | { detail: string } | null

export const fetchKycData = createAsyncThunk(
  'kyc/fetchKycData',
  async (
    { user_id, token }: { user_id: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get(
        `${baseURL}kyc/application?user_id=${encodeURIComponent(user_id)}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch KYC')
    }
  },
)

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    kycData: null,
    status: 'idle',
    error: null,
  } as KycState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKycData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(
        fetchKycData.fulfilled,
        (state, action: PayloadAction<KycData>) => {
          state.status = 'succeeded'
          state.kycData = action.payload
        },
      )
      .addCase(fetchKycData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as KycError
      })
  },
})

export default kycSlice.reducer
