// tokenAuthSlice.ts
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'

interface UserState {
  user: {
    user_id: string | null
    userName: string | null
    role: string | null
  } | null
  isAuthenticated: boolean
  error: string | null
}

const getUserDetailsFromToken = (): {
  user_id: string | null
  userName: string | null
  role: string | null
} => {
  const token = Cookies.get('token') || localStorage.getItem('token')

  if (!token) {
    console.error('No token found')
    return { user_id: null, userName: null, role: null }
  }

  try {
    const decodedToken: any = jwtDecode(token)
    return {
      user_id: decodedToken.user_id || null,
      userName: decodedToken.name || null, 
      role: decodedToken.role || null,
    }
  } catch (error) {
    console.error('Failed to decode token:', error)
    return { user_id: null, userName: null, role: null }
  }
}


const tokenAuthSlice = createSlice({
  name: 'tokenAuth',
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
  } as UserState,
  reducers: {
    setTokenUser: (
      state,
      action: PayloadAction<{
        user_id: string | null
        userName: string | null
        role: string | null
      } | null>,
    ) => {
      state.user = action.payload
      state.isAuthenticated = action.payload !== null
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})


export const fetchUserDetailsAndSet = () => (dispatch: AppDispatch) => {
  const { user_id, userName, role } = getUserDetailsFromToken()
  if (user_id && userName && role) {
    dispatch(setTokenUser({ user_id, userName, role }))
  } else {
    console.log('No valid user details found.')
    dispatch(setTokenUser(null))
  }
}


export const { setTokenUser, setAuthError } = tokenAuthSlice.actions
export default tokenAuthSlice.reducer
