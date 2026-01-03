'use client'

import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem'
import { Tooltip, TextField, CircularProgress, Box } from '@mui/material'
import {
  IndeterminateCheckBoxRounded as CollapseIcon,
  AddBoxRounded as ExpandIcon,
  EmojiEvents,
  Diamond as DiamondIcon,
  MilitaryTech as MilitaryTechIcon,
  Grade as GradeIcon,
} from '@mui/icons-material'
import { Copy, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface TeamMember {
  name: string | null
  id: string | null
  user_name: string | null
  email: string | null
  club: string
  level: number
  total_staking: number
  team_staking: number
  children: TeamMember[]
}

interface TeamTreeMUIProps {
  team: TeamMember[]
  onUserClick?: (user_id: string, user: TeamMember) => void
  fetchUserChildren: (user_id: string) => Promise<TeamMember[]>
}
const copyToClipboard = (text: string) => {
  if (!text) return toast.error("Nothing to copy");

  navigator.clipboard.writeText(text)
    .then(() => toast.success("Copied!"))
    .catch(() => toast.error("Copy failed"));
};


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

const TeamTreeMUI: React.FC<TeamTreeMUIProps> = ({
  team,
  onUserClick,
  fetchUserChildren,
}) => {
  const [query, setQuery] = React.useState('')
  const [treeData, setTreeData] = React.useState<TeamMember[]>([])
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const [loadedNodes, setLoadedNodes] = React.useState<Set<string>>(new Set())
  const [loadingNode, setLoadingNode] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (treeData.length === 0 && team.length > 0) {
      const ensureChildren = (nodes: TeamMember[]): TeamMember[] =>
        nodes.map((node) => ({
          ...node,
          children: node.children ?? [],
        }))
      setTreeData(ensureChildren(team))
    }
  }, [team])

  const handleToggle = async (nodeId: string, member: TeamMember) => {
    const scrollY = window.scrollY;
    const isExpanded = expandedItems.includes(nodeId);

    const restoreScroll = () => {
      window.scrollTo({ top: scrollY, behavior: 'auto' });
    };

    if (!isExpanded) {
      setExpandedItems((prev) => [...prev, nodeId]);

      if (!loadedNodes.has(nodeId)) {
        setLoadingNode(nodeId);

        const prevScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';

        try {
          const children = await fetchUserChildren(member.id || '');

          if (!children || children.length === 0) {
            toast.error('No data found');
            return;
          }

          const updateTree = (nodes: TeamMember[]): TeamMember[] =>
            nodes.map((node) =>
              node.id === member.id
                ? { ...node, children }
                : node.children?.length
                  ? { ...node, children: updateTree(node.children) }
                  : node
            );

          setTreeData((prev) => updateTree(prev));
          setLoadedNodes((prev) => new Set(prev).add(nodeId));
        } catch (err: any) {
          console.error('Subtree fetch failed:', err);
          toast.error('No data found');
        } finally {
          setLoadingNode(null);
          restoreScroll();
          document.documentElement.style.scrollBehavior = prevScrollBehavior;
        }
      } else {
        restoreScroll();
      }
    } else {
      setExpandedItems((prev) => prev.filter((id) => id !== nodeId));
      restoreScroll();
    }
  };

  const renderTree = (member: TeamMember): React.ReactNode => {
    const nodeId = member.id || '';
    const label = (
      <span className="gap-1 flex items-center text-[12px]">
        {getClubIcon(member.club)}

        <Tooltip
          title={
            <div className="text-xs p-1">
              <div>Level: L{member.level}</div>
              <div>Club: {member.club}</div>
              <div>Name: {member.name}</div>

              <div className="flex items-center gap-1">
                <span>Email: {member.email}</span>
                <button
                  onClick={() => copyToClipboard(member.email || '')}
                  className="px-1 text-white hover:cursor-pointer border-red-500 border-1 flex gap-0.5 items-center hover:underline"
                >
                  Copy <span><Copy className=' w-3' /></span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <span>Username: {member.user_name}</span>
                <button
                  onClick={() => copyToClipboard(member.user_name || '')}
                  className="px-1 text-white hover:cursor-pointer border-red-500 border-1 flex gap-0.5 items-center hover:underline"
                >
                  Copy <span><Copy className=' w-3' /></span>
                </button>

              </div>

              <div>Total Staking: {member.total_staking}</div>
              <div>Team Staking: {member.team_staking}</div>
            </div>
          }
          placement="bottom"
          arrow
        >
          <div>
            <span className="cursor-pointer text-black hover:underline">
              Level: L{member.level} -
            </span>
            <span className="cursor-pointer text-blue-600 hover:underline">
              [Id:{member.user_name}]
            </span>
          </div>
        </Tooltip>
      </span>
    )


    return (
      <CustomTreeItem
        key={nodeId}
        itemId={nodeId}
        label={label}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedItems([nodeId]);
          handleToggle(nodeId, member);
        }}
      >
        {expandedItems.includes(nodeId) &&
          (loadingNode === nodeId ? (
            <Box className="p-2">
              <CircularProgress size={20} />
            </Box>
          ) : (
            member.children?.map((child) => renderTree(child))
          ))}
      </CustomTreeItem>
    )
  }

  const getClubIcon = (club: string) => {
    const iconProps = {
      sx: { width: 30, height: 30 },
      className: 'bg-white w-5 h-5 rounded-2xl border-4',
    }

    switch (club) {
      case 'Basic':
        return (
          <User className="w-[30px] h-[30px] text-gray-600 border-gray-600 border-4 rounded-2xl" />
        )
      case 'Bronze':
        return (
          <MilitaryTechIcon
            {...iconProps}
            className="text-amber-700 border-amber-700"
          />
        )
      case 'Silver':
        return (
          <MilitaryTechIcon
            {...iconProps}
            className="text-gray-500 border-gray-500"
          />
        )
      case 'Gold':
        return (
          <MilitaryTechIcon
            {...iconProps}
            className="text-yellow-500 border-yellow-500"
          />
        )
      case 'Platinum':
        return (
          <GradeIcon {...iconProps} className="text-gray-400 border-gray-500" />
        )
      case 'Diamond':
        return (
          <DiamondIcon
            {...iconProps}
            className="text-amber-700 border-amber-700"
          />
        )
      case 'Double Diamond':
        return <DiamondIcon {...iconProps} className="text-gray-500" />
      case 'Triple Diamond':
        return (
          <DiamondIcon
            {...iconProps}
            className="text-yellow-500 border-yellow-500"
          />
        )
      case 'Kait King':
        return (
          <EmojiEvents
            {...iconProps}
            className="text-yellow-600 border-yellow-600"
          />
        )
      default:
        return (
          <User className="w-[30px] h-[30px] text-gray-600 border-gray-600 border-4 rounded-2xl" />
        )
    }
  }
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  return (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search name, email or username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />

      {treeData.length === 0 && loadingNode === null ? (
        <Box className="p-4 w-full flex justify-center">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <SimpleTreeView
          multiSelect // ✅ tells TS that selectedItems is string[]
          aria-label="Team Tree"
          expandedItems={expandedItems}
          selectedItems={selectedItems}
          onSelectedItemsChange={(event, ids) => setSelectedItems(ids ?? [])} // ✅ ids can be null, so fallback to []
          onItemExpansionToggle={(event, itemId, isExpanded) => {
            if (event) {
              event.preventDefault?.();
              event.stopPropagation?.();
            }

            const findMember = (nodes: TeamMember[], id: string): TeamMember | null => {
              for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children?.length) {
                  const found = findMember(node.children, id);
                  if (found) return found;
                }
              }
              return null;
            };


            const member = findMember(treeData, itemId);
            if (member) {
              handleToggle(itemId, member);
            }
          }}
          slots={{
            expandIcon: ExpandIcon,
            collapseIcon: CollapseIcon,
            endIcon: ExpandIcon,
          }}
          sx={{
            overflowX: 'auto',
            minHeight: 270,
            flexGrow: 1,
            width: '100%',
          }}
        >
          {treeData.map((member) => renderTree(member))}
        </SimpleTreeView>


      )}
    </div>
  )
}

export default TeamTreeMUI
