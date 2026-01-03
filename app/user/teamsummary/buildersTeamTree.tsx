// buildersTeamTree.ts
import { UserTreeNode } from '@/store/slices/user/userTreeApiList'

export interface TeamMember extends UserTreeNode {
  children: TeamMember[]
  user_id: string 
}

export default function buildTeamTree(flatNodes: UserTreeNode[] = []): TeamMember[] {
  const nodeMap: Record<string, TeamMember> = {}

  for (const node of flatNodes) {
    if (!node.id) continue
    nodeMap[node.id] = {
      ...node,
      children: [],
      user_id: node.user_id || node.id, 
    }
  }

  const tree: TeamMember[] = []

  for (const node of flatNodes) {
    const currentNode = nodeMap[node.id!]
    if (node.parent_id && nodeMap[node.parent_id]) {
      nodeMap[node.parent_id].children.push(currentNode)
    } else {
      tree.push(currentNode)
    }
  }

  return tree
}
