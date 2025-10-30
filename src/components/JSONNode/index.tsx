import { Handle, Position } from "@xyflow/react"
import { useCallback, type FC } from "react"
import "./index.css"

const JsonNode: FC<{
  data: { label: string; type: string; value?: unknown }
  selected: boolean
}> = ({ data, selected }) => {
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

  return (
    <div
      className={`jsonNode ${getNodeClass(data.type)} ${
        selected ? "selectedNode" : ""
      }`}
    >
      <Handle type="target" position={Position.Top} className="handleTarget" />
      <div className="nodeLabel">{data.label}</div>
      {data.value !== undefined && (
        <div className="nodeValue">{getNodeValue(data.type, data.value)}</div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        className="handleSource"
      />
    </div>
  )
}

export default JsonNode
