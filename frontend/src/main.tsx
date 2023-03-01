import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

const StrictMode = true

if (StrictMode) {
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
} else {
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />)
}
