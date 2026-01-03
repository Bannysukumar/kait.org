import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface RestakePayload {
    wallet_kind: 'IncomeWallet' | 'ReStakeWallet'
    amount: number
}

interface RestakeState {
    loading: boolean
    error: string | { msg: string }[] | null
    success: boolean
}

const initialState: RestakeState = {
    loading: false,
    error: null,
    success: false,
}

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const performRestake = createAsyncThunk<
    any,
    RestakePayload,
    { rejectValue: string | { msg: string }[] }
>(
    'restake/perform',
    async (payload, { rejectWithValue }) => {
        try {
            const formData = new URLSearchParams()
            formData.append('wallet_kind', payload.wallet_kind)
            formData.append('amount', payload.amount.toString())

            const response = await axios.post(`${baseURL}restake/perform`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            return response.data
        } catch (err: any) {
            // Ensure err.response?.data is typed
            const data = err.response?.data as any

            if (data && Array.isArray(data.detail)) {
                const details = data.detail.map((d: any) => ({ msg: d.msg }))
                return rejectWithValue(details)
            }

            if (typeof data.detail === 'string') {
                return rejectWithValue(data.detail)
            }

            return rejectWithValue('Restake failed')
        }
    }
)


const restakeSlice = createSlice({
    name: 'restake',
    initialState,
    reducers: {
        resetRestake: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(performRestake.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(performRestake.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(performRestake.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Something went wrong'
            })
    },
})

export const { resetRestake } = restakeSlice.actions
export default restakeSlice.reducer

