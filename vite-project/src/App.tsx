import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import SeriesChart from "./components/SeriesChart/SeriesChart"


function App() {
	const [count, setCount] = useState(0)


	return <div className="App">
		<SeriesChart parent_tconst="tt0944947" />
	</div>
}

export default App
