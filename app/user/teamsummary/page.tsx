'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchUserData,
  TeamMember,
} from '@/store/slices/user/userTreeDataReducer'
import TeamTreeMUI from './teamTree'
import { CircularProgress, Box, Typography } from '@mui/material'
import Groups2Icon from '@mui/icons-material/Groups2'
import Kait from '../../../assets/logo2x.png'
import Image from 'next/image'
import { fetchBinaryInfo } from '@/store/slices/binaryinfoslice'

export default function TeamPage() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.UserTree)

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  )

  const { data: BinaryInfo, loading: BinaryInfoloading, error: Binaryerror } =
    useAppSelector((state) => state.binaryInfo)

  useEffect(() => {
    dispatch(fetchUserData(selectedUserId || undefined))
  }, [selectedUserId])
  
  const lastBinaryFetchRef = useRef<string | null>(null)

  useEffect(() => {
    if (!data?.id) return

    if (lastBinaryFetchRef.current === data.id) return
    lastBinaryFetchRef.current = data.id

    dispatch(fetchBinaryInfo(data.id))
  }, [data?.id])


  const hasTeamData = !!data?.team_tree?.length

  const calculateTotalTeamStake = (
    team: TeamMember[] | null | undefined,
  ): number => {
    if (!team) return 0
    return team.reduce((sum, member) => {
      const childrenStake = member.children?.length
        ? calculateTotalTeamStake(member.children)
        : 0
      return sum + (member.team_staking || 0) + childrenStake
    }, 0)
  }

  const totalTeamStake =
    hasTeamData && data ? calculateTotalTeamStake(data.team_tree) : 0

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Referral Tree - {data?.name ?? 'User'}
      </Typography>

      <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-700 p-2 text-white rounded-md shadow-md">
        <Groups2Icon style={{ width: 40, height: 40 }} className="ml-2" />
        {hasTeamData && (
          <h2 className="ml-5">
            Total Team Staking Contracts <br />
            <span className="flex items-center gap-2 mt-1">
              <Image src={Kait} alt="Kait Coin" width={20} height={20} />
              {totalTeamStake.toLocaleString()}
            </span>
          </h2>
        )}
      </div>

      {/* Binary Info */}
      <div className="mt-2">
        <div className="flex gap-4 mt-1">
          {BinaryInfoloading ? (
            <>
              <div className="flex-1 bg-blue-100 p-4 rounded space-y-2">
                <div className="h-4 bg-blue-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-blue-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-blue-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="flex-1 bg-red-100 p-4 rounded space-y-2">
                <div className="h-4 bg-red-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-red-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-red-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 bg-blue-100 text-center p-2 rounded">
                Left Direct Referral: {BinaryInfo?.left_direct_count ?? 0}
                <br />
                Left Total Team: {BinaryInfo?.left_team_count ?? 0}
                <br />
                <span>Left volume: {BinaryInfo?.left_team_business ?? 0}</span>
              </div>

              <div className="flex-1 bg-red-100 text-center p-2 rounded">
                Right Direct Referral: {BinaryInfo?.right_direct_count ?? 0}
                <br />
                Right Total Team: {BinaryInfo?.right_team_count ?? 0}
                <br />
                <span>Right volume: {BinaryInfo?.right_team_business ?? 0}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && hasTeamData && (
        <Box mt={2}>
          <TeamTreeMUI
            team={data.team_tree}
            root_user_id={data.id}
            onNodeClick={(id: string | undefined) => setSelectedUserId(id)}
          />
        </Box>
      )}

      {!loading && !error && !hasTeamData && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          No team data found.
        </Typography>
      )}
    </Box>
  )
}
