import { type Edge, type Node } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"

// Transform JSON data to React Flow nodes and edges
export const transformJsonToFlow = (
  data: Record<string, unknown>
): {
  nodes: Node[]
  edges: Edge[]
  pathToNodeIdMap: Map<string, string>
  nodeIdToPathMap: Map<string, string>
} => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let nodeId = 0

  const pathToNodeIdMap = new Map<string, string>()
  const nodeIdToPathMap = new Map<string, string>()

  const processValue = (
    value: unknown | Record<string, unknown> | unknown[],
    key: string,
    parentId: string | undefined,
    depth: number,
    yIndex: number,
    path: string
  ): void => {
    const currentId = `node-${nodeId++}`
    const x = depth * 300
    const y = yIndex * 120

    let nodeType = "string"
    let nodeValue = value
    let keysLength = 0
    let arrayLength = 0

    if (value === null) {
      nodeType = "null"
      nodeValue = null
    } else if (Array.isArray(value)) {
      nodeType = "array"
      arrayLength = value.length
      nodeValue = `[${arrayLength} item${arrayLength > 1 ? "s" : ""}]`
    } else if (typeof value === "object") {
      nodeType = "object"
      keysLength = Object.keys(value).length
      nodeValue = `{${keysLength} key${keysLength > 1 ? "s" : ""}}`
    } else {
      nodeType = typeof value
      nodeValue = value
    }

    const isArrayItem = key && key[0] === "[" && key[key.length - 1] === "]"
    const currentPath = `${path}${path && !isArrayItem ? "." : ""}${key}`
    pathToNodeIdMap.set(currentPath, currentId)
    nodeIdToPathMap.set(currentId, currentPath)

    nodes.push({
      id: currentId,
      type: "jsonNode",
      position: { x, y },
      data: {
        id: currentId,
        label: key,
        type: nodeType,
        value: nodeValue,
        path: currentPath
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
          processValue(
            item,
            `[${index}]`,
            currentId,
            depth + 1,
            index,
            currentPath
          )
        })
      } else {
        let childIndex = 0
        Object.entries(value).forEach(([childKey, childValue]) => {
          processValue(
            childValue,
            childKey,
            currentId,
            depth + 1,
            childIndex,
            currentPath
          )
          childIndex++
        })
      }
    }
  }

  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        processValue(item, `[${index}]`, undefined, 0, index, "")
      })
    } else {
      let index = 0
      Object.entries(data).forEach(([key, value]) => {
        processValue(value, key, undefined, 0, index, "")
        index++
      })
    }
  } else {
    processValue(data, "root", undefined, 0, 0, "")
  }

  return { nodes, edges, pathToNodeIdMap, nodeIdToPathMap }
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

//Append root node to the given data
export const appendRootNode = (data: Record<string, unknown>) => {
  return {
    $: {
      ...data
    }
  }
}

// Find all descendant nodes of the clicked node
export const getDescendantNodes = (
  nodes: Node[],
  edges: Edge[],
  nodeId: string
): Node[] => {
  const descendants: Node[] = []

  const traverse = (currentNodeId: string) => {
    const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId)

    // DFS traversal
    outgoingEdges.forEach((edge) => {
      const targetNode = nodes.find((n) => n.id === edge.target)
      if (targetNode) {
        descendants.push(targetNode)
        traverse(targetNode.id)
      }
    })
  }

  traverse(nodeId)
  return descendants
}
