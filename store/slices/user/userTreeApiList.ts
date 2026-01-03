// store/slices/user/userTreeApiList.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface UserTreeNode {
  user_id: string
  parent_id: string | null
  id: string
  name: string
  user_name: string | null
  email: string
  club: string
  level: number
  total_staking: number
  team_staking: number
}

interface UserTreeState {
  data: UserTreeNode[]
  loading: boolean
  error: string | null
}

const initialState: UserTreeState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchUserTree = createAsyncThunk<
  UserTreeNode[],
  { root_user_id: string; filter_user_id: string; token: string },
  { rejectValue: string }
>(
  'userTree/fetchUserTree',
  async ({ root_user_id, filter_user_id, token }, { rejectWithValue }) => {
    if (!API_BASE_URL) {
      return rejectWithValue('API base URL is not defined')
    }

    try {
      const response = await axios.get<UserTreeNode[]>(`${API_BASE_URL}user/user_tree`, {
        params: { root_user_id, filter_user_id },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      if ((response.data as any)?.detail === 'No records found') {
        return [] 
      }

      return response.data
    } catch (error: any) {
      if (error?.response?.status === 404 &&
          error?.response?.data?.detail === 'No records found') {
        return []
      }
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch user tree'
      )
    }
  }
)

const userTreeSlice = createSlice({
  name: 'userTree',
  initialState,
  reducers: {
    resetUserTree: (state) => {
      state.data = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTree.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserTree.fulfilled, (state, action: PayloadAction<UserTreeNode[]>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUserTree.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unknown error'
      })
  },
})

export const { resetUserTree } = userTreeSlice.actions
export default userTreeSlice.reducer
