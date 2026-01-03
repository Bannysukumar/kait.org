'use client'
import React, { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { updateUserPermission } from '@/store/slices/admin/permisionSlice'
import { fetchInvestorList } from '@/store/slices/admin/investorSlice'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material'
import toast from 'react-hot-toast'

interface PermissionTableProps {
  list: any[]
  currentPage: number
  pageSize: number
  searchQuery: string
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  list,
  currentPage,
  pageSize,
  searchQuery,
}) => {
  const dispatch = useAppDispatch()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null)
  const [newPermissionValue, setNewPermissionValue] = useState<boolean | null>(null)

  // ✅ Open confirmation modal
  const handlePermissionClick = (
    user: any,
    permissionType: string,
    currentValue: boolean,
  ) => {
    setSelectedUser(user)
    setSelectedPermission(permissionType)
    setNewPermissionValue(!currentValue)
    setConfirmDialogOpen(true)
  }

  // ✅ Confirm permission change
  const handleConfirmAction = async () => {
    if (!selectedUser || !selectedPermission) return
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Token missing!')
      return
    }

    try {
      const result = await dispatch(
        updateUserPermission({
          userId: selectedUser.user_id,
          permissionType: selectedPermission as any,
          permissionValue: newPermissionValue as boolean,
          token,
        }),
      )

      if (updateUserPermission.fulfilled.match(result)) {
        toast.success(
          `${selectedPermission} permission ${
            newPermissionValue ? 'enabled' : 'disabled'
          } for ${selectedUser.name}`,
        )

        // ✅ Refresh investor list
        await dispatch(
          fetchInvestorList({
            page: currentPage,
            page_size: pageSize,
            searchQuery,
          }),
        )
      } else {
        toast.error(`Failed to update ${selectedPermission}`)
      }
    } catch (err) {
      toast.error('Error updating permission')
    } finally {
      setConfirmDialogOpen(false)
      setSelectedUser(null)
      setSelectedPermission(null)
      setNewPermissionValue(null)
    }
  }

  // ✅ Cancel modal
  const handleCancelAction = () => {
    setConfirmDialogOpen(false)
    setSelectedUser(null)
    setSelectedPermission(null)
    setNewPermissionValue(null)
  }

  return (
    <div className="p-4">
      {list.map((user) => (
        <div
          key={user.user_id}
          className="flex justify-between items-center border-b py-2"
        >
          <div>
            <strong>{user.name}</strong> <br />
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              color={user.withdraw ? 'error' : 'primary'}
              onClick={() =>
                handlePermissionClick(user, 'withdraw', user.withdraw)
              }
            >
              {user.withdraw ? 'Disable Withdraw' : 'Enable Withdraw'}
            </Button>

            <Button
              variant="outlined"
              color={user.transfer ? 'error' : 'primary'}
              onClick={() =>
                handlePermissionClick(user, 'transfer', user.transfer)
              }
            >
              {user.transfer ? 'Disable Transfer' : 'Enable Transfer'}
            </Button>
          </div>
        </div>
      ))}

      {/* ✅ Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelAction}>
        <DialogTitle>Confirm Permission Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{' '}
            <strong>{newPermissionValue ? 'enable' : 'disable'}</strong>{' '}
            <strong>{selectedPermission}</strong> for{' '}
            <span className="font-semibold text-purple-600">
              {selectedUser?.name}
            </span>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            className="!bg-gradient-to-r from-blue-500 to-purple-700 !text-white"
          >
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PermissionTable
