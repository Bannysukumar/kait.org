// redux/slices/changePasswordSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  error: string | null;
  loading: boolean;
  success: boolean;
}

const initialState: AuthState = {
  token: null,
  error: null,
  loading: false,
  success: false,
};

interface ChangePasswordPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { token, new_password, confirm_password }: ChangePasswordPayload,
    { rejectWithValue }
  ) => {
    try {
      const formData = new URLSearchParams()
      formData.append('token', token)
      formData.append('new_password', new_password)
      formData.append('confirm_password', confirm_password)

      const response = await fetch(`${baseURL}user/change_password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formData.toString(),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Password reset failed')
      }

      return data
    } catch (error) {
      return rejectWithValue('An error occurred while changing the password.')
    }
  }
)


const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setToken, clearToken } = changePasswordSlice.actions;

export default changePasswordSlice.reducer;
