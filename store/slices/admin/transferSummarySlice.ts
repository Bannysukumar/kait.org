import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// 1. Interfaces
export interface TransferSummaryItem {
  id: string
  email: string
  amount: number
  opening_balance: number
  closing_balance: number
  transaction_type: string
  description: string
  transaction_link?: string
  created_at: string
  updated_at?: string | null
  wallet_name: string
}


interface FetchTransferSummaryParams {
  wallets?: string[]
  transaction_types?: string[]
  wallet_filter?: string[]
  emails?: string[]
  page?: number
  page_size?: number
}

interface TransferSummaryState {
  items: TransferSummaryItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
  loading: boolean
  error: string | null
  filters: {
    wallets: string[]
    transaction_types: string[]
    wallet_filter: string[]
    emails: string[]
  }
  downloadLoading: boolean
  downloadError: string | null
}

const initialState: TransferSummaryState = {
  items: [],
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 1,
  loading: false,
  error: null,
  filters: {
    wallets: [],
    transaction_types: [],
    wallet_filter: [],
    emails: [],
  },
  downloadLoading: false,
  downloadError: null,
}

// 3. Base URL
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

// 4. Thunks
export const fetchTransferSummary = createAsyncThunk(
  'transferSummary/fetch',
  async (params: FetchTransferSummaryParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const searchParams = new URLSearchParams()

      params.wallets?.forEach((wallet) =>
        searchParams.append('wallets', wallet),
      )
      params.transaction_types?.forEach((type) =>
        searchParams.append('transaction_types', type),
      )
      params.wallet_filter?.forEach((filter) =>
        searchParams.append('wallet_filter', filter),
      )
      params.emails?.forEach((email) => searchParams.append('emails', email))
      if (params.page) searchParams.append('page', String(params.page))
      if (params.page_size)
        searchParams.append('page_size', String(params.page_size))

      const response = await axios.get(
        `${baseURL}wallet/summary/admin?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        'Failed to fetch transfer summary',
      )
    }
  },
)

export const downloadTransferSummary = createAsyncThunk(
  'transferSummary/download',
  async (
    params: {
      wallets?: string[]
      transaction_types?: string[]
      wallet_filter?: string[]
      emails?: string[]
    },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem('token')
      const searchParams = new URLSearchParams()

      params.wallets?.forEach((wallet) =>
        searchParams.append('wallets', wallet),
      )
      params.transaction_types?.forEach((type) =>
        searchParams.append('transaction_types', type),
      )
      params.wallet_filter?.forEach((filter) =>
        searchParams.append('wallet_filter', filter),
      )
      params.emails?.forEach((email) => searchParams.append('emails', email))

      const response = await axios.get(
        `${baseURL}wallet/summary/download/admin?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/octet-stream',
          },
          responseType: 'blob',
        },
      )

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transfer-summary.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        'Failed to download transfer summary',
      )
    }
  },
)

// 5. Slice
const transferSummarySlice = createSlice({
  name: 'transferSummary',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<TransferSummaryState['filters']>,
    ) => {
      state.filters = action.payload
      state.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload
    },
    clearTransferErrors: (state) => {
      state.error = null
      state.downloadError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTransferSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransferSummary.fulfilled, (state, action) => {
        const payload = action.payload
        state.loading = false
        state.items = payload.items || []
        state.total = payload.total || 0
        state.page = payload.page || 1
        state.page_size = payload.page_size || 10
        state.total_pages = payload.total_pages || 1
      })
      .addCase(fetchTransferSummary.rejected, (state, action) => {
        state.loading = false
        state.items = []
        state.total = 0
        state.total_pages = 1
        state.error = action.payload as string
      })

      // Download
      .addCase(downloadTransferSummary.pending, (state) => {
        state.downloadLoading = true
        state.downloadError = null
      })
      .addCase(downloadTransferSummary.fulfilled, (state) => {
        state.downloadLoading = false
      })
      .addCase(downloadTransferSummary.rejected, (state, action) => {
        state.downloadLoading = false
        state.downloadError = action.payload as string
      })
  },
})

// 6. Exports
export const { setFilters, setPage, setPageSize, clearTransferErrors } =
  transferSummarySlice.actions

export default transferSummarySlice.reducer
