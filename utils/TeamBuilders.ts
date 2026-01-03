import { TeamMember } from "@/components/materialui/TreeWrap";
import { UserTreeNode } from "@/store/slices/admin/usertreeSlice";

export function buildTeamTree(flatNodes: UserTreeNode[] = []): TeamMember[] {
  const nodeMap: Record<string, TeamMember> = {};

  for (const node of flatNodes) {
    if (!node.id) continue; 
    nodeMap[node.id] = {
      ...node,
      children: [],
    };
  }

  const rootNodes: TeamMember[] = [];

  for (const node of flatNodes) {
    if (!node.id) continue;

    const currentNode = nodeMap[node.id];
    const parentId = node.parent_id;

    if (parentId && nodeMap[parentId]) {
      nodeMap[parentId].children.push(currentNode);
    } else {
      rootNodes.push(currentNode); 
    }
  }

  return rootNodes;
}
