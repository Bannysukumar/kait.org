'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Autocomplete,
  CircularProgress,
} from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchEligibleUsers } from '@/store/slices/admin/eligibleUserForUpdateSlice'
import {
  updateInvestor,
  resetUpdateState,
} from '@/store/slices/admin/updateUserSlice'
import { toast } from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  user: {
    user_id: string
    first_name: string
    last_name: string
    email: string
    mobile: string
    referral_user_id: string
  }
}

const UpdateInvestorDialog = ({ open, onClose, user }: Props) => {
  const dispatch = useAppDispatch()
  const { users: eligibleUsers, loading } = useAppSelector(
    (state) => state.eligibleUsersForUpdate,
  )
  const { updateLoading, updateSuccess, updateError } = useAppSelector(
    (state) => state.updateUser,
  )

  const [formState, setFormState] = useState({ ...user })
  const [sendEmail, setSendEmail] = useState(false)

  const options = useMemo(
    () =>
      eligibleUsers.map((user) => ({
        id: user.id,
        label: `${user.value.name} (${user.value.email})`,
      })),
    [eligibleUsers],
  )

  useEffect(() => {
    if (open) {
      dispatch(fetchEligibleUsers(user.user_id))
    }
  }, [dispatch, open, user.user_id])

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Investor updated successfully')
      dispatch(resetUpdateState())
      onClose()
    } else if (updateError) {
      toast.error(
        typeof updateError === 'string' ? updateError : 'Update failed',
      )
      dispatch(resetUpdateState())
    }
  }, [updateSuccess, updateError, dispatch, onClose])

  const handleChange = (key: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = () => {
    const token = localStorage.getItem('token')
    if (!token) return toast.error('Token missing')

    dispatch(
      updateInvestor({
        ...formState,
        token,
        send_reset_password_link: sendEmail,
      }),
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Investor Info</DialogTitle>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="First Name"
          value={formState.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={formState.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={formState.email}
          onChange={(e) => handleChange('email', e.target.value)}
          fullWidth
        />
        <TextField
          label="Mobile"
          value={formState.mobile}
          onChange={(e) => handleChange('mobile', e.target.value)}
          fullWidth
        />

        <Typography variant="body2" color="textSecondary">
          Referred Email:{user.referral_user_id}
        </Typography>

        <Autocomplete
          options={options}
          loading={loading}
          getOptionLabel={(option) => option.label}
          value={
            options.find((opt) => opt.id === formState.referral_user_id) || null
          }
          onChange={(e, newValue) =>
            handleChange('referral_user_id', newValue?.id || '')
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Change Referral"
              placeholder="Search referral"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              fullWidth
            />
          )}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
          }
          label="Send email to investor"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={updateLoading}
          variant="contained"
        >
          {updateLoading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateInvestorDialog
