'use client'

import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ClubVolumeItem } from '@/store/slices/admin/clubVolumeSlice'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface VolumeDialogProps {
  open: boolean
  onClose: () => void
  member: ClubVolumeItem | null
}

const VolumeDialog = ({ open, onClose, member }: VolumeDialogProps) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalItems = member?.volumn?.length || 0
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginatedData = useMemo(() => {
    if (!member?.volumn) return []
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return member.volumn.slice(start, end)
  }, [member?.volumn, page, pageSize])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <DialogTitle>Volume Details for {member?.full_name}</DialogTitle>
        </DialogHeader>

        {member?.volumn && member.volumn.length > 0 ? (
          <>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Staked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>{v.email}</TableCell>
                      <TableCell>{v.level}</TableCell>
                      <TableCell>{Number(v.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(v.staked_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-gray-600">
                Showing page {page} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value))
                    setPage(1) // Reset to page 1 when size changes
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Rows" />
                  </SelectTrigger>
                  <SelectContent className=' bg-white'>
                    {[5, 10, 20, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-4">No volume data available.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default VolumeDialog
