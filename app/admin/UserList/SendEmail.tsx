import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { sendEmail } from '@/store/slices/admin/SendEmailSlice'
import { toast } from 'react-hot-toast'

interface EmailDialogProps {
  open: boolean
  onClose: () => void
  userId: string
}

const EmailDialog: React.FC<EmailDialogProps> = ({ open, onClose, userId }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.SendEmail)

  const [subject, setSubject] = useState('')
  const [greeting, setGreeting] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Missing auth token')
      return
    }

    const result = await dispatch(
      sendEmail({ user_id: userId, subject, greeting, message, token }),
    )

    if (sendEmail.fulfilled.match(result)) {
      toast.success('Email sent successfully')
      setSubject('')
      setGreeting('')
      setMessage('')
      onClose()
    } else {
      toast.error(result.payload || 'Failed to send email')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send Email</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Subject"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Greeting"
          fullWidth
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !subject || !message}
        >
          {loading ? <CircularProgress size={20} /> : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmailDialog
