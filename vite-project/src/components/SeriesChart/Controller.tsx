import React, { useState } from "react"
import { Button, CircularProgress } from "@mui/material"
import { useStore } from "../../hooks/store"
import SeriesChart from "./SeriesChart"

interface StoredOption {
	y_axis: "rating" | "votes"
	mode: mode
	colorEnabled: boolean
	beginAtZero: boolean
}

const Controller = () => {
	const storedOptionsString = localStorage.getItem("options")
	const optionsStored = storedOptionsString ? (JSON.parse(storedOptionsString) as StoredOption) : null
	const defaultOptions =
		optionsStored == null
			? ({ y_axis: "rating", mode: "both", colorEnabled: true, beginAtZero: true } as StoredOption)
			: optionsStored
	console.log(defaultOptions)
	const [y_axis, setYAxis] = useState<"rating" | "votes">(defaultOptions.y_axis)
	const [mode, setMode] = useState<mode>(defaultOptions.mode)
	const [beginAtZero, setBeginAtZero] = useState(defaultOptions.beginAtZero)
	const [colorEnabled, setColorEnabled] = useState(defaultOptions.colorEnabled)

	const isLoadingDetails = useStore((state) => state.isLoadingDetails)
	// const isLoadingDetails = true

	const modeText = () => {
		if (mode === "point") return "Point"
		else if (mode === "line") return "Line"
		else return "Both"
	}

	const currentSaveOption = {
		y_axis: y_axis,
		mode: mode,
		colorEnabled: colorEnabled,
		beginAtZero: beginAtZero,
	}

	return (
		<>
			<div className="app-element button-group">
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
						localStorage.setItem("options", JSON.stringify(saveOption))

						setColorEnabled(!colorEnabled)
					}}
				>
					{colorEnabled ? "Color" : "No Color"}
				</Button>
				<Button
					variant="outlined"
					color={beginAtZero ? "secondary" : "success"}
					onClick={() => {
						let saveOption = { ...currentSaveOption }
						saveOption.beginAtZero = !beginAtZero
						localStorage.setItem("options", JSON.stringify(saveOption))

						setBeginAtZero(!beginAtZero)
					}}
				>
					{beginAtZero ? "Begin at 0" : "Begin at min"}
				</Button>
				{isLoadingDetails ? <CircularProgress className="progress-bar" /> : <></>}
			</div>
			<div className="app-element">
				<SeriesChart
					options={{ y_axis: y_axis, mode: mode, colorEnabled: colorEnabled, beginAtZero: beginAtZero }}
				/>
			</div>
		</>
	)
}

export default Controller
