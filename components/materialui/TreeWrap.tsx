'use client'

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserTree, resetUserTree, UserTreeNode } from '@/store/slices/admin/usertreeSlice'
import { RootState, AppDispatch } from '@/store/store'
import TeamTreeMUI from './TeamTreeMUI'

export interface TeamMember extends UserTreeNode {
  children: TeamMember[]
}

interface TeamTreeWrapperProps {
  root_user_id: string
  filter_user_id: string
  token?: string
}

// Build a tree structure from flat array
const buildTree = (nodes: UserTreeNode[]): TeamMember[] => {
  if (!Array.isArray(nodes) || nodes.length === 0) return []

  const rootNode = nodes[0]
  const children: TeamMember[] =
    nodes.length > 1
      ? nodes.slice(1).map((node) => ({ ...node, children: [] }))
      : []

  return [
    {
      ...rootNode,
      children,
    },
  ]
}

const TeamTreeWrapper: React.FC<TeamTreeWrapperProps> = ({
  root_user_id,
  filter_user_id,
  token,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: userTree = [], loading } = useSelector(
    (state: RootState) => state.userTreeId
  )

  const effectiveToken =
    token ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('token') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))?.split('=')[1])) ||
    ''

  useEffect(() => {
    // Clear previous tree before fetching new
    dispatch(resetUserTree())

    if (root_user_id && filter_user_id && effectiveToken) {
      dispatch(fetchUserTree({ root_user_id, filter_user_id, token: effectiveToken }))
    }
  }, [root_user_id, filter_user_id, effectiveToken, dispatch])

  const team: TeamMember[] = buildTree(userTree)

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-4">TEAM INFORMATION</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        {loading ? (
          <p className="text-sm text-gray-400">Loading team tree...</p>
        ) : team.length > 0 ? (
          <TeamTreeMUI
            team={team}
            fetchUserChildren={async (user_id: string): Promise<TeamMember[]> => {
              // Optional: implement real async fetch if needed
              return []
            }}
          />
        ) : (
          <p className="text-sm text-gray-500">No team data available.</p>
        )}
      </div>
    </div>
  )
}

export default TeamTreeWrapper
