import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'
import { encode } from '../../utils/base64'
import toast from 'react-hot-toast'

export interface KycApplication {
  email: string
  // document_type: string
  user_id: string
  name: string
  user_name: string
  doc_type: string
  docs: Record<string, string[]>
  submitted: string
  status: string
  kycVerified: boolean
}

export interface approveKycApplication {
  user_id: string
  action: 'approve' | 'reject'
  comment?: string
  notify_user?: boolean
}

export interface AuthState {

  verifiedUsername: any
  suggestedUsernames: any
  isAuthenticated: boolean
  isLoading: boolean
  user: any
  error: string | null
  referralLink: string | null
  referralFetched: boolean
  kycApplications: KycApplication[]
  totalPages: number
  name: string | null
  user_id: string | null
  kycRejected: boolean
  // kycStatus: 'under_review' | 'rejected' | 'not_submitted' | 'approved';
  kycVerified: boolean
  kycPending: boolean
  kycStatusLoading: boolean
  kycStatusError: string | null
  usernameAvailable: boolean | null
  usernameError: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,

  isLoading: false,
  user: null,
  error: null,
  referralLink: null,
  referralFetched: false,
  verifiedUsername: undefined,
  suggestedUsernames: undefined,
  kycApplications: [],
  totalPages: 1,
  name: null,
  user_id: null,
  usernameAvailable: null,
  usernameError: null,
  kycRejected: false,
  kycStatusLoading: false,
  kycStatusError: null,
  // kycStatus: 'not_submitted',
  kycVerified: false,
  kycPending: false,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

interface KycListResponse {
  total: number
  page: number
  page_size: number
  total_pages: number
  items: KycApplication[]
}

interface KycState {
  applications: KycApplication[]
  totalPages: number
  currentPage: number
  isLoading: boolean
  error: string | null
}

// LOGIN USER
export const loginUser = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/signin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const token = encode(`${email}:${password}`)
      const response = await axios.post(
        `${baseURL}user/token`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Basic ${token}`,
          },
        }
      )

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token)
        Cookies.set('token', response.data.access_token, { expires: 1 })
      }

      return response.data
    } catch (error: any) {
      const errResponse = error.response?.data
      // Capture "detail" if it exists, else fallback
      const message =
        errResponse?.detail ||
        errResponse?.message ||
        error.message ||
        'Login failed'
      return rejectWithValue(message)
    }
  }
)

// logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) throw new Error('No token found')

      await axios.get(`${baseURL}user/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      localStorage.removeItem('token')
      Cookies.remove('token')

      return null
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Logout failed.')
    }
  },
)

//check_token
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = Cookies.get('token')
      if (!token) throw new Error('No token found')

      const response = await axios.get(`${baseURL}user/check_token`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return response.data
    } catch (error: any) {
      dispatch(logoutUser())
      return rejectWithValue('Session expired. Please log in again.')
    }
  },
)

//generate_referral_toke
export const generateReferralLink = createAsyncThunk(
  'auth/generateReferralLink',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')
      if (!token) return rejectWithValue("User not authenticated")

      const response = await axios.get(
        `${baseURL}user/generate_referral_token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      return response.data.referral_token

    } catch (error: any) {

      const apiMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data ||
        'Failed to generate referral link'

      return rejectWithValue(apiMessage)
    }
  }
)




// REGISTER USER
export const registerUser = createAsyncThunk<
  any,
  {
    first_name: string
    last_name: string
    email: string
    password: string
    mobile: string
    dob: string
    referral_token?: string
  },
  { rejectValue: { detail: string } }
>(
  'auth/registerUser',
  async (
    { first_name, last_name, dob, email, password, mobile, referral_token },
    { rejectWithValue },
  ) => {
    try {
      const formData = new URLSearchParams()
      formData.append('first_name', first_name)
      formData.append('last_name', last_name)
      formData.append('dob', dob)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('mobile', mobile)

      if (referral_token) {
        formData.append('referral_token', referral_token)
      }

      const response = await axios.post(
        `${baseURL}user/register`,
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        },
      )

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { detail: 'Registration failed' },
      )
    }
  },
)

// RESEND CONFIRMATION EMAIL
export const resendConfirmationEmail = createAsyncThunk(
  'auth/resendConfirmationEmail',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseURL}user/email_resend`,
        { email },
        {
          headers: {
            Authorization: `Basic ${btoa(`${email}:your_password`)}`, // Fix authentication
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      return response.data
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message)
      return rejectWithValue(
        error.response?.data || 'Failed to resend confirmation email',
      )
    }
  },
)

// KYC
//suggestUsername
type SuggestUsernameResponse = string[]

export const suggestUsername = createAsyncThunk<SuggestUsernameResponse, void>(
  'kyc/suggestUsername',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      const response = await axios.post(
        `${baseURL}kyc/suggest_username`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )

      return response.data.detail
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to fetch username suggestions',
      )
    }
  },
)

//verifyUsername
export const verifyUsername = createAsyncThunk(
  'kyc/verifyUsername',
  async (username: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token')
      if (!token) throw new Error('No token found')

      const response = await axios.get(
        `${baseURL}kyc/verify_username?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data && response.data.detail) {
        return response.data.detail
      }

      throw new Error('Unexpected response format')
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ||
        error.message ||
        'An error occurred while verifying the username',
      )
    }
  },
)

//verifyKYCStatus
export const verifyKYCStatus = createAsyncThunk<
  boolean | 'rejected' | 'pending',
  void,
  { rejectValue: string }
>('auth/verifyKYCStatus', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token') || Cookies.get('token')
  try {
    const res = await fetch(`${baseURL}kyc/verify_status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    const data = await res.json()

    if (data.detail === 'KYC Approved') return true
    if (data.detail?.toLowerCase().includes('rejected')) return 'rejected'
    if (data.detail === 'KYC Pending for review') return 'pending'

    return false // Not verified yet
  } catch (err) {
    return rejectWithValue('Failed to fetch KYC status')
  }
})

//KYCAPPLICATION
export const submitKyc = createAsyncThunk(
  'kyc/submitKyc',
  async (
    { formData }: { formData: FormData },
    { rejectWithValue, dispatch },
  ) => {
    try {
      // Get the token from cookies
      const token = Cookies.get('token')

      if (!token) {
        return rejectWithValue('Authentication token is missing')
      }

      const response = await axios.post(`${baseURL}kyc/application`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error: any) {
      let errorMessage = 'Failed to submit KYC'

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const responseData = error.response.data
          if (typeof responseData === 'string') {
            errorMessage = responseData
          } else if (responseData?.detail) {
            errorMessage = responseData.detail
          } else {
            errorMessage = JSON.stringify(responseData)
          }
        } else if (error.request) {
          errorMessage = 'No response from the server. Please try again.'
        } else {
          errorMessage = error.message
        }
      }

      return rejectWithValue(errorMessage)
    }
  },
)

// Fetch KYC Applications
export const fetchKycApplications = createAsyncThunk<
  { applications: KycApplication[]; totalPages: number },
  { page: number; page_size: number; status?: string; search?: string },
  { rejectValue: string }
>(
  'kyc/fetchKycApplications',
  async ({ page, page_size, status, search }, { rejectWithValue }) => {
    try {
      const token =
        Cookies.get('token') ||
        (typeof window !== 'undefined' && localStorage.getItem('token'))

      if (!token) throw new Error('No token found')

      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('page_size', page_size.toString())

      if (status && status !== 'all') {
        params.append('kyc_status', status)
      }

      if (search && search.trim() !== '') {
        params.append('search', search.trim())
      }

      const response = await axios.get<KycListResponse>(
        `${baseURL}kyc/list?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      )

      const { items = [], total_pages = 1 } = response.data

      return {
        applications: items,
        totalPages: total_pages,
      }
    } catch (error: any) {
      const detail = error.response?.data?.detail

      // Gracefully handle "No records found" case
      if (
        error.response?.status === 404 &&
        detail === 'No records found'
      ) {
        return {
          applications: [],
          totalPages: 1,
        }
      }

      console.error('Error fetching KYC applications:', error)
      return rejectWithValue(
        detail || 'Failed to fetch KYC applications. Please try again.',
      )
    }
  },
)

// Approve or Reject KYC Application
export const approveKycApplication = createAsyncThunk<
  { user_id: string; newStatus: string; message: string },
  { user_id: string; action: 'approve' | 'reject'; message?: string },
  { rejectValue: string }
>(
  'auth/approveKycApplication',
  async ({ user_id, action, message }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const decodedUserId = decodeURIComponent(user_id)

      const response = await axios.put(
        `${baseURL}kyc/decide`,
        {
          user_id: decodedUserId,
          action,
          comment: message || '',
          notify_user: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        },
      )

      console.log('KYC Decide Response:', response.status, response.data)

      if (response.status === 200 && response.data.detail) {
        const detailMsg: string = response.data.detail.toLowerCase()
        const newStatus = detailMsg.includes('reject') ? 'rejected' : 'Approved'

        return {
          user_id: decodedUserId,
          newStatus,
          message: response.data.detail,
        }
      }

      throw new Error('Unexpected response format')
    } catch (error: any) {
      console.error('KYC Approve Error:', error.response?.data || error.message)
      return rejectWithValue(
        error.response?.data?.detail || 'Failed to process KYC approval',
      )
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = action.payload !== null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null

        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else if (
          action.payload &&
          typeof action.payload === 'object' &&
          'detail' in action.payload
        ) {
          state.error = (action.payload as { detail: string }).detail
        } else {
          state.error = 'Registration failed.'
        }
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user || null
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload || 'Login failed.'
      })


      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.error = 'Session expired. Please log in again.'
        toast.error(state.error)

      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
      })

      .addCase(generateReferralLink.pending, (state) => {
        state.isLoading = true
      })
      .addCase(generateReferralLink.fulfilled, (state, action) => {
        state.isLoading = false
        state.referralLink = action.payload
        state.referralFetched = true // mark as fetched
      })
      .addCase(generateReferralLink.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || 'Failed to generate referral link.'
      })

      .addCase(verifyKYCStatus.pending, (state) => {
        state.kycStatusLoading = true
      })
      .addCase(verifyKYCStatus.fulfilled, (state, action) => {
        state.kycStatusLoading = false
        if (action.payload === true) {
          state.kycVerified = true
          state.kycRejected = false
          state.kycPending = false
        } else if (action.payload === 'rejected') {
          state.kycVerified = false
          state.kycRejected = true
          state.kycPending = false
        } else if (action.payload === 'pending') {
          state.kycVerified = false
          state.kycRejected = false
          state.kycPending = true
        } else {
          state.kycVerified = false
          state.kycRejected = false
          state.kycPending = false
        }
      })
      .addCase(verifyKYCStatus.rejected, (state, action) => {
        state.kycStatusLoading = false
        state.kycStatusError = action.payload || 'Something went wrong'
      })

      .addCase(verifyUsername.pending, (state) => {
        state.usernameAvailable = null
        state.usernameError = null
      })
      .addCase(verifyUsername.fulfilled, (state, action) => {
        state.usernameAvailable = action.payload.available
        state.usernameError = null
      })
      .addCase(verifyUsername.rejected, (state, action) => {
        state.usernameAvailable = null
        state.usernameError = action.payload as string
      })

      .addCase(submitKyc.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitKyc.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.user) {
          state.user.kycVerified = true
        }
        state.kycVerified = true
      })

      .addCase(submitKyc.rejected, (state, action) => {
        state.isLoading = false

        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else if (
          action.payload &&
          typeof action.payload === 'object' &&
          'detail' in action.payload
        ) {
          state.error = (action.payload as { detail: string }).detail
        } else {
          state.error = 'KYC submission failed.'
        }
      })

      .addCase(resendConfirmationEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resendConfirmationEmail.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resendConfirmationEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      .addCase(fetchKycApplications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchKycApplications.fulfilled,
        (
          state,
          action: PayloadAction<{
            applications: KycApplication[]
            totalPages: number
          }>,
        ) => {
          state.isLoading = false
          state.kycApplications = action.payload.applications
          state.totalPages = action.payload.totalPages
        },
      )
      .addCase(fetchKycApplications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch KYC applications.'
      })
      .addCase(approveKycApplication.pending, (state) => {
        state.isLoading = true
      })
      .addCase(approveKycApplication.fulfilled, (state, action) => {
        const { user_id, newStatus } = action.payload
        state.kycApplications = state.kycApplications.map((app) =>
          app.user_id === user_id ? { ...app, status: newStatus } : app,
        )

        state.isLoading = false
      })

      .addCase(approveKycApplication.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
