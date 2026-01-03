import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const downloadKycDocument = createAsyncThunk<
  void,
  { user_id: string; document_name: string },
  { rejectValue: string }
>(
  'kyc/downloadDocument',
  async ({ user_id, document_name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return rejectWithValue('User is not authenticated')
      }

      const response = await axios.get(
        `${baseURL}kyc/download_doc?user_id=${encodeURIComponent(user_id)}&document_name=${encodeURIComponent(document_name)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', 
        },
      )

      const filename =
        response.headers['content-disposition']
          ?.split('filename=')[1]
          ?.replace(/"/g, '') || document_name

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to download KYC document'
      return rejectWithValue(errorMessage)
    }
  },
)

export interface KycState {
  statuses: any;
  kycApplications: never[];
  totalPages: number;
  data: any | null
  loading: boolean
  error: string | null
}

const initialState: KycState = {
  data: null,
  loading: false,
  error: null,
  kycApplications: [],
  totalPages: 0,
  statuses: {}, 
}

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadKycDocument.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(downloadKycDocument.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(downloadKycDocument.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to fetch KYC details'
      })
  },
})

export default kycSlice.reducer
