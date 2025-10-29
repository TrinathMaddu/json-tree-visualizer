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
        return "primitiveNode"
      default:
        return "defaultNode"
    }
  }, [])

  const getNodeValue = useCallback((type: string, value: unknown) => {
    switch (type) {
      case "array":
      case "object":
        return value as string
      case "string":
        return `"${value}"`
      case "number":
        return value as number
      case "boolean":
      default:
        return String(value)
    }
  }, [])

  return (
    <div
      className={`jsonNode ${getNodeClass(data.type)}`}
      style={{
        border: selected ? "1.5px solid #4C6EF5" : "1px solid #ccc"
      }}
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
