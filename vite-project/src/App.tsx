import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import SeriesChart from "./components/SeriesChart/SeriesChart"

function App() {
	const [count, setCount] = useState(0)

	return (
		<div className="chartContainer">
			<SeriesChart
				start_year={2008}
				end_year={2013}
				title="Breaking Bad"
				parent_tconst="tt0364845"
				options={{
					mode: "rating",
					colorEnabled: true,
					lineEnabled: false,
				}}
			/>
		</div>
	)
}

export default App
