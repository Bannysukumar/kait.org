import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`${baseURL}user/personal_info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('Error fetching user profile:', error)

      return rejectWithValue(
        error.response?.data || error.message || 'Failed to fetch user profile',
      )
    }
  },
)
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (
    userData: { first_name: string; last_name: string; dob: string },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found') 
      }

      const response = await axios.put(
        `${baseURL}user/personal_info`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data 
    } catch (error: any) {
      console.error('Error updating user profile:', error)
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          'Failed to update user profile',
      )
    }
  },
)

export const resetUserPassword = createAsyncThunk(
  'auth/resetUserPassword',
  async (
    passwordData: {
      old_password: string
      new_password: string
      confirm_password: string
    },
    { rejectWithValue },
  ) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')
      if (!token) throw new Error('No token found')

      const formData = new URLSearchParams(
        passwordData as Record<string, string>,
      )

      const response = await axios.put(`${baseURL}user/password`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to reset password',
      )
    }
  },
)
