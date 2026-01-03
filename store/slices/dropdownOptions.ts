import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface DropdownItem {
  id: string
  value: string | number | null
}

export interface DropdownOptions {
  roles: DropdownItem[]
  genders: DropdownItem[]
  account_types: DropdownItem[]
  address_types: DropdownItem[]
  kyc_doc_types: DropdownItem[]
  kyc_application_actions: DropdownItem[]
  ewallet_types: DropdownItem[]
  transaction_types: DropdownItem[]
  nominee_relations: DropdownItem[]
  permission_types: DropdownItem[]
  club_types: DropdownItem[]
  wallet_kinds: DropdownItem[]
  ewallet_kinds: DropdownItem[]
  payout_frequencies: DropdownItem[]
  kyc_status: DropdownItem[]
  fiat_transfer_options: DropdownItem[]
  wallets: DropdownItem[]
  wallet_filter: DropdownItem[]
  binary_income_percentage: DropdownItem[]
  restake_wallet_kinds: DropdownItem[]
  voucher_kinds: DropdownItem[]
  ros_pay_wallet_kinds: DropdownItem[]
  capital_pay_wallet_kinds: DropdownItem[]
  capping_limit?: DropdownItem[]

}

interface DropdownOptionsState {
  data: DropdownOptions | null
  loading: boolean
  error: string | null
}

const initialState: DropdownOptionsState = {
  data: null,
  loading: false,
  error: null,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const fetchDropdownOptions = createAsyncThunk<
  DropdownOptions,
  void,
  { rejectValue: string }
>('dropdown/fetchOptions', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<DropdownOptions>(
      `${baseURL}context/dropdown-options`
    )
    return response.data
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch dropdown options'
    )
  }
})

const dropdownOptionsSlice = createSlice({
  name: 'dropdownOptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownOptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDropdownOptions.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDropdownOptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Unexpected error occurred'
      })
  },
})

export default dropdownOptionsSlice.reducer
