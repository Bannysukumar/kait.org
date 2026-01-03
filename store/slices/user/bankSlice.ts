import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import { createSlice } from '@reduxjs/toolkit'
import qs from 'qs'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface BankAccount {
  bank_name: string
  account_type: string
  account_no: string
  ifsc_code: string
}

interface BankAccountState {
  account: BankAccount | null
  loading: boolean
  error: string | null
}

const initialState: BankAccountState = {
  account: null,
  loading: false,
  error: null,
}

export const fetchBankAccount = createAsyncThunk<
  BankAccount,
  void,
  { rejectValue: string }
>('user/fetchBankAccount', async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get('token') || localStorage.getItem('token')
    if (!token) throw new Error('No token found')

    const response = await axios.get(`${baseURL}user/bank_account`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (response.data) return response.data as BankAccount

    throw new Error('Unexpected response format')
  } catch (error: any) {
    console.error(
      'Bank Account Fetch Error:',
      error.response?.data || error.message,
    )
    return rejectWithValue(
      error.response?.data?.detail || 'Failed to fetch bank account',
    )
  }
})


export const updateBankAccount = createAsyncThunk<
  BankAccount,
  BankAccount,
  { rejectValue: string }
>('user/updateBankAccount', async (bankData, { rejectWithValue }) => {
  try {
    const token = Cookies.get('token') || localStorage.getItem('token')
    if (!token) throw new Error('No token found')

    const response = await axios.put(
      `${baseURL}user/bank_account`,
      qs.stringify(bankData), 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    )

    if (response.data) return response.data as BankAccount

    throw new Error('Unexpected response format')
  } catch (error: any) {
    console.error('Bank Account Update Error:', error.response?.data || error.message)
    return rejectWithValue(
      error.response?.data?.detail || 'Failed to update bank account',
    )
  }
})
const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBankAccount.fulfilled, (state, action) => {
        state.loading = false
        state.account = action.payload
      })
      .addCase(fetchBankAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      }).addCase(updateBankAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBankAccount.fulfilled, (state, action) => {
        state.loading = false
        state.account = action.payload
      })
      .addCase(updateBankAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export default bankSlice.reducer
