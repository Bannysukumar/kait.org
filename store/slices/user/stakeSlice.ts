import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL


interface StakingPlan {
  name: string
  plan_id: string
  min_amount: number
  description: string
}

interface WalletSplitConfig {
  id: string
  value: Record<string, number>
  balance: Record<string, number>
}

interface StakingState {
  plans: StakingPlan[]
  walletSplits: WalletSplitConfig[]
  loading: boolean
  error: string | null
}


const initialState: StakingState = {
  plans: [],
  walletSplits: [],
  loading: false,
  error: null,
}


export const fetchStakingPlans = createAsyncThunk<
  StakingPlan[],
  void,
  { rejectValue: string }
>('staking/fetchStakingPlans', async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get('token') || localStorage.getItem('token')
    if (!token) return rejectWithValue('No token found')

    const response = await axios.get(`${baseURL}plan/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    return response.data
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Failed to fetch plans'
    )
  }
})

export const fetchWalletSplits = createAsyncThunk<
  WalletSplitConfig[],
  void,
  { rejectValue: string }
>('staking/fetchWalletSplits', async (_, thunkAPI) => {
  try {
    const token =
      typeof window !== 'undefined' ? Cookies.get('token') || localStorage.getItem('token') : null

    const response = await axios.get(`${baseURL}wallet/split_config/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || 'Failed to fetch wallet splits'
    )
  }
})

export const performStake = createAsyncThunk<
  void,
  { plan_id: string; wallet_split_id: string; amount: number },
  { rejectValue: string }
>('staking/performStake', async ({ plan_id, wallet_split_id, amount }, thunkAPI) => {
  try {
    const token = typeof window !== 'undefined' ? Cookies.get('token') : null

    const payload = qs.stringify({ plan_id, wallet_split_id, amount })

    await axios.post(`${baseURL}stake/perform`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message || 'Failed to perform stake'
    )
  }
})


const stakingSlice = createSlice({
  name: 'staking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStakingPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStakingPlans.fulfilled, (state, action) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(fetchStakingPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch staking plans'
      })
      .addCase(fetchWalletSplits.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletSplits.fulfilled, (state, action: PayloadAction<WalletSplitConfig[]>) => {
        state.loading = false
        state.walletSplits = action.payload
      })
      .addCase(fetchWalletSplits.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch wallet splits'
      })
      .addCase(performStake.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(performStake.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(performStake.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to perform stake'
      })
  },
})

export default stakingSlice.reducer
