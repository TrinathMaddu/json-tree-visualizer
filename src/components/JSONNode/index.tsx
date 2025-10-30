import { Handle, NodeToolbar, Position } from "@xyflow/react"
import { useCallback, useMemo, useState, type FC } from "react"
import "./index.css"

const JsonNode: FC<{
  data: { label: string; type: string; value?: unknown; path: string }
  selected: boolean
}> = ({ data, selected }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const getNodeClass = useCallback((type: string) => {
    switch (type) {
      case "object":
        return "objectNode"
      case "array":
        return "arrayNode"
      case "string":
      case "number":
      case "boolean":
      case "null":
        return "primitiveNode"
      default:
        return "defaultNode"
    }
  }, [])

  const getNodeValue = useCallback((type: string, value: unknown) => {
    switch (type) {
      case "array":
      case "object":
      case "number":
        return value as string | number
      case "string":
        return `"${value}"`
      case "boolean":
      case "null":
      default:
        return String(value)
    }
  }, [])

  const nodeValue = useMemo(
    () => getNodeValue(data.type, data.value),
    [data.type, data.value, getNodeValue]
  )

  const nodePath = useMemo(() => data.path, [data.path])

  return (
    <div
      className={`jsonNode ${getNodeClass(data.type)} ${
        selected ? "selectedNode" : ""
      }`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Top} className="handleTarget" />
      <div className="nodeLabel">{data.label}</div>
      {data.value !== undefined && <div className="nodeValue">{nodeValue}</div>}
      <Handle
        type="source"
        position={Position.Bottom}
        className="handleSource"
      />

      <NodeToolbar isVisible={showTooltip} className="nodeTooltip">
        <div>
          <strong>Path:</strong> {nodePath}
        </div>
        <div>
          <strong>Value:</strong> {nodeValue}
        </div>
      </NodeToolbar>
    </div>
  )
}

export default JsonNode
