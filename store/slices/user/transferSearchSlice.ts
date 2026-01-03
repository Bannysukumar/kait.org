import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface EmailOption {
  id: string;
  value: {
    name: string;
    email: string;
  };
}

interface TransferEmailState {
  options: EmailOption[];
  loading: boolean;
  error: string | null;
}

const initialState: TransferEmailState = {
  options: [],
  loading: false,
  error: null,
};

export const fetchTransferEmails = createAsyncThunk<
  EmailOption[],
  string,
  { rejectValue: string }
>("transferEmail/fetch", async (search, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${baseURL}user/get_email_for_transfer`, {
      params: { search },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || "Failed to fetch emails");
  }
});

const transferSearchSlice = createSlice({
  name: "transferEmail",
  initialState,
  reducers: {
    clearTransferEmails: (state) => {
      state.options = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload;
      })
      .addCase(fetchTransferEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearTransferEmails } = transferSearchSlice.actions;
export default transferSearchSlice.reducer;
