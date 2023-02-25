import { Button } from "@mui/material"
import React, { useState } from "react"
import { useStore } from "../../hooks/store"
import Search from "../Search/Search"
import SeriesChart from "./SeriesChart"

const Controller = () => {
	const [y_axis, setYAxis] = useState<"rating" | "votes">("rating")
	// const [lineEnabled, setLineEnabled] = useState(true)
	const [mode, setMode] = useState<mode>("both")
	const [colorEnabled, setColorEnabled] = useState(true)
	// const [pointsEnabled, setPointsEnabled] = useState(false)

	const handleModeButton = () => {
		setYAxis(() => (y_axis === "rating" ? "votes" : "rating"))
	}

	const modeText = () => {
		if (mode === "point") return "Point"
		else if (mode === "line") return "Line"
		else return "Both"
	}

	const showInfo = useStore((state) => state.showInfo)

	return (
		<div>
			<Search />

			<Button variant="outlined" color={y_axis === "rating" ? "secondary" : "success"} onClick={handleModeButton}>
				{y_axis === "rating" ? "Rating" : "Votes"}
			</Button>
			<Button
				variant="outlined"
				color={mode === "point" ? "secondary" : "success"}
				onClick={() => {
					if (mode == "point") setMode("line")
					else if (mode == "line") setMode("both")
					else setMode("point")
				}}
			>
				{modeText()}
			</Button>
			<Button
				variant="outlined"
				color={colorEnabled ? "secondary" : "success"}
				onClick={() => setColorEnabled(!colorEnabled)}
			>
				{colorEnabled ? "Color" : "No Color"}
			</Button>

			<SeriesChart
				parent_tconst={showInfo.tconst}
				showTitle={showInfo.primary_title}
				options={{
					y_axis: y_axis,
					mode: mode,
					colorEnabled: colorEnabled,
				}}
			/>
		</div>
	)
}

export default Controller
