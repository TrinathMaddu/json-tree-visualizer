import { type Edge, type Node } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"

// Transform JSON data to React Flow nodes and edges
export const transformJsonToFlow = (
  data: Record<string, unknown>
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let nodeId = 0

  const processValue = (
    value: unknown | Record<string, unknown> | unknown[],
    key: string,
    parentId: string | undefined,
    depth: number,
    yIndex: number
  ): void => {
    const currentId = `node-${nodeId++}`
    const x = depth * 300
    const y = yIndex * 120

    let nodeType = "string"
    let nodeValue = value

    if (value === null) {
      nodeType = "null"
      nodeValue = null
    } else if (Array.isArray(value)) {
      nodeType = "array"
      nodeValue = `[${value.length} items]`
    } else if (typeof value === "object") {
      nodeType = "object"
      nodeValue = `{${Object.keys(value).length} keys}`
    } else {
      nodeType = typeof value
      nodeValue = value
    }

    nodes.push({
      id: currentId,
      type: "jsonNode",
      position: { x, y },
      data: {
        id: currentId,
        label: key,
        type: nodeType,
        value: nodeValue
      }
    })

    // Add edge to parent
    if (parentId) {
      const edge = {
        id: `edge-${parentId}-${currentId}`,
        source: parentId,
        target: currentId
      }
      edges.push(edge)
    }

    // Process children for objects and arrays
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          processValue(item, `[${index}]`, currentId, depth + 1, index)
        })
      } else {
        let childIndex = 0
        Object.entries(value).forEach(([childKey, childValue]) => {
          processValue(childValue, childKey, currentId, depth + 1, childIndex)
          childIndex++
        })
      }
    }
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        processValue(item, `[${index}]`, undefined, 0, index)
      })
    } else {
      let index = 0
      Object.entries(data).forEach(([key, value]) => {
        processValue(value, key, undefined, 0, index)
        index++
      })
    }
  } else {
    processValue(data, "root", undefined, 0, 0)
  }

  return { nodes, edges }
}

const nodeWidth = 172
const nodeHeight = 50

// Layout the nodes and edges using Dagre, apply vertical layout by default
export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: "TB" | "LR" } = { direction: "TB" }
) => {
  const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

  dagreGraph.setGraph({
    rankdir: options.direction
  })

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target))

  nodes.forEach((node) =>
    dagreGraph.setNode(node.id, {
      ...node,
      width: nodeWidth,
      height: nodeHeight
    })
  )

  Dagre.layout(dagreGraph)

  return {
    nodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id)
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - nodeWidth / 2
      const y = position.y - nodeHeight / 2

      return { ...node, position: { x, y } }
    }),
    edges: edges
  }
}
