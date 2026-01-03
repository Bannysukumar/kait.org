import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'


const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchComboOptions = createAsyncThunk(
  "plans/fetchComboOptions",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== 'undefined'
          ? Cookies.get('token') || localStorage.getItem('token')
          : null;

      if (!token) return rejectWithValue('No token found');

      const response = await axios.get(`${baseURL}plan/list/combo`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data; // API returns array
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch plans"
      );
    }
  }
);


interface Plan {
  plan_id: string;
  name: string;
  description: string;
  min_amount: number;
  lock_in_period: number;
}

interface ComboState {
  loading: boolean;
  items: Plan[];
  error: string | null;
}

const initialState: ComboState = {
  loading: false,
  items: [],
  error: null,
};

const comboPlanOptionSlice = createSlice({
  name: "comboPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComboOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComboOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComboOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default comboPlanOptionSlice.reducer;
