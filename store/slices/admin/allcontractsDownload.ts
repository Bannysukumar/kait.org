import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface DownloadState {
  loading: boolean
  error: string | null
}

const initialState: DownloadState = {
  loading: false,
  error: null,
}

export const downloadStakeList = createAsyncThunk<
  void,
  {
    stake_status?: string
    search?: string
    page?: number
    page_size?: number
  }
>('stake/download', async (params, { rejectWithValue }) => {
  try {
    const token =
      localStorage.getItem('token') || (typeof window !== 'undefined' ? document.cookie : '')

    const response = await axios.get(`${baseURL}stake/list/download`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
      params: {
        stake_status: params.stake_status ?? 'any',
        search: params.search ?? '',
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    })

    const contentType = response.headers['content-type']

    // ✅ If it's a JSON blob, parse and show error
    if (contentType?.includes('application/json')) {
      const text = await response.data.text()
      const data = JSON.parse(text)

      if (data?.detail === 'No records found') {
        return rejectWithValue('No records available for download')
      }

      return rejectWithValue(data?.detail || 'Unexpected server response')
    }

    // ✅ Proceed with download if it's a valid file
    const blob = new Blob([response.data], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stake-list.xlsx'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.detail || 'Download failed')
  }
})



const downloadStakeListSlice = createSlice({
  name: 'stakeDownload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadStakeList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(downloadStakeList.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(downloadStakeList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default downloadStakeListSlice.reducer
