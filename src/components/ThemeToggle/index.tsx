import { useTheme } from "../../context/ThemeContext"
import "./index.css"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="themeToggle" onClick={toggleTheme}>
      {theme === "light" ? "🌙 Dark" : "🌞 Light"}
    </button>
  )
}

export default ThemeToggle
