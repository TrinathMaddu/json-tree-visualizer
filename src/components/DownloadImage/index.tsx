import { useCallback } from "react"
import { Panel, useReactFlow, type Node } from "@xyflow/react"
import { toPng } from "html-to-image"
import "./index.css"

function downloadImage(dataUrl: string): void {
  const a = document.createElement("a")
  a.setAttribute("download", "json-tree-visualizer.png")
  a.setAttribute("href", dataUrl)
  a.click()
}

const DownloadButton = () => {
  const { getNodes } = useReactFlow()

  const onClick = useCallback(async () => {
    const nodes: Node[] = getNodes()
    if (!nodes.length) return

    const flowElement = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement | null
    if (!flowElement) return

    try {
      const dataUrl = await toPng(flowElement, {
        backgroundColor: "#ffffff"
      })

      downloadImage(dataUrl)
    } catch (err) {
      console.error("❌ Error generating PNG:", err)
    }
  }, [getNodes])

  return (
    <Panel position="top-right">
      <button className="downloadButton" onClick={onClick} type="button">
        Export as PNG
      </button>
    </Panel>
  )
}

export default DownloadButton
