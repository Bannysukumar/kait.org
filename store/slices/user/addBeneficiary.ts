import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const addBeneficiary = createAsyncThunk<
  any,
  {
    nick_name: string
    wallet_address: string
    mobile: string
    email: string
    limit?: number | null
  },
  { rejectValue: { detail: string } }
>(
  'beneficiary/add',
  async (
    { nick_name, wallet_address, mobile, email, limit },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new URLSearchParams()
      formData.append('nick_name', nick_name)
      formData.append('wallet_address', wallet_address)
      formData.append('mobile', mobile)
      formData.append('email', email)
      formData.append(
        'limit',
        limit !== null && limit !== undefined ? String(limit) : '',
      )

      const response = await fetch(`${baseURL}beneficiary/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formData.toString(),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error)
      }

      return await response.json()
    } catch (err) {
      return rejectWithValue({ detail: 'Unexpected error occurred' })
    }
  },
)

interface BeneficiaryState {
  loading: boolean
  success: boolean
  error: string | null
}

const initialState: BeneficiaryState = {
  loading: false,
  success: false,
  error: null,
}

const beneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {
    resetBeneficiaryState: (state) => {
      state.loading = false
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBeneficiary.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(addBeneficiary.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(addBeneficiary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.detail || 'Failed to add beneficiary'
      })
  },
})

export const { resetBeneficiaryState } = beneficiarySlice.actions
export default beneficiarySlice.reducer
