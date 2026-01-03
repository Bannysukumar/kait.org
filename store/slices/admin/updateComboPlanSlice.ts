import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateComboPayload {
    plan_combo_id: string;
    plan_name: string;
    description: string;
    min_amount: number;
    lipy: number;
    plan_ids: string[];
    plan_status: boolean;
}

interface UpdateComboState {
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialState: UpdateComboState = {
    loading: false,
    error: null,
    success: null,
};

export const updateCombo = createAsyncThunk(
    'combo/update',
    async (payload: UpdateComboPayload, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');

            const params = new URLSearchParams();
            params.append('plan_combo_id', payload.plan_combo_id);
            params.append('plan_name', payload.plan_name);
            params.append('description', payload.description);
            params.append('min_amount', payload.min_amount.toString());
            params.append('lipy', payload.lipy.toString());
            payload.plan_ids.forEach(id => params.append('plan_ids', id));
            params.append('plan_status', payload.plan_status.toString());

            const response = await axios.put(
                `${baseURL}plan/combo/update`,
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

        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.detail || 'Failed to update combo');
        }
    }
);

const updateComboSlice = createSlice({
    name: 'updateCombo',
    initialState,
    reducers: {
        clearUpdateState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateCombo.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateCombo.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = action.payload.detail || 'Combo updated successfully';
            })
            .addCase(updateCombo.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error =
                    action.payload?.detail ||
                    action.payload ||
                    'Failed to update combo';
            });
    },
});

export const { clearUpdateState } = updateComboSlice.actions;
export default updateComboSlice.reducer;
