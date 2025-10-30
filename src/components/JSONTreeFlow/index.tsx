import {
  useNodesState,
  useEdgesState,
  ReactFlow,
  Background,
  Controls,
  useReactFlow
} from "@xyflow/react"
import { useEffect, useState } from "react"
import {
  appendRootNode,
  getDescendantNodes,
  getLayoutedElements,
  transformJsonToFlow
} from "./helper"
import type { Edge, Node } from "@xyflow/react"
import JsonNode from "../JSONNode"
import { DEFAULT_EDGE_OPTIONS } from "../../constants"
import DownloadButton from "../DownloadImage"

const JSONTreeFlow = ({
  jsonData,
  nodePathToSearch,
  updateSearchResult
}: {
  jsonData: Record<string, unknown>
  nodePathToSearch: string
  updateSearchResult: (isMatch: boolean) => void
}) => {
  const { fitView } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [pathToNodeIdMap, setPathToNodeIdMap] = useState<Map<string, string>>(
    new Map()
  )

  const getNodeIdFromPath = (path: string) => {
    return pathToNodeIdMap.get(path)
  }

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    // Get the clicked node and all its descendants
    const clickedNode = nodes.find((n) => n.id === node.id)
    const descendantNodes = getDescendantNodes(nodes, edges, node.id)
    const subtreeNodes = clickedNode
      ? [clickedNode, ...descendantNodes]
      : descendantNodes

    fitView({
      nodes: subtreeNodes,
      padding: 0.2,
      duration: 800,
      minZoom: 0.1,
      maxZoom: 2
    })
  }

  const selectAndFocusOnNode = (nodeId: string) => {
    let clickedNode = undefined
    const updatedNodes = nodes.map((n) => {
      if (n.id === nodeId) {
        clickedNode = n
      }
      return { ...n, selected: n.id === nodeId }
    })
    if (clickedNode) {
      setNodes(updatedNodes)
      fitView({
        nodes: [clickedNode],
        padding: 0.2,
        duration: 800,
        minZoom: 0.1,
        maxZoom: 2
      })
    }
  }

  useEffect(() => {
    if (jsonData) {
      const {
        nodes: newNodes,
        edges: newEdges,
        pathToNodeIdMap
      } = transformJsonToFlow(appendRootNode(jsonData))

      const layouted = getLayoutedElements(newNodes, newEdges)
      setNodes(layouted.nodes as Node[])
      setEdges(layouted.edges as Edge[])
      setPathToNodeIdMap(pathToNodeIdMap)
    }
  }, [jsonData, setEdges, setNodes])

  useEffect(() => {
    if (nodePathToSearch) {
      const nodeId = getNodeIdFromPath(nodePathToSearch)
      if (nodeId) {
        selectAndFocusOnNode(nodeId)
        updateSearchResult(true)
      } else {
        updateSearchResult(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodePathToSearch])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={true}
      nodeTypes={{
        jsonNode: JsonNode
      }}
      defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
    >
      <Background />
      <Controls showZoom={true} showFitView={true} showInteractive={false} />
      <DownloadButton />
    </ReactFlow>
  )
}

export default JSONTreeFlow
