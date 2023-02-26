import React from "react"
import { Line } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale, LinearScale, ScriptableContext } from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom"
import { ZoomPluginOptions } from "chartjs-plugin-zoom/types/options"
import { COLOR_PALLETE, DEFAULT_COLOR } from "../../constants/theme"
import { useStore } from "../../hooks/store"

Chart.register(CategoryScale)
Chart.register(LinearScale)
Chart.register(zoomPlugin)

interface SeriesChartProps {
	options: ChartOptions
}

function breakStringByWidth(str: string, max_width: number) {
	const words = str.split(" ")
	const lines = []
	let currentLine = ""

	for (let i = 0; i < words.length; i++) {
		const word = words[i]

		if (currentLine.length + word.length <= max_width) {
			currentLine += word + " "
		} else {
			lines.push(currentLine.trim())
			currentLine = word + " "
		}
	}

	if (currentLine) {
		lines.push(currentLine.trim())
	}

	return lines
}

const SeriesChart = () => {
	const options = useStore((state) => state.chartOptions)
	const isLoadingDetails = useStore((state) => state.isLoadingDetails)
	const episodes = useStore((state) => state.episodes)
	const showTitle = useStore((state) => state.showInfo.primary_title)
	// const showDetailedInfo = useStore((state) => state.detailedInfo)

	if (episodes.length === 0) return <div className="loading-screen">Loading...</div>

	const dates = isLoadingDetails ? null : episodes.map((episode) => episode.air_date)
	const labels = episodes.map((_episode, idx) => idx)
	const ratings = episodes.map((episode) => episode.average_rating)
	const votes = episodes.map((episode) => episode.num_votes)

	const getColorFromCtx = (ctx: ScriptableContext<"line">) => {
		const index = ctx.dataIndex
		const episode = episodes[index]
		const value = episode.season_number
		const color = COLOR_PALLETE[value % COLOR_PALLETE.length]
		return options.colorEnabled ? color : DEFAULT_COLOR
	}

	const lineEnabled = options.mode === "line" || options.mode === "both"
	const pointsEnabled = options.mode === "point" || options.mode === "both"

	return (
		<div className="chart-container">
			<Line
				// width={1000}
				// height={500}
				data={{
					labels: labels,
					datasets: [
						{
							label: "Episode Rating",
							data: options.y_axis === "rating" ? ratings : votes,
							pointBackgroundColor: (ctx) => getColorFromCtx(ctx),
							borderWidth: lineEnabled ? 3 : 0,
							pointBorderWidth: 0,
							pointHitRadius: 20,
							pointHoverRadius: pointsEnabled ? 6 : 1,
							pointRadius: pointsEnabled ? 4 : 0,
							borderCapStyle: "square",
							tension: 0.1,
						},
					],
				}}
				options={{
					responsive: true,
					animation: { duration: 5 },
					// maintainAspectRatio: true,
					scales: {
						y: {
							beginAtZero: options.beginAtZero,
						},
					},
					plugins: {
						legend: {
							display: false,
						},
						title: {
							display: true,
							text:
								options.y_axis === "rating"
									? `${showTitle} - Episode Ratings`
									: `${showTitle} - Episode Votes`,
						},
						zoom: {
							wheel: { enabled: true },
							pinch: { enabled: true },
							mode: "xy",
						} as ZoomPluginOptions,
						tooltip: {
							callbacks: {
								label: (ctx) => {
									const index = ctx.dataIndex
									const episode = episodes[index]
									const value = episode.primary_title
									return value == null ? "[No Title]" : value
								},
								afterBody: (tooltipInfo) => {
									const index = tooltipInfo[0].dataIndex
									const episode = episodes[index]
									let message = `Season ${episode.season_number} Episode ${episode.episode_number}`
									if (episode.air_date) {
										// day/month/year
										const airDateString = episode.air_date.toLocaleString("en-GB", {
											day: "numeric",
											month: "numeric",
											year: "numeric",
										})
										message += `\nAired ${airDateString}`
									}
									if (episode.description) {
										const lines = breakStringByWidth(episode.description, 50)
										const descriptionString = lines.join("\n")
										message += `\n${descriptionString}`
									}
									return message
								},
								title: () => "",
							},
							borderWidth: 20,
						},
					},
				}}
			/>
		</div>
	)
}

export default SeriesChart
