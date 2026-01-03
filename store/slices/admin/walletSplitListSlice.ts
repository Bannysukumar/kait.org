  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
  import axios from 'axios'

  export interface SplitConfigItem {
    id: string
    value: Record<string, number> // e.g., { fiat_wallet: 10, income_wallet: 20, ... }
  }

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

  interface WalletSplitListState {
    items: SplitConfigItem[]
    loading: boolean
    error: string | null
  }

  const initialState: WalletSplitListState = {
    items: [],
    loading: false,
    error: null,
  }

  export const fetchSplitConfigList = createAsyncThunk(
    'walletSplitList/fetch',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token')

        const response = await axios.get(`${baseURL}wallet/split_config/list`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        return response.data as SplitConfigItem[]
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch split config list'
        )
      }
    }
  )

  const walletSplitListSlice = createSlice({
    name: 'walletSplitList',
    initialState,
    reducers: {
      clearSplitConfigList: (state) => {
        state.items = []
        state.loading = false
        state.error = null
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchSplitConfigList.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchSplitConfigList.fulfilled, (state, action) => {
          state.loading = false
          state.items = action.payload
        })
        .addCase(fetchSplitConfigList.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
    },
  })

  export const { clearSplitConfigList } = walletSplitListSlice.actions
  export default walletSplitListSlice.reducer
