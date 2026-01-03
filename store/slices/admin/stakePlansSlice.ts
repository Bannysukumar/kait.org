import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null

// --- Types ---
export interface StakePlan {
  plan_id: string
  name: string
  description: string
  type: string
  min_amount: number
  lock_in_period: number
  return_on_staking: number
  ros_pay_out_frenquency: string
  ros_pay_out_wallet: string
  capital_pay_out_frequency: string
  capital_pay_out_wallet: string | null
  plan_status: boolean
  contract_address?: string
  created_at?: string
  updated_at?: string
}

interface StakePlansState {
  stakePlans: StakePlan[]
  loading: boolean
  error: string | null
}

const initialState: StakePlansState = {
  stakePlans: [],
  loading: false,
  error: null,
}

// --- Fetch Stake Plans ---
export const fetchStakePlans = createAsyncThunk<
  StakePlan[],
  void,
  { rejectValue: string }
>('stakePlans/fetchStakePlans', async (_, { rejectWithValue }) => {
  try {
    const token = getToken()
    const response = await fetch(`${baseURL}plan/detailed_list`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })

    const data = await response.json()
    if (!response.ok) {
      return rejectWithValue(data.detail || 'Failed to fetch stake plans')
    }

    const formattedPlans: StakePlan[] = data.map((plan: any) => ({
      plan_id: plan.plan_id,
      name: plan.name,
      description: plan.description,
      type: plan.type,
      min_amount: plan.min_amount,
      lock_in_period: plan.lock_in_period,
      return_on_staking: plan.return_on_staking,
      ros_pay_out_frenquency: plan.ros_pay_out_frenquency,
      ros_pay_out_wallet: plan.ros_pay_out_wallet,
      capital_pay_out_frequency: plan.capital_pay_out_frequency,
      capital_pay_out_wallet: plan.capital_pay_out_wallet,
      plan_status: plan.status,
      contract_address: plan.contract_address,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
    }))

    return formattedPlans
  } catch {
    return rejectWithValue('Failed to fetch stake plans')
  }
})

// --- Create Stake Plan ---
export const createStakePlan = createAsyncThunk<
  { detail: string },
  {
    plan_name: string
    min_amount: number
    return_on_staking: number
    lock_in_period: number
    plan_status: boolean
    ros_pay_out_frenquency: string
    type: string
    description: string
    capital_pay_out_frequency: string
    ros_wallet: string
    capital_wallet: string
  },
  { rejectValue: string }
>('stakePlans/createStakePlan', async (payload, { rejectWithValue }) => {
  try {
    const token = getToken()

    const formData = new URLSearchParams({
      plan_name: payload.plan_name,
      min_amount: String(payload.min_amount),
      return_on_staking: String(payload.return_on_staking),
      lock_in_period: String(payload.lock_in_period),
      plan_status: String(payload.plan_status),
      ros_pay_out_frenquency: payload.ros_pay_out_frenquency,
      type: payload.type,
      description: payload.description,
      capital_pay_out_frequency: payload.capital_pay_out_frequency,
      ros_wallet: payload.ros_wallet,
      capital_wallet: payload.capital_wallet,
    })

    const response = await fetch(`${baseURL}plan/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData.toString(),
    })

    const data = await response.json()
    if (!response.ok) {
      return rejectWithValue(data.detail || 'Failed to create stake plan')
    }

    return data
  } catch {
    return rejectWithValue('Failed to create stake plan')
  }
})

// --- Update Stake Plan ---
export const updateStakePlan = createAsyncThunk<
  { detail: string },
  {
    plan_id: string
    plan_name: string
    min_amount: number
    return_on_staking: number
    lock_in_period: number
    plan_status: boolean
    ros_pay_out_frenquency: string
    type: string
    description: string
    capital_pay_out_frequency: string
    ros_wallet: string
    capital_wallet: string
  },
  { rejectValue: string }
>('stakePlans/updateStakePlan', async (payload, { rejectWithValue }) => {
  try {
    const token = getToken()

    const formData = new URLSearchParams({
      plan_id: payload.plan_id,
      plan_name: payload.plan_name,
      min_amount: String(payload.min_amount),
      return_on_staking: String(payload.return_on_staking),
      lock_in_period: String(payload.lock_in_period),
      plan_status: String(payload.plan_status),
      ros_pay_out_frenquency: payload.ros_pay_out_frenquency,
      type: payload.type,
      description: payload.description,
      capital_pay_out_frequency: payload.capital_pay_out_frequency,
      ros_wallet: payload.ros_wallet,
      capital_wallet: payload.capital_wallet,
    })

    const response = await fetch(`${baseURL}plan/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData.toString(),
    })

    const data = await response.json()
    if (!response.ok) {
      return rejectWithValue(data.detail || 'Failed to update stake plan')
    }

    return data
  } catch {
    return rejectWithValue('Failed to update stake plan')
  }
})

// --- Slice ---
const stakePlansSlice = createSlice({
  name: 'stakePlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStakePlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStakePlans.fulfilled, (state, action) => {
        state.loading = false
        state.stakePlans = action.payload
      })
      .addCase(fetchStakePlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create
      .addCase(createStakePlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStakePlan.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createStakePlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update
      .addCase(updateStakePlan.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStakePlan.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateStakePlan.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default stakePlansSlice.reducer
