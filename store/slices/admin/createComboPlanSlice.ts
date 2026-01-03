import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface CreateComboParams {
    plan_name: string;
    description: string;
    min_amount: number;
    lipy: number;
    plan_ids: string[];
}

interface CreateComboState {
    loading: boolean;
    error: string | null;
    success: string | null; // store success message
}

const initialState: CreateComboState = {
    loading: false,
    error: null,
    success: null,
};




const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createCombo = createAsyncThunk(
    'combo/create',
    async (data: CreateComboParams, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            params.append('plan_name', data.plan_name);
            params.append('description', data.description);
            params.append('min_amount', data.min_amount.toString());
            params.append('lipy', data.lipy.toString());
            data.plan_ids.forEach((id) => params.append('plan_ids', id));

            const response = await axios.post(
                `${baseURL}plan/combo/create`,
                params,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                }
            );

            return response.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.detail || 'Failed to create combo');
        }
    }
);

const comboSlice = createSlice({
    name: 'combo',
    initialState,
    reducers: {
        clearComboState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCombo.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createCombo.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = action.payload.detail || 'Combo created successfully';
            })
            .addCase(createCombo.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload?.detail || action.payload || 'Failed to create combo';
            });
    },
});

export const { clearComboState } = comboSlice.actions;
export default comboSlice.reducer;
