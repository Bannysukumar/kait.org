import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Plan {
    plan_id: string
    name: string
    description: string
    min_amount: number
    lock_in_period: number
}

export interface PlanCombo {
    plan_combo_id: string
    name: string
    description: string
    min_amount: number
    lock_in_period: number
    plans: Plan[]
    status: boolean
    created_at: string
    updated_at: string
}

interface PlanComboState {
    items: PlanCombo[]
    loading: boolean
    error: string | null
}

const initialState: PlanComboState = {
    items: [],
    loading: false,
    error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchDetailsComboList = createAsyncThunk(
    'planCombo/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get<PlanCombo[]>(`${baseURL}plan/detailed_combo_list`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
            })
            return response.data
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || 'Failed to fetch plan combos')
        }
    },
)

const planComboSlice = createSlice({
    name: 'planCombo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDetailsComboList.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDetailsComboList.fulfilled, (state, action: PayloadAction<PlanCombo[]>) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchDetailsComboList.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default planComboSlice.reducer
