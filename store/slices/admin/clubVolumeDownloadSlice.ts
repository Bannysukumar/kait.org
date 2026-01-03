// store/slices/admin/clubVolumeDownloadSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface DownloadClubVolumeParams {
  year_month?: string
  club_types?: string[]
  emails?: string[]
  token: string
}

export const downloadClubVolume = createAsyncThunk<
  boolean,
  DownloadClubVolumeParams,
  { rejectValue: string }
>('clubVolume/download', async (params, { rejectWithValue }) => {
  try {
    const { token, year_month, club_types, emails } = params
    const searchParams = new URLSearchParams()

    if (year_month) {
      searchParams.append('year_month', year_month)
    }

    club_types?.forEach((type) => {
      if (type) searchParams.append('club_types', type)
    })

    emails?.forEach((email) => {
      if (email) searchParams.append('emails', email)
    })

    const url = `${baseURL}club/admin/club_volumn/download?${searchParams.toString()}`

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `club_volume_${year_month || 'all'}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    return true
  } catch (error: any) {
    const message =
      error?.response?.data?.detail || error.message || 'Download failed'
    return rejectWithValue(message)
  }
})

const downloadSlice = createSlice({
  name: 'clubVolumeDownload',
  initialState: {
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadClubVolume.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(downloadClubVolume.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(downloadClubVolume.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Download error'
      })
  },
})

export default downloadSlice.reducer
