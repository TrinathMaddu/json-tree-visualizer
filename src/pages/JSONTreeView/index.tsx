import { useCallback, useEffect, useRef, useState } from "react"
import "@xyflow/react/dist/style.css"
import "./index.css"
import JSONInput from "../../components/JSONInput"
import JSONTreeFlow from "../../components/JSONTreeFlow"
import JSONPathSearchBar from "../../components/JSONPathSearchBar"
import { ReactFlowProvider } from "@xyflow/react"

const JSONTreeView = () => {
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(null)
  const [searchPath, setSearchPath] = useState("")
  const [isMatchFound, setIsMatchFound] = useState<"" | "found" | "not-found">(
    ""
  )
  const [nodePathToSearch, setNodePathToSearch] = useState<string>("")
  const treeSectionRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | null>(null)

  const scrollTreeSectionToTop = useCallback(() => {
    if (treeSectionRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        treeSectionRef.current?.scrollIntoView?.({
          behavior: "smooth",
          block: "center"
        })
      }, 300)
    }
  }, [])

  const findNodeByPath = () => {
    const trimmedSearchPath = searchPath.trim()
    if (trimmedSearchPath === "") {
      return
    }
    setSearchPath(trimmedSearchPath)
    setNodePathToSearch(trimmedSearchPath)
  }

  const updateSearchResult = (isMatch: boolean) => {
    if (isMatch) {
      setIsMatchFound("found")
      scrollTreeSectionToTop()
    } else {
      setIsMatchFound("not-found")
    }
    setNodePathToSearch("")
  }

  useEffect(() => {
    if (jsonData) {
      scrollTreeSectionToTop()
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [jsonData, scrollTreeSectionToTop])

  return (
    <div className="root">
      <header className="header">JSON Tree Visualizer</header>

      <div className="body">
        <JSONInput setJsonData={setJsonData} />

        <div className="treeSection" ref={treeSectionRef}>
          <h2 className="sectionTitle">Tree Visualization</h2>
          <div className="treeContainer">
            {jsonData ? (
              <ReactFlowProvider fitView>
                <JSONTreeFlow
                  jsonData={jsonData}
                  nodePathToSearch={nodePathToSearch}
                  updateSearchResult={updateSearchResult}
                />
              </ReactFlowProvider>
            ) : (
              <div className="placeholder">
                Enter JSON data and click "Generate Tree" to visualize
              </div>
            )}
          </div>
        </div>

        {jsonData && (
          <JSONPathSearchBar
            findNodeByPath={findNodeByPath}
            searchPath={searchPath}
            setSearchPath={setSearchPath}
            isMatchFound={isMatchFound}
            setIsMatchFound={setIsMatchFound}
          />
        )}
      </div>
    </div>
  )
}

export default JSONTreeView
