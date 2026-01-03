import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export interface Supervisor {
  user_id: string
  first_name: string
  last_name: string
  gender: string
  role: string
  mobile: string
  email: string
  status: boolean
  created_at: string
}

interface SupervisorListResponse {
  items: Supervisor[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// --- State ---

interface SupervisorState {
  list: Supervisor[]
  isLoading: boolean
  error: string | null
  total: number
  currentPage: number
  pageSize: number
}

const initialState: SupervisorState = {
  list: [],
  isLoading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
}

// --- Thunk ---

export const fetchSupervisorList = createAsyncThunk<
  { data: Supervisor[]; total: number },
  { page: number; page_size: number },
  { rejectValue: string }
>("supervisor/fetchList", async ({ page, page_size }, thunkAPI) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null

    const res = await axios.get<SupervisorListResponse>(
      `${baseURL}supervisor/list?page=${page}&page_size=${page_size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    return {
      data: res.data.items,
      total: res.data.total,
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.detail || "Failed to fetch supervisor list"
    )
  }
})

// --- Slice ---

const supervisorSlice = createSlice({
  name: "supervisor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupervisorList.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSupervisorList.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload.data
        state.total = action.payload.total
        state.currentPage = action.meta.arg.page
        state.pageSize = action.meta.arg.page_size
      })
      .addCase(fetchSupervisorList.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || "Failed to fetch supervisor list"
      })
  },
})

export default supervisorSlice.reducer
