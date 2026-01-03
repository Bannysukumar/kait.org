import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface ProgressItem {
    title: string
    current: number | string
    required: number
    status: boolean
    remaining: number
}

export interface ClubProgress {
    next_club: string
    progress: ProgressItem[]
}

interface ClubProgressState {
    data: ClubProgress | null
    loading: boolean
    error: string | null
}

const initialState: ClubProgressState = {
    data: null,
    loading: false,
    error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchClubProgress = createAsyncThunk<
    ClubProgress,
    { user_id: string },
    { rejectValue: string }
>(
    'clubProgress/fetch',
    async ({ user_id }, { rejectWithValue }) => {
        try {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('token') || ''
                    : ''

            if (!token) throw new Error('Token not found')

            const response = await axios.get(`${baseURL}user/club_next_progress`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { user_id },
            })

            return response.data as ClubProgress
        } catch (err: any) {
            const message =
                err?.response?.data?.detail?.[0]?.msg ||
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong'
            return rejectWithValue(message)
        }
    }
)

const clubProgressSlice = createSlice({
    name: 'clubProgress',
    initialState,
    reducers: {
        resetClubProgress: (state) => {
            state.data = null
            state.loading = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClubProgress.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClubProgress.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchClubProgress.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Failed to fetch progress'
            })
    },
})

export const { resetClubProgress } = clubProgressSlice.actions
export default clubProgressSlice.reducer
