'use client'

import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  decideWithdrawRequest,
  resetWithdrawAction,
} from '@/store/slices/admin/withdrawDecideSlice'
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import { toast } from 'react-hot-toast'

interface Props {
  withdraw_request_id: string
  user_id: string
  onClose?: () => void
}

export default function WithdrawAction({
  withdraw_request_id,
  user_id,
  onClose,
}: Props) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.withdrawAction)

  const [comment, setComment] = useState('Approved by admin')
  const [notifyUser, setNotifyUser] = useState(true)
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null)

  const handleAction = async (action: 'approve' | 'reject') => {
    setActionLoading(action)

    const result = await dispatch(
      decideWithdrawRequest({
        withdraw_request_id,
        user_id,
        action,
        comment: comment.trim(),
        notify_user: notifyUser,
      })
    )

    setActionLoading(null)

    if (decideWithdrawRequest.fulfilled.match(result)) {
      // ✅ Extract dynamic detail message if available
      const detail =
        (result.payload as any)?.detail ||
        `Withdrawal ${action}d successfully`

      toast.success(detail)

      if (onClose) onClose()
    } else {
      const errorMsg =
        (result.payload as string) ||
        'Failed to process withdrawal request. Please try again.'
      toast.error(errorMsg)
    }

    // Reset after toast
    setTimeout(() => dispatch(resetWithdrawAction()), 300)
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        fullWidth
        label="Comment"
        multiline
        minRows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={notifyUser}
            onChange={(e) => setNotifyUser(e.target.checked)}
          />
        }
        label="Notify user"
      />

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAction('approve')}
          disabled={loading || actionLoading !== null}
          startIcon={
            actionLoading === 'approve' ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => handleAction('reject')}
          disabled={loading || actionLoading !== null}
          startIcon={
            actionLoading === 'reject' ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  )
}
