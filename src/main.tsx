import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/index.css"
import App from "./app/App"
import { ThemeProvider } from "./context/ThemeProvider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="math-node-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
