import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import SeriesChart from "./components/SeriesChart/SeriesChart"
import Controller from "./components/SeriesChart/Controller"

function App() {
	const [count, setCount] = useState(0)

	return (
		<div className="chartContainer">
			<Controller />
		</div>
	)
}

export default App
