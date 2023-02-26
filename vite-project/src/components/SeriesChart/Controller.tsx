import React, { useState } from "react"
import { Button } from "@mui/material"
import { useStore } from "../../hooks/store"
import SeriesChart from "./SeriesChart"

interface StoredOption {
	y_axis: "rating" | "votes"
	mode: mode
	colorEnabled: boolean
}

const Controller = () => {
	const storedOptionsString = localStorage.getItem("options")
	const optionsStored = storedOptionsString ? (JSON.parse(storedOptionsString) as StoredOption) : null
	const defaultOptions =
		optionsStored == null ? ({ y_axis: "rating", mode: "both", colorEnabled: true } as StoredOption) : optionsStored
	console.log(defaultOptions)
	const [y_axis, setYAxis] = useState<"rating" | "votes">(defaultOptions.y_axis)
	const [mode, setMode] = useState<mode>(defaultOptions.mode)
	const [colorEnabled, setColorEnabled] = useState(defaultOptions.colorEnabled)

	const modeText = () => {
		if (mode === "point") return "Point"
		else if (mode === "line") return "Line"
		else return "Both"
	}

	const currentSaveOption = {
		y_axis: y_axis,
		mode: mode,
		colorEnabled: colorEnabled,
	}

	return (
		<>
			<div className="app-element">
				<Button
					variant="outlined"
					color={y_axis === "rating" ? "secondary" : "success"}
					onClick={() => {
						const nextYAxis = y_axis === "rating" ? "votes" : "rating"
						let saveOption = { ...currentSaveOption }
						saveOption.y_axis = nextYAxis
						localStorage.setItem("options", JSON.stringify(saveOption))

						setYAxis(nextYAxis)
					}}
				>
					{y_axis === "rating" ? "Rating" : "Votes"}
				</Button>
				<Button
					variant="outlined"
					color={mode === "point" ? "secondary" : "success"}
					onClick={() => {
						// point -> line -> both -> point cycle
						let newMode: mode

						if (mode === "point") newMode = "line"
						else if (mode === "line") newMode = "both"
						else newMode = "point"

						let saveOption = { ...currentSaveOption } as StoredOption
						saveOption.mode = newMode
						console.log("save: ", saveOption)
						localStorage.setItem("options", JSON.stringify(saveOption))

						setMode(newMode)
					}}
				>
					{modeText()}
				</Button>
				<Button
					variant="outlined"
					color={colorEnabled ? "secondary" : "success"}
					onClick={() => {
						let saveOption = { ...currentSaveOption }
						saveOption.colorEnabled = !colorEnabled
						console.log(saveOption)
						localStorage.setItem("options", JSON.stringify(saveOption))

						setColorEnabled(!colorEnabled)
					}}
				>
					{colorEnabled ? "Color" : "No Color"}
				</Button>
			</div>
			<div className="app-element">
				<SeriesChart options={{ y_axis: y_axis, mode: mode, colorEnabled: colorEnabled }} />
			</div>
		</>
	)
}

export default Controller
