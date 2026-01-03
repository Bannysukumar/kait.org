'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Pagination,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  TextField,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchBeneficiaries,
  decideBeneficiary,
} from '@/store/slices/admin/beneficiaryAdminSlice'
import { EllipsisVertical } from 'lucide-react'
import toast from 'react-hot-toast'

const TABS = [
  { label: 'All', value: 'any' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

export default function BeneficiaryListPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error, actionLoading, total_pages, total } =
    useAppSelector((state) => state.adminbeneficiary)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAction, setSelectedAction] = useState<{
    beneficiary_id: string
    user_id: string
    action: 'approve' | 'reject'
  } | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [tab, setTab] = useState('any')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')

  // ✅ Fetch data when tab, page, rowsPerPage, or search changes
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        fetchBeneficiaries({
          review_status: tab,
          page,
          page_size: rowsPerPage,
          search,
        })
      )
    }, 500) // debounce search
    return () => clearTimeout(delay)
  }, [dispatch, tab, page, rowsPerPage, search])

  useEffect(() => {
    if (error && error !== 'No user found') {
      toast.error(error)
    }
  }, [error])

  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    beneficiary_id: string,
    user_id: string
  ) => {
    setAnchorEl(e.currentTarget)
    setSelectedAction({ beneficiary_id, user_id, action: 'approve' })
  }

  const handleMenuClose = () => setAnchorEl(null)

  const handleSelectAction = (action: 'approve' | 'reject') => {
    if (selectedAction) {
      setSelectedAction({ ...selectedAction, action })
      setOpenDialog(true)
    }
    handleMenuClose()
  }

  const handleConfirm = async () => {
    if (!selectedAction) return

    try {
      const response = await dispatch(
        decideBeneficiary({
          ...selectedAction,
          comment: '',
          notify_user: true,
        })
      ).unwrap()

      toast.success(
        response.detail ||
        `Successfully ${selectedAction.action}ed beneficiary.`
      )
    } catch (err: any) {
      toast.error(
        err?.detail || `Failed to ${selectedAction.action} beneficiary.`
      )
    } finally {
      setOpenDialog(false)
      dispatch(
        fetchBeneficiaries({
          review_status: tab,
          page,
          page_size: rowsPerPage,
          search,
        })
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8 font-sans">
      <div className="container mx-auto max-w-7xl bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">
          Beneficiary Management
        </h1>

        {/* ✅ Tabs */}
        <Tabs
          value={tab}
          onChange={(_, newValue) => {
            setTab(newValue)
            setPage(1)
          }}
          centered
          sx={{ mb: 4 }}
        >
          {TABS.map((t) => (
            <Tab
              key={t.value}
              label={t.label}
              value={t.value}
              sx={{
                textTransform: 'none',
                fontWeight: '600',
              }}
            />
          ))}
        </Tabs>

        {/* ✅ Search Bar */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by name, email, or wallet..."
            variant="outlined"
            size="small"
            sx={{ width: 400 }}
          />
        </Box>

        {loading ? (
          <p className="text-center text-blue-600 text-lg animate-pulse">
            Loading...
          </p>
        ) : items.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-lg font-medium">
            No beneficiary users found.
          </p>
        ) : (
          <>
            {/* ✅ Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800 uppercase text-xs tracking-wide">
                  <tr>
                    {[
                      'Nick Name',
                      'Wallet',
                      'Email',
                      'Mobile',
                      'Limit',
                      'Status',
                      'Actions',
                    ].map((title) => (
                      <th key={title} className="p-4 text-left">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr
                      key={b.beneficiary_id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium">{b.nick_name}</td>
                      <td className="p-4 break-all">{b.wallet_address}</td>
                      <td className="p-4">{b.email}</td>
                      <td className="p-4">{b.mobile}</td>
                      <td className="p-4">{b.limit}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${b.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : b.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) =>
                            handleMenuClick(e, b.beneficiary_id, b.user_id)
                          }
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination + Total + Rows per page */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={3}
              flexWrap="wrap"
            >
              <Typography variant="body2" color="textSecondary">
                Total: <strong>{total}</strong> records
              </Typography>

              <Pagination
                count={total_pages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                <Select
                  labelId="rows-per-page-label"
                  value={rowsPerPage}
                  label="Rows per page"
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  {[10, 20, 50, 100].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}
      </div>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleSelectAction('approve')}>Approve</MenuItem>
        <MenuItem onClick={() => handleSelectAction('reject')}>Reject</MenuItem>
      </Menu>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {selectedAction?.action === 'approve'
            ? 'Confirm Approval'
            : 'Confirm Rejection'}
        </DialogTitle>
        <DialogContent>
          <p className="text-gray-700">
            {selectedAction?.action === 'approve'
              ? 'Are you sure you want to approve this beneficiary? This action cannot be undone.'
              : 'Do you want to reject this beneficiary?'}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color={selectedAction?.action === 'approve' ? 'success' : 'error'}
            disabled={actionLoading}
            onClick={handleConfirm}
          >
            {selectedAction?.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
