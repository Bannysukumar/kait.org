import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface UpdateSupervisorPayload {
  user_id: string
  first_name: string
  last_name: string
  gender: "male" | "female"
  mobile: string
  email: string
  password: string
  confirm_password: string
  supervisor_status: boolean
}

interface UpdateState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: UpdateState = {
  loading: false,
  success: false,
  error: null,
}

export const updateSupervisor = createAsyncThunk<
  void,
  UpdateSupervisorPayload,
  { rejectValue: string }
>("supervisor/update", async (payload, thunkAPI) => {
  try {
    const token = localStorage.getItem("token")

    const formData = new URLSearchParams()
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    await axios.put(`${baseURL}supervisor/update`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err?.response?.data?.detail || "Failed to update supervisor"
    )
  }
})

const supervisorUpdateSlice = createSlice({
  name: "supervisorUpdate",
  initialState,
  reducers: {
    resetSupervisorUpdate: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSupervisor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSupervisor.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(updateSupervisor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Update failed"
      })
  },
})

export const { resetSupervisorUpdate } = supervisorUpdateSlice.actions
export default supervisorUpdateSlice.reducer
