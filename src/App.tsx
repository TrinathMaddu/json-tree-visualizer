import "./App.css"
import JSONTreeView from "./pages/JSONTreeView"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <JSONTreeView />
    </ThemeProvider>
  )
}

export default App
