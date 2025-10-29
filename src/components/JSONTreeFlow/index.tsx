import {
  useNodesState,
  useEdgesState,
  ReactFlow,
  Background,
  Controls
} from "@xyflow/react"
import { useEffect } from "react"
import { getLayoutedElements, transformJsonToFlow } from "./helper"
import type { Edge, Node } from "@xyflow/react"
import JsonNode from "../JSONNode"

const JSONTreeFlow = ({ jsonData }: { jsonData: Record<string, unknown> }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    if (jsonData) {
      const { nodes: newNodes, edges: newEdges } = transformJsonToFlow(jsonData)

      const layouted = getLayoutedElements(newNodes, newEdges)
      setNodes(layouted.nodes as Node[])
      setEdges(layouted.edges as Edge[])
    }
  }, [jsonData, setEdges, setNodes])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={true}
      nodeTypes={{
        jsonNode: JsonNode
      }}
      defaultEdgeOptions={{
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#666666",
          strokeWidth: 1,
          strokeDasharray: "5,5"
        }
      }}
    >
      <Background />
      <Controls showZoom={true} showFitView={true} showInteractive={false} />
    </ReactFlow>
  )
}

export default JSONTreeFlow
