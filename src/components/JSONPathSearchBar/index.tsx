import "../JSONInput/index.css"
import "./index.css"

const JSONPathSearchBar = ({
  searchPath,
  setSearchPath,
  isMatchFound,
  setIsMatchFound,
  findNodeByPath
}: {
  searchPath: string
  setSearchPath: (path: string) => void
  isMatchFound: "" | "found" | "not-found"
  setIsMatchFound: (status: "" | "found" | "not-found") => void
  findNodeByPath: () => void
}) => {
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearchPath(event.target.value)
    if (isMatchFound) {
      setIsMatchFound("")
    }
  }

  const handleSearch = () => {
    findNodeByPath()
  }

  const handleClearSearch = () => {
    setSearchPath("")
    setIsMatchFound("")
  }

  return (
    <div>
      <div className="inputSection">
        <h2 className="sectionTitle">Search Node by JSON Path</h2>
        <div className="inputContainer">
          <textarea
            className="textarea searchPathInput"
            value={searchPath}
            onChange={handleSearchInputChange}
            placeholder="Enter node path (e.g., $.user.id)"
            rows={1}
          />
          {isMatchFound === "found" && (
            <div className="matchFoundMessage">Match found</div>
          )}
          {isMatchFound === "not-found" && (
            <div className="matchNotFoundMessage">Match not found</div>
          )}
        </div>
        <div className="buttonContainer">
          <button className="buttonPrimary" onClick={handleSearch}>
            Search
          </button>
          <button className="buttonSecondary" onClick={handleClearSearch}>
            Clear Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default JSONPathSearchBar
