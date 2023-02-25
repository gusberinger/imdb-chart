import { Button } from "@mui/material"
import React, { useState } from "react"
import { useStore } from "../../hooks/store"
import Search from "../Search/Search"
import SeriesChart from "./SeriesChart"

const Controller = () => {
	const [mode, setMode] = useState<"rating" | "votes">("rating")
	const [lineEnabled, setLineEnabled] = useState(true)
	const [colorEnabled, setColorEnabled] = useState(false)
	const [pointsEnabled, setPointsEnabled] = useState(false)

	const handleModeButton = () => {
		setMode(() => (mode === "rating" ? "votes" : "rating"))
	}

	const showInfo = useStore((state) => state.showInfo)

	return (
		<div>
			<Search />

			<Button variant="outlined" color={mode === "rating" ? "secondary" : "success"} onClick={handleModeButton}>
				{mode === "rating" ? "Rating" : "Votes"}
			</Button>
			<Button
				variant="outlined"
				color={lineEnabled ? "secondary" : "success"}
				onClick={() => setLineEnabled(!lineEnabled)}
			>
				{lineEnabled ? "Line" : "No Line"}
			</Button>
			<Button
				variant="outlined"
				color={colorEnabled ? "secondary" : "success"}
				onClick={() => setColorEnabled(!colorEnabled)}
			>
				{colorEnabled ? "Color" : "No Color"}
			</Button>

			<Button
				variant="outlined"
				color={pointsEnabled ? "secondary" : "success"}
				onClick={() => setPointsEnabled(!pointsEnabled)}
			>
				{pointsEnabled ? "Points" : "No Points"}
			</Button>

			<SeriesChart
				parent_tconst={showInfo.tconst}
				showTitle={showInfo.primary_title}
				options={{
					mode: mode,
					lineEnabled: lineEnabled,
					colorEnabled: colorEnabled,
					pointsEnabled: pointsEnabled,
				}}
			/>
		</div>
	)
}

export default Controller
