'use client'

import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { registerUser, generateReferralLink } from '@/store/slices/index'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { UserPlus } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AddUserDialog() {
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    user_type: 'regular',
  })

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const result = await dispatch(generateReferralLink()).unwrap()

      await dispatch(
        registerUser({
          first_name: form.first_name,
          last_name: form.last_name,
          dob: form.dob,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
          referral_token: result,
        }),
      ).unwrap()

      toast.success('User added successfully')
      setForm({
        first_name: '',
        last_name: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        user_type: 'regular',
      })
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to add user')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[75vw] !max-w-none bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">User Type</label>
            <Select onValueChange={val => handleChange('user_type', val)} defaultValue="regular">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Regular" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input value={form.first_name} onChange={e => handleChange('first_name', e.target.value)} placeholder="User First Name" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input value={form.last_name} onChange={e => handleChange('last_name', e.target.value)} placeholder="User Last Name" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date Of Birth</label>
              <Input type="date" value={form.dob} onChange={e => handleChange('dob', e.target.value)} placeholder="Date Of Birth" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="Email address" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} placeholder="Password" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input type="password" value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} placeholder="Confirm Password" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <Input value={form.mobile} onChange={e => handleChange('mobile', e.target.value)} placeholder="Mobile Number" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="verifyEmail" defaultChecked />
            <label htmlFor="verifyEmail" className="text-sm">
              Required Email Verification
            </label>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Add User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
