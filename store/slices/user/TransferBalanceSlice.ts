import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface WalletBalanceResponse {
  total: number;
  max_allowed_to_withdraw: number;
}

interface WalletBalanceState {
  balances: Record<string, WalletBalanceResponse | null>;
  loading: boolean;
  error: string | null;
}

const initialState: WalletBalanceState = {
  balances: {},
  loading: false,
  error: null,
};

export const fetchWalletBalance = createAsyncThunk(
  'walletBalance/fetch',
  async (walletKind: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}transfer/balance?wallet=${walletKind}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return { walletKind, data: response.data as WalletBalanceResponse };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch wallet balance');
    }
  }
);

const walletBalanceSlice = createSlice({
  name: 'walletBalance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWalletBalance.fulfilled,
        (state, action: PayloadAction<{ walletKind: string; data: WalletBalanceResponse }>) => {
          state.loading = false;
          state.balances[action.payload.walletKind] = action.payload.data;
        }
      )
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default walletBalanceSlice.reducer;
