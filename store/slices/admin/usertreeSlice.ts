import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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
  children?: UserTreeNode[] // optional children
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

// Async thunk to fetch user tree
export const fetchUserTree = createAsyncThunk<
  UserTreeNode[],
  { root_user_id: string; filter_user_id: string; token: string },
  { rejectValue: string }
>(
  'userTree/fetchUserTree',
  async ({ root_user_id, filter_user_id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get<UserTreeNode[]>(`${BASE_URL}user/user_tree`, {
        params: { root_user_id, filter_user_id },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        validateStatus: (status) => status < 500, // Let 404 go through
      })

      // Handle 404 or "No records found"
      if (response.status === 404 || (response.data as any)?.detail === 'No records found') {
        return [] // Treat as empty tree
      }

      return response.data ?? []
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        'Failed to fetch user tree'
      return rejectWithValue(errMsg)
    }
  }
)

const userTreeSlice = createSlice({
  name: 'userTree',
  initialState,
  reducers: {
    // Reset the tree completely
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
        state.data = [] // Clear previous data when fetching new
      })
      .addCase(fetchUserTree.fulfilled, (state, action: PayloadAction<UserTreeNode[]>) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchUserTree.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unknown error'
        state.data = [] // Clear tree on error
      })
  },
})

export const { resetUserTree } = userTreeSlice.actions
export default userTreeSlice.reducer
