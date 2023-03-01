import React from "react"
import { Button, ButtonGroup } from "@mui/material"
import { useStore } from "../../hooks/store"

const Controller = () => {
	const chartOptions = useStore((state) => state.chartOptions)
	const isLoadingDetails = useStore((state) => state.isLoadingDetails)
	const { y_axis, x_axis, mode, colorEnabled, beginAtZero } = chartOptions
	const setChartOptions = useStore((state) => state.setChartOptions)

	const modeText = () => {
		if (mode === "point") return "Point"
		else if (mode === "line") return "Line"
		else return "Line/Point"
	}

	const airDateButtonLabel = isLoadingDetails ? "Air Date (Loading)" : "Air Date"

	return (
		<>
			<ButtonGroup variant="outlined" color="success">
				<Button
					variant="outlined"
					color={y_axis === "rating" ? "secondary" : "success"}
					onClick={() => {
						const nextYAxis = y_axis === "rating" ? "votes" : "rating"
						setChartOptions({ ...chartOptions, y_axis: nextYAxis })
					}}
				>
					{y_axis === "rating" ? "Rating" : "Votes"}
				</Button>
				<Button
					variant="outlined"
					color={x_axis === "air_date" ? "secondary" : "success"}
					onClick={() => {
						const nextXAxis = x_axis === "air_date" ? "episode_number" : "air_date"
						setChartOptions({ ...chartOptions, x_axis: nextXAxis })
					}}
				>
					{x_axis === "air_date" ? airDateButtonLabel : "Episode Number"}
				</Button>
				<Button
					variant="outlined"
					color={beginAtZero ? "secondary" : "success"}
					onClick={() => {
						setChartOptions({ ...chartOptions, beginAtZero: !beginAtZero })
					}}
				>
					{beginAtZero ? "Begin at 0" : "Begin at min"}
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

						setChartOptions({ ...chartOptions, mode: newMode })
					}}
				>
					{modeText()}
				</Button>
				<Button
					variant="outlined"
					color={colorEnabled ? "secondary" : "success"}
					onClick={() => {
						setChartOptions({ ...chartOptions, colorEnabled: !colorEnabled })
					}}
				>
					{colorEnabled ? "Color" : "No Color"}
				</Button>
			</ButtonGroup>
		</>
	)
}

export default Controller
