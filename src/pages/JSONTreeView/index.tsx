import { useState, useCallback, useEffect } from "react"
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import "./index.css"
import JSONInput from "../../components/JSONInput"

const initialNodes: Node[] = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } }
]
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }]

const JSONTreeView = () => {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(null)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )
  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((edgesSnapshot) => addEdge(connection, edgesSnapshot)),
    []
  )

  useEffect(() => {
    console.log(jsonData)
  }, [jsonData])

  return (
    <div className="root">
      <header className="header">JSON Tree Visualizer</header>

      <div className="body">
        <JSONInput setJsonData={setJsonData} />

        <div className="treeSection">
          <h2 className="sectionTitle">Tree Visualization</h2>
          <div className="treeContainer">
            {jsonData ? (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              />
            ) : (
              <div className="placeholder">
                Enter JSON data and click "Generate Tree" to visualize
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JSONTreeView
