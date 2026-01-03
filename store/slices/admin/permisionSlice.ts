import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PermissionPayload {
  userId: string
  permissionType: PermissionType
  permissionValue: boolean
  token: string
}

export type PermissionType =
  | 'transfer'
  | 'withdraw'
  | 'withdraw_staking'
  | 'level_income'
  | 'credit'
  | 'suspend'
  | 'adhoc_income'
  | 'adhoc_transfer'
  

interface PermissionState {
  loading: boolean
  error: string | null
  message: string | null
  userPermissions: {
    [userId: string]: Record<PermissionType, boolean>
  }
  updatingUserIds: string[]
}

const initialState: PermissionState = {
  loading: false,
  error: null,
  message: null,
  userPermissions: {},
  updatingUserIds: [],
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const updateUserPermission = createAsyncThunk<
  { detail: string },
  PermissionPayload,
  { rejectValue: string }
>(
  'permissions/updateUserPermission',
  async ({ userId, permissionType, permissionValue, token }, thunkAPI) => {
    try {
      const params = new URLSearchParams()
      params.append('user_id', userId)
      params.append('permission_type', permissionType)
      params.append('permission_value', String(permissionValue))

      const url = new URL('user/permission', baseURL).toString()

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(), // ✅ FIXED HERE
      })

      if (!res.ok) {
        const errorBody = await res.json()
        const errorMessage = errorBody?.detail || res.statusText
        throw new Error(errorMessage)
      }

      const data = await res.json()
      return data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Failed to update permission',
      )
    }
  },
)


const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    updateLocalPermission: (
      state,
      action: PayloadAction<{
        userId: string
        permissionType: PermissionType // Updated to use PermissionType
        permissionValue: boolean
      }>,
    ) => {
      const { userId, permissionType, permissionValue } = action.payload
      if (!state.userPermissions[userId]) {
        state.userPermissions[userId] = {} as Record<PermissionType, boolean>
      }
      state.userPermissions[userId][permissionType] = permissionValue
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserPermission.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.message = null
        state.updatingUserIds.push(action.meta.arg.userId)
      })
      .addCase(updateUserPermission.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.detail

        const { userId, permissionType, permissionValue } = action.meta.arg
        if (!state.userPermissions[userId]) {
          state.userPermissions[userId] = {} as Record<PermissionType, boolean>
        }
        state.userPermissions[userId][permissionType] = permissionValue

        state.updatingUserIds = state.updatingUserIds.filter(
          (id) => id !== userId,
        )
      })
      .addCase(updateUserPermission.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update permission'

        const { userId } = action.meta.arg
        state.updatingUserIds = state.updatingUserIds.filter(
          (id) => id !== userId,
        )
      })
  },
})

export const { updateLocalPermission } = permissionSlice.actions
export default permissionSlice.reducer
