import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface VolumeItem {
  email: string
  level: number
  amount: number
  staked_at: string
}

interface ProgressItem {
  title: string
  current: number | string
  required: number | string
  status: boolean
  remaining: number | string
}

export interface ClubVolumeItem {
  user_id: string
    email: string
  full_name: string
  club_type: string | null
  eligible_for_reward: boolean
  next_step?: {
    next_club: string
    progress: ProgressItem[]
  }
  volumn: VolumeItem[]
}

export interface ClubVolumeResponse {
  items: ClubVolumeItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ClubVolumeParams {
  year_month?: string
  emails?: string[]
  club_types?: string[]
  page?: number
  page_size?: number
  token?: string
}

interface ClubVolumeState {
  items: ClubVolumeItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
  loading: boolean
  error: string | null
}

const initialState: ClubVolumeState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 0,
  loading: false,
  error: null,
}

export const fetchClubVolume = createAsyncThunk<
  ClubVolumeResponse,
  ClubVolumeParams,
  { rejectValue: string }
>('clubVolume/fetch', async (params, { rejectWithValue }) => {
  try {
    const { token = '', ...query } = params
    const searchParams = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => searchParams.append(key, val))
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await axios.get<ClubVolumeResponse>(
      `${baseURL}club/admin/club_volumn?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        page_size: params.page_size || 10,
        total_pages: 0,
      }
    }

    return rejectWithValue(
      error?.response?.data?.detail || error.message || 'Failed to fetch data'
    )
  }
})

const clubVolumeSlice = createSlice({
  name: 'clubVolume',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubVolume.pending, (state) => {
        state.loading = true
        state.error = null
        state.items = [] 
      })
      .addCase(fetchClubVolume.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.page_size = action.payload.page_size
        state.total_pages = action.payload.total_pages
      })
      .addCase(fetchClubVolume.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Error fetching data'
        state.items = [] 
        state.total = 0
        state.total_pages = 0
      })
  },
})


export default clubVolumeSlice.reducer
