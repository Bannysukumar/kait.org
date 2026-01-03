import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export interface AddSupervisorPayload {
  first_name: string
  last_name: string
  gender: "male" | "female"
  mobile: string
  email: string
  password: string
  confirm_password: string
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface AddSupervisorState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: AddSupervisorState = {
  loading: false,
  error: null,
  success: false,
}

export const addSupervisor = createAsyncThunk<
  void,
  {
    first_name: string
    last_name: string
    gender: "male" | "female"
    mobile: string
    email: string
    password: string
    confirm_password: string
  },
  { rejectValue: string }
>("supervisor/add", async (payload, thunkAPI) => {
  try {
    const token = localStorage.getItem("token")

    const formData = new URLSearchParams()
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value)
    })

    await axios.post(`${baseURL}supervisor/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.detail || "Failed to add supervisor"
    )
  }
})


const supervisorAddSlice = createSlice({
  name: "supervisorAdd",
  initialState,
  reducers: {
    resetAddSupervisorState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSupervisor.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(addSupervisor.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(addSupervisor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Something went wrong"
      })
  },
})

export const { resetAddSupervisorState } = supervisorAddSlice.actions
export default supervisorAddSlice.reducer
