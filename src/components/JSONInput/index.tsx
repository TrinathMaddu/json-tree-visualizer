import { useState } from "react"
import "./index.css"
import { SAMPLE_JSON } from "../../constants"

const JSONInput = ({
  setJsonData
}: {
  setJsonData: React.Dispatch<
    React.SetStateAction<Record<string, unknown> | null>
  >
}) => {
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value)
    setError("")
  }

  const handleSubmit = () => {
    try {
      const parsedData = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsedData))
      setJsonData(parsedData)
      setError("")
    } catch (err) {
      setError(`Invalid JSON format. Please check your input. ${err}`)
      setJsonData(null)
    }
  }

  const handleFormatJSON = () => {
    try {
      const parsedData = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsedData, null, 2))
      setError("")
    } catch (err) {
      setError(`Invalid JSON format. Please check your input. ${err}`)
    }
  }

  const handleClear = () => {
    setJsonInput("")
    setJsonData(null)
    setError("")
  }

  const loadSampleData = () => {
    setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2))
    setJsonData(SAMPLE_JSON)
    setError("")
  }

  return (
    <div className="inputSection">
      <h2 className="title">JSON Input</h2>
      <div className="inputContainer">
        <textarea
          className="textarea"
          placeholder="Enter your JSON data here..."
          value={jsonInput}
          onChange={handleInputChange}
          rows={10}
        />
        {error && <div className="errorMessage">{error}</div>}
      </div>

      <div className="buttonContainer">
        <button className="buttonPrimary" onClick={handleSubmit}>
          Generate Tree
        </button>
        <button className="buttonSecondary" onClick={handleFormatJSON}>
          Format JSON
        </button>
        <button className="buttonSecondary" onClick={handleClear}>
          Clear
        </button>
        <button className="buttonSecondary" onClick={loadSampleData}>
          Load Sample
        </button>
      </div>
    </div>
  )
}

export default JSONInput
