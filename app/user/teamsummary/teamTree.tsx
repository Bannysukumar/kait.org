// 'use client'

// import * as React from 'react'
// import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
// import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
// import { styled, alpha } from '@mui/material/styles'
// import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
// import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
// import { Grid, Box, TextField, CircularProgress, Tooltip } from '@mui/material';
// import { useAppDispatch } from '@/store/hooks'
// import { fetchUserTree } from '@/store/slices/user/userTreeApiList'
// import buildTeamTree from './buildersTeamTree'

// import {
//   EmojiEvents,
//   Diamond as DiamondIcon,
//   MilitaryTech as MilitaryTechIcon,
//   Grade as GradeIcon,
// } from '@mui/icons-material'
// import { User } from 'lucide-react'
// import toast from 'react-hot-toast'

// export interface TeamMember {
//   user_id: string
//   id: string
//   name: string | null
//   user_name: string | null
//   email: string | null
//   club: string | null
//   level: number
//   total_staking: number
//   team_staking: number
//   children: TeamMember[]
// }

// export interface TeamTreeMUIProps {
//   team: TeamMember[]
//   root_user_id: string
//   onNodeClick: (id: string) => void
// }

// const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
//   position: 'relative',
//   [`& .${treeItemClasses.content}`]: {
//     padding: theme.spacing(0.5, 1),
//     margin: theme.spacing(0.2, 0),
//     position: 'relative',
//   },
//   [`& .${treeItemClasses.groupTransition}`]: {
//     marginLeft: 15,
//     paddingLeft: 18,
//     borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
//     position: 'relative',
//   },
//   [`& .${treeItemClasses.content}::before`]: {
//     content: '""',
//     position: 'absolute',
//     top: '50%',
//     left: -18,
//     width: 18,
//     height: 1,
//     backgroundColor: alpha(theme.palette.text.primary, 0.4),
//   },
// }))

// const getClubIcon = (club: string) => {
//   const iconProps = {
//     sx: { width: 30, height: 30 },
//     className: 'bg-white w-5 h-5 rounded-2xl border-4',
//   }
//   switch (club) {
//     case 'Bronze':
//       return (
//         <MilitaryTechIcon
//           {...iconProps}
//           className="text-amber-700 border-amber-700"
//         />
//       )
//     case 'Silver':
//       return (
//         <MilitaryTechIcon
//           {...iconProps}
//           className="text-gray-500 border-gray-500"
//         />
//       )
//     case 'Gold':
//       return (
//         <MilitaryTechIcon
//           {...iconProps}
//           className="text-yellow-500 border-yellow-500"
//         />
//       )
//     case 'Platinum':
//       return (
//         <GradeIcon {...iconProps} className="text-gray-400 border-gray-500" />
//       )
//     case 'Diamond':
//       return (
//         <DiamondIcon
//           {...iconProps}
//           className="text-amber-700 border-amber-700"
//         />
//       )
//     case 'Double Diamond':
//       return <DiamondIcon {...iconProps} className="text-gray-500" />
//     case 'Triple Diamond':
//       return (
//         <DiamondIcon
//           {...iconProps}
//           className="text-yellow-500 border-yellow-500"
//         />
//       )
//     case 'Kait King':
//       return (
//         <EmojiEvents
//           {...iconProps}
//           className="text-yellow-600 border-yellow-600"
//         />
//       )
//     default:
//       return (
//         <User className="w-[30px] h-[30px] text-gray-600 border-gray-600 border-4 rounded-2xl" />
//       )
//   }
// }

// const insertChildren = (
//   nodes: TeamMember[],
//   targetUserId: string,
//   newChildren: TeamMember[],
// ): TeamMember[] =>
//   nodes.map((node) =>
//     node.user_id === targetUserId
//       ? { ...node, children: newChildren }
//       : {
//         ...node,
//         children: insertChildren(
//           node.children || [],
//           targetUserId,
//           newChildren,
//         ),
//       },
//   )

// export default function TeamTreeMUI({ team }: TeamTreeMUIProps) {
//   const [query, setQuery] = React.useState('')
//   const [expandedItems, setExpandedItems] = React.useState<string[]>([])
//   const [treeData, setTreeData] = React.useState<TeamMember[]>(team)
//   const [loadingNodeId, setLoadingNodeId] = React.useState<string | null>(null)
//   const dispatch = useAppDispatch()

//   const handleNodeClick = async (user_id: string) => {
//     const root_user_id = team[0]?.id
//     const token = localStorage.getItem('token') || ''
//     if (root_user_id && user_id && token) {
//       try {
//         setLoadingNodeId(user_id)
//         const response = await dispatch(
//           fetchUserTree({ root_user_id, filter_user_id: user_id, token }),
//         ).unwrap()

//         if (!response || response.length === 0) {
//           toast.error('No data found')
//           return
//         }

//         const children = buildTeamTree(response)
//         if (children.length === 0) {
//           toast.error('No data found')
//           return
//         }

//         const updated = insertChildren(treeData, user_id, children)
//         setTreeData(updated)
//       } catch (err: any) {
//         console.error('Subtree fetch failed:', err)
//         toast.error('No data found')
//       } finally {
//         setLoadingNodeId(null)
//       }
//     }
//   }

//   const handleExpansionToggle = async (
//     event: React.SyntheticEvent | null,
//     nodeId: string,
//     isExpanding: boolean,
//   ) => {
//     event?.stopPropagation()

//     const elBefore = document.getElementById(nodeId)
//     const rectBefore = elBefore?.getBoundingClientRect()

//     const userId = nodeId
//     const node = findNodeById(treeData, userId)

//     if (isExpanding && node && (!node.children || node.children.length === 0)) {
//       await handleNodeClick(userId)
//     }

//     setExpandedItems((prev) =>
//       isExpanding && !prev.includes(nodeId)
//         ? [...prev, nodeId]
//         : !isExpanding
//           ? prev.filter((id) => id !== nodeId)
//           : prev,
//     )

//     requestAnimationFrame(() => {
//       const elAfter = document.getElementById(nodeId)
//       if (elAfter && rectBefore) {
//         const rectAfter = elAfter.getBoundingClientRect()
//         const deltaY = rectAfter.top - rectBefore.top
//         window.scrollBy({ top: deltaY, behavior: 'auto' })
//         elAfter.focus({ preventScroll: true })
//       }
//     })
//   }

//   const findNodeById = (nodes: TeamMember[], id: string): TeamMember | null => {
//     for (const node of nodes) {
//       if (node.user_id === id) return node
//       if (node.children) {
//         const child = findNodeById(node.children, id)
//         if (child) return child
//       }
//     }
//     return null
//   }

//   const renderTree = (member: TeamMember): React.ReactNode => {
//     const nodeId = member.user_id
//     return (
//       <CustomTreeItem
//         key={nodeId}
//         itemId={nodeId}
//         id={nodeId}
//         label={
//           <Box display="flex" alignItems="center" gap={1}>
//             <span className="gap-1 flex items-center text-[12px]">
//               {member.level !== 0 && <div>Level: L{member.level}</div>}
//               <Tooltip
//                 title={
//                   <div className="text-xs p-1">
//                     {member.level !== 0 && <div>Level: L{member.level}</div>}
//                     {member.club && <div>Club: {member.club}</div>}
//                     <div>Name: {member.name}</div>
//                     <div>Email: {member.email}</div>
//                     <div>Total Staking: {member.total_staking}</div>
//                     <div>Team Staking: {member.team_staking}</div>
//                   </div>
//                 }
//                 placement="bottom"
//                 arrow
//               >
//                 <span
//                   className="cursor-pointer text-blue-600 underline flex items-center gap-1"
//                   onClick={async (e) => {
//                     e.stopPropagation()

//                     const elBefore = document.getElementById(nodeId)
//                     const rectBefore = elBefore?.getBoundingClientRect()

//                     await handleNodeClick(member.user_id)

//                     setExpandedItems((prev) =>
//                       prev.includes(nodeId) ? prev : [...prev, nodeId],
//                     )

//                     requestAnimationFrame(() => {
//                       const elAfter = document.getElementById(nodeId)
//                       if (elAfter && rectBefore) {
//                         const rectAfter = elAfter.getBoundingClientRect()
//                         const deltaY = rectAfter.top - rectBefore.top
//                         window.scrollBy({ top: deltaY, behavior: 'auto' })
//                         elAfter.focus({ preventScroll: true })
//                       }
//                     })
//                   }}
//                 >
//                   {getClubIcon(member.club || '')} [Id:{member.user_name}]
//                 </span>
//               </Tooltip>
//             </span>
//             {loadingNodeId === member.user_id && <CircularProgress size={16} />}
//           </Box>
//         }
//         onClick={(e) =>
//           handleExpansionToggle(e, nodeId, !expandedItems.includes(nodeId))
//         }
//       >
//         {member.children?.map((child) => renderTree(child))}
//       </CustomTreeItem>
//     )
//   }

//   const filtered = React.useMemo(() => {
//     if (!query) return treeData
//     const lower = query.toLowerCase()
//     const filter = (members: TeamMember[]): TeamMember[] =>
//       members
//         .map((m) => {
//           const match =
//             m.name?.toLowerCase().includes(lower) ||
//             m.user_name?.toLowerCase().includes(lower) ||
//             m.email?.toLowerCase().includes(lower)
//           const children = filter(m.children || [])
//           return match || children.length > 0 ? { ...m, children } : null
//         })
//         .filter(Boolean) as TeamMember[]
//     return filter(treeData)
//   }, [query, treeData])


//   return (

//     <div>

//       <TextField
//         fullWidth
//         size="small"
//         placeholder="Search name, email or username"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         sx={{ mb: 2 }}
//       />

//       <SimpleTreeView
//         aria-label="Team Tree"
//         expandedItems={expandedItems}
//         onItemExpansionToggle={(e, id, expanding) =>
//           handleExpansionToggle(e, id, expanding)
//         }
//         slots={{
//           expandIcon: AddBoxRoundedIcon,
//           collapseIcon: IndeterminateCheckBoxRoundedIcon,
//           endIcon: AddBoxRoundedIcon,
//         }}
//         sx={{ overflowX: 'auto', minHeight: 270, flexGrow: 1 }}
//       >
//         {filtered.map((m) => renderTree(m))}
//       </SimpleTreeView>
//     </div>
//   )
// }
'use client'

import * as React from 'react'
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded'
import { styled, alpha } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { Box, TextField, CircularProgress, Tooltip, IconButton } from '@mui/material'
import { Search } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { fetchUserTree } from '@/store/slices/user/userTreeApiList'
import buildTeamTree from './buildersTeamTree'
import {
  EmojiEvents,
  Diamond as DiamondIcon,
  MilitaryTech as MilitaryTechIcon,
  Grade as GradeIcon,
} from '@mui/icons-material'
import { User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppSelector } from '@/store/store'

export interface TeamMember {
  user_id: string
  id: string
  name: string | null
  user_name: string | null
  email: string | null
  club: string | null
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

export interface TeamTreeMUIProps {
  team: TeamMember[]
  root_user_id: string
  onNodeClick: (id: string) => void
}

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  position: 'relative',
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    position: 'relative',
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    position: 'relative',
  },
  [`& .${treeItemClasses.content}::before`]: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: -18,
    width: 18,
    height: 1,
    backgroundColor: alpha(theme.palette.text.primary, 0.4),
  },
}))

const getClubIcon = (club: string) => {
  const iconProps = { sx: { width: 30, height: 30 }, className: 'bg-white w-5 h-5 rounded-2xl border-4' }
  switch (club) {
    case 'Bronze':
      return <MilitaryTechIcon {...iconProps} className="text-amber-700 border-amber-700" />
    case 'Silver':
      return <MilitaryTechIcon {...iconProps} className="text-gray-500 border-gray-500" />
    case 'Gold':
      return <MilitaryTechIcon {...iconProps} className="text-yellow-500 border-yellow-500" />
    case 'Platinum':
      return <GradeIcon {...iconProps} className="text-gray-400 border-gray-500" />
    case 'Diamond':
      return <DiamondIcon {...iconProps} className="text-amber-700 border-amber-700" />
    case 'Double Diamond':
      return <DiamondIcon {...iconProps} className="text-gray-500" />
    case 'Triple Diamond':
      return <DiamondIcon {...iconProps} className="text-yellow-500 border-yellow-500" />
    case 'Kait King':
      return <EmojiEvents {...iconProps} className="text-yellow-600 border-yellow-600" />
    default:
      return <User className="w-[30px] h-[30px] text-gray-600 border-gray-600 border-4 rounded-2xl" />
  }
}

const insertChildren = (nodes: TeamMember[], targetUserId: string, newChildren: TeamMember[]): TeamMember[] =>
  nodes.map((node) =>
    node.user_id === targetUserId
      ? { ...node, children: newChildren }
      : { ...node, children: insertChildren(node.children || [], targetUserId, newChildren) },
  )

export default function TeamTreeMUI({ team }: TeamTreeMUIProps) {
  const [query, setQuery] = React.useState('')
  const [searchText, setSearchText] = React.useState('')
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [treeData, setTreeData] = React.useState<TeamMember[]>(team)
  const [loadingNodeId, setLoadingNodeId] = React.useState<string | null>(null)
  const dispatch = useAppDispatch()
  const { data: BinaryInfo } = useAppSelector((state) => state.binaryInfo)

  const teamData = [
    { label: 'Left Team', value: BinaryInfo?.left_team_count || 0, color: '#3B82F6' },
    { label: 'Right Team', value: BinaryInfo?.right_team_count || 0, color: '#8B5CF6' },
  ]

  const handleNodeClick = async (user_id: string) => {
    const root_user_id = team[0]?.id
    const token = localStorage.getItem('token') || ''
    if (root_user_id && user_id && token) {
      try {
        setLoadingNodeId(user_id)
        const response = await dispatch(fetchUserTree({ root_user_id, filter_user_id: user_id, token })).unwrap()
        if (!response?.length) return toast.error('No data found')

        const children = buildTeamTree(response)
        if (!children.length) return toast.error('No data found')

        const updated = insertChildren(treeData, user_id, children)
        setTreeData(updated)
      } catch {
        toast.error('No data found')
      } finally {
        setLoadingNodeId(null)
      }
    }
  }

  const handleExpansionToggle = async (event: React.SyntheticEvent | null, nodeId: string, isExpanding: boolean) => {
    event?.stopPropagation()
    const userId = nodeId
    const node = findNodeById(treeData, userId)
    if (isExpanding && node && (!node.children || node.children.length === 0)) {
      await handleNodeClick(userId)
    }
    setExpandedItems((prev) =>
      isExpanding && !prev.includes(nodeId)
        ? [...prev, nodeId]
        : !isExpanding
        ? prev.filter((id) => id !== nodeId)
        : prev,
    )
  }

  const findNodeById = (nodes: TeamMember[], id: string): TeamMember | null => {
    for (const node of nodes) {
      if (node.user_id === id) return node
      if (node.children) {
        const child = findNodeById(node.children, id)
        if (child) return child
      }
    }
    return null
  }

  const handleSearch = () => setQuery(searchText.trim())

  const renderTree = (member: TeamMember, index?: number, totalL1?: number): React.ReactNode => {
    const nodeId = member.user_id
    const isL1 = member.level === 1
    const position = isL1 ? (index! < totalL1! / 2 ? 'left' : 'right') : null

    return (
      <CustomTreeItem
        key={nodeId}
        itemId={nodeId}
        label={
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            // sx={{
            //   backgroundColor:
            //     isL1 && position === 'left'
            //       ? 'rgba(59,130,246,0.08)'
            //       : isL1 && position === 'right'
            //       ? 'rgb(255,226,226)'
            //       : 'transparent',
            //   borderRadius: 1,
            //   px: 1,
            //   py: 0.5,
            // }}
          >
            <span className="flex items-center text-[12px] gap-1">
              {member.level !== 0 && <div>Level: L{member.level}</div>}
              <Tooltip
                title={
                  <div className="text-xs p-1">
                    {member.club && <div>Club: {member.club}</div>}
                    <div>Name: {member.name}</div>
                    <div>Email: {member.email}</div>
                    <div>Total Staking: {member.total_staking}</div>
                    <div>Team Staking: {member.team_staking}</div>
                  </div>
                }
                placement="bottom"
                arrow
              >
                <span
                  className={`cursor-pointer underline flex items-center gap-1 ${
                    position === 'left'
                      ? 'text-blue-600'
                      : position === 'right'
                      ? 'text-purple-600'
                      : 'text-gray-700'
                  }`}
                  onClick={async (e) => {
                    e.stopPropagation()
                    await handleNodeClick(member.user_id)
                    setExpandedItems((prev) => (prev.includes(nodeId) ? prev : [...prev, nodeId]))
                  }}
                >
                  {getClubIcon(member.club || '')} [Id:{member.user_name}]
                </span>
              </Tooltip>
            </span>
            {loadingNodeId === member.user_id && <CircularProgress size={16} />}
          </Box>
        }
        onClick={(e) => handleExpansionToggle(e, nodeId, !expandedItems.includes(nodeId))}
      >
        {member.children?.map((child, i) => renderTree(child, i, member.children.length))}
      </CustomTreeItem>
    )
  }

  const filtered = React.useMemo(() => {
    if (!query) return treeData
    const lower = query.toLowerCase()
    const filter = (members: TeamMember[]): TeamMember[] =>
      members
        .map((m) => {
          const match =
            m.name?.toLowerCase().includes(lower) ||
            m.user_name?.toLowerCase().includes(lower) ||
            m.email?.toLowerCase().includes(lower)
          const children = filter(m.children || [])
          return match || children.length > 0 ? { ...m, children } : null
        })
        .filter(Boolean) as TeamMember[]
    return filter(treeData)
  }, [query, treeData])

  return (
    <div>
      {/* ✅ Search Box with Button */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search name, email or username"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSearch}>
          <Search />
        </IconButton>
      </Box>

      {/* ✅ Left / Right Team Count Bar */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: '#f8f9fa',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div className="text-sm font-semibold text-gray-800 mb-2">Team Overview</div>
        <div className="flex justify-between text-xs text-gray-700">
          {teamData.map((item) => (
            <div key={item.label}>
              {item.label}: <span style={{ color: item.color, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="flex mt-2 h-2 rounded overflow-hidden">
          {teamData.map((item) => (
            <div
              key={item.label}
              style={{
                width: `${
                  ((item.value || 0) /
                    ((teamData[0].value || 0) + (teamData[1].value || 0) || 1)) *
                  100
                }%`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>
      </Box>

      {/* ✅ Tree View */}
      <SimpleTreeView
        aria-label="Team Tree"
        expandedItems={expandedItems}
        onItemExpansionToggle={(e, id, expanding) => handleExpansionToggle(e, id, expanding)}
        slots={{
          expandIcon: AddBoxRoundedIcon,
          collapseIcon: IndeterminateCheckBoxRoundedIcon,
          endIcon: AddBoxRoundedIcon,
        }}
        sx={{ overflowX: 'auto', minHeight: 270, flexGrow: 1 }}
      >
        {filtered.map((m, i) => renderTree(m, i, filtered.length))}
      </SimpleTreeView>
    </div>
  )
}
