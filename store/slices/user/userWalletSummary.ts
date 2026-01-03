import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface WalletSummaryItem {
  description: string
  date_time: string
  amount: number
  transaction_type: string
  closing_balance: number
}

interface WalletSummaryState {
  items: WalletSummaryItem[]
  total: number
  page: number
  page_size: number
  loading: boolean
  error: string | null
  wallet_kind: string
  search: string
  total_pages: number
}

const initialState: WalletSummaryState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  loading: false,
  error: null,
  wallet_kind: '',
  search: '',
  total_pages: 1,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface FetchParams {
  wallet_kind?: string
  search?: string
  page?: number
  page_size?: number
}

export const fetchWalletSummary = createAsyncThunk(
  'walletSummary/fetch',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const searchParams = new URLSearchParams()

      if (params.wallet_kind) searchParams.append('wallet_kind', params.wallet_kind)
      if (params.search) searchParams.append('search', params.search)
      if (params.page) searchParams.append('page', String(params.page))
      if (params.page_size) searchParams.append('page_size', String(params.page_size))

      const response = await axios.get(
        `${baseURL}wallet/summary/?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      return response.data
    } catch (error: any) {
      const msg = error.response?.data?.detail
      if (error.response?.status === 404 && msg === 'No records found') {
        return rejectWithValue('No records found')
      }
      return rejectWithValue('Failed to fetch wallet summary')
    }
  }
)

const userWalletSummarySlice = createSlice({
  name: 'walletSummary',
  initialState,
  reducers: {
    setWalletKind: (state, action: PayloadAction<string>) => {
      state.wallet_kind = action.payload
      state.page = 1
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletSummary.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
        state.page = action.payload.page || state.page
        state.page_size = action.payload.page_size || state.page_size
        state.total_pages = action.payload.total_pages || 1
      })
      .addCase(fetchWalletSummary.rejected, (state, action) => {
        state.loading = false

        const message = action.payload as string
        if (message === 'No records found') {
          state.items = []
          state.total = 0
          state.error = null
        } else {
          state.error = message
        }
      })
  },
})

export const { setWalletKind, setSearch, setPage, setPageSize } =
  userWalletSummarySlice.actions
export default userWalletSummarySlice.reducer
