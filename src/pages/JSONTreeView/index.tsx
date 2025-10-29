import { useState, useEffect } from "react"
import "@xyflow/react/dist/style.css"
import "./index.css"
import JSONInput from "../../components/JSONInput"
import JSONTreeFlow from "../../components/JSONTreeFlow"

const JSONTreeView = () => {
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(null)

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
              <JSONTreeFlow jsonData={jsonData} />
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
