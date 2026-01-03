import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface TeamMember {
  id: string
  user_id: string
  name: string | null
  user_name: string | null
  email: string | null
  club: string | null
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

interface Level {
  total_users: number
  level: number
  total_staking: number
  user_count: number
  total_volume: number
}

interface LevelInfo {
  levels: Level[]
}

interface Verified {
  email: boolean
  kyc: boolean
}

interface ClubCounts {
  Basic: number
  Bronze: number
  Silver: number
  Gold: number
  Platinum: number
  Diamond: number
  DoubleDiamond: number
  TripleDiamond: number
  KaitKing: number
}

interface Wallets {
  fixed_ros_wallet: number
  kiat_wallet: number
  fiat_wallet: number
  restake_wallet: number
  income_wallet: number
  super_wallet: number
  total_ros: number
  total_fixed_ros: number
  total_earnings: number
  ros_wallet: number
  ros_spent: number
  fixed_ros_spent: number
  adhoc_wallet: number
  vpay_voucher: number
  ecommerce_voucher: number
  total_level_income: number
  total_withdraw: number
}


interface IncomeEligibility {
  user_max_income_limit: number
  total_income: number
  available_space: number
}

interface ProgressItem {
  title: string
  current: number | string
  required: number | string
  status: boolean
  remaining: number | string
}

interface NextProgress {
  next_club: string
  progress: ProgressItem[]
}

export interface Nominee {
  name: string | null
  pan: string | null
  relationship: string | null
}

export interface Bank {
  bank_name: string | null
  account_type: string | null
  account_no: string | null
  ifsc_code: string | null
}

export interface UserData {
  total_withdraw: any
  id: string
  name: string
  email: string
  user_name: string
  total_users: number
  verified: Verified
  wallet: string
  user_club: string
  total_staking: number
  team_staking: number
  referral_code: string
  joining_date: string
  sponsor: string
  sponsor_name: string
  sponsor_username: string
  sponsor_email: string
  withdraw: boolean
  withdraw_staking: boolean
  adhoc_income: boolean
  adhoc_transfer: boolean
  suspend: boolean
  transfer: boolean
  level_income: number
  credit: boolean
  dob?: string
  nominee?: Nominee
  nationality?: string
  bank?: Bank
  level_info: LevelInfo
  team_tree: TeamMember[]
  club_counts: ClubCounts
  wallets: Wallets
  income_eligibility: IncomeEligibility
  next_progress: NextProgress
}

export const fetchUserData = createAsyncThunk<
  UserData,
  string | undefined,
  { rejectValue: string }
>('user/fetchData', async (user_id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${baseURL}user/data`, {
      params: user_id ? { user_id } : {},
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const response = res.data

    const normalizeTeamTree = (members: any[]): TeamMember[] =>
      members.map((member) => ({
        id: member.id,
        user_id: member.id,
        name: member.name,
        user_name: member.user_name,
        email: member.email,
        club: member.club,
        level: member.level,
        total_staking: member.total_staking,
        team_staking: member.team_staking,
        children: member.children ? normalizeTeamTree(member.children) : [],
      }))

    const normalizedData: UserData = {
      id: response.user_id,
      name: response.full_name,
      email: response.email,
      user_name: response.user_name,
      joining_date: response.joining_date,
      wallet: response.wallet,
      sponsor: response.sponsor,
      sponsor_name: response.sponsor?.split('(')[0]?.trim() || '',
      sponsor_username: response.sponsor_user_name || '',
      sponsor_email: response.sponsor?.match(/\(([^)]+)\)/)?.[1] || '',
      referral_code: response.user_id,
      total_users: response.total_members || 0,
      verified: {
        email: response.email_verified,
        kyc: response.kyc_verified,
      },
      user_club: response.user_club || 'Basic',
      total_staking: response.invested || 0,
      team_staking: response.team_business || 0,
      total_withdraw: response.total_withdraw || 0,
      withdraw: response.withdraw ?? false,
      withdraw_staking: response.withdraw_staking ?? false,
      adhoc_income: response.adhoc_income ?? false,
      adhoc_transfer: response.adhoc_transfer ?? false,
      suspend: response.suspend ?? false,
      transfer: response.transfer ?? false,
      credit: response.credit ?? false,
      level_income: response.level_income ?? 0,

      dob: response.dob,
      nominee: response.nominee,
      nationality: response.nationality,
      bank: response.bank,

      level_info: {
        levels:
          response.level_info?.levels?.map((lvl: any) => ({
            ...lvl,
            total_volume: lvl.total_staking,
            user_count: lvl.total_users,
          })) || [],
      },

      team_tree: normalizeTeamTree(response.team_tree || []),

      club_counts: {
        Basic: response.club_counts?.Basic || 0,
        Bronze: response.club_counts?.Bronze || 0,
        Silver: response.club_counts?.Silver || 0,
        Gold: response.club_counts?.Gold || 0,
        Platinum: response.club_counts?.Platinum || 0,
        Diamond: response.club_counts?.Diamond || 0,
        DoubleDiamond: response.club_counts?.['Double Diamond'] || 0,
        TripleDiamond: response.club_counts?.['Triple Diamond'] || 0,
        KaitKing: response.club_counts?.['Kait King'] || 0,
      },

      wallets: {
        fixed_ros_wallet: response.fixed_ros_wallet || 0,
        kiat_wallet: response.kiat_wallet || 0,
        fiat_wallet: response.fiat_wallet || 0,
        restake_wallet: response.restake_wallet || 0,
        income_wallet: response.income_wallet || 0,
        super_wallet: response.super_wallet || 0,
        total_ros: response.total_ros || 0,
        total_fixed_ros: response.total_fixed_ros || 0,
        total_earnings: response.total_earnings || 0,
        ros_wallet: response.ros_wallet || 0,
        ros_spent: response.ros_spent || 0,
        fixed_ros_spent: response.fixed_ros_spent || 0,
        adhoc_wallet: response.adhoc_wallet || 0,
        vpay_voucher: response.vpay_voucher || 0,
        ecommerce_voucher: response.ecommerce_voucher || 0,
        total_level_income: response.total_level_income || 0,
        total_withdraw: response.total_withdraw || 0,
      },


      income_eligibility: response.income_eligibility || {
        user_max_income_limit: 0,
        total_income: 0,
        available_space: 0,
      },

      next_progress: response.next_progress || {
        next_club: '',
        progress: [],
      },
    }

    return normalizedData
  } catch (err: any) {
    return rejectWithValue(err.response?.data || 'Error fetching user data')
  }
})

interface UserState {
  data: UserData | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong'
      })
  },
})

export default userSlice.reducer
