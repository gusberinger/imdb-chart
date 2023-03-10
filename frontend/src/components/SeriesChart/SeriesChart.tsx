import React from "react"
import { Line } from "react-chartjs-2"
import Chart from "chart.js/auto"
import { CategoryScale, LinearScale, ScriptableContext, TimeScale } from "chart.js"
import { COLOR_PALLETE, DEFAULT_COLOR } from "../../constants/theme"
import { useStore } from "../../hooks/store"
import "chartjs-adapter-date-fns"
import { enUS } from "date-fns/locale"

Chart.register(CategoryScale)
Chart.register(LinearScale)
Chart.register(TimeScale)

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
	const episodes = useStore((state) => state.episodes)
	const isLoadingDetails = useStore((state) => state.isLoadingDetails)

	// What we really display on the x axis
	// If we are still loading details display episode number in the meantime
	const realXAxis = options.x_axis === "air_date" && !isLoadingDetails ? "air_date" : "episode_number"

	const filteredEpisodes = episodes.filter(
		(episode) => !(options.hidePilotEpisodes && episode.episode_number === 0 && episode.season_number === 1)
	)

	if (filteredEpisodes.length === 0) return <div className="loading-screen">Loading...</div>

	const episodeNumberLabels = filteredEpisodes.map((_episode, idx) => idx)
	const airDateLabels = filteredEpisodes.map((episode) => episode.air_date) as Date[]
	const ratings = filteredEpisodes.map((episode) => episode.average_rating)
	const votes = filteredEpisodes.map((episode) => episode.num_votes)

	const getColorFromCtx = (ctx: ScriptableContext<"line">) => {
		const index = ctx.dataIndex
		const episode = filteredEpisodes[index]
		const value = episode.season_number
		const color = COLOR_PALLETE[value % COLOR_PALLETE.length]
		return options.colorEnabled ? color : DEFAULT_COLOR
	}

	const lineEnabled = options.mode === "line" || options.mode === "both"
	const pointsEnabled = options.mode === "point" || options.mode === "both"

	if (isLoadingDetails) {
		console.info("labels", filteredEpisodes)
	}

	const labels = realXAxis === "air_date" ? airDateLabels : episodeNumberLabels

	return (
		<div className="chart-container">
			<Line
				width={1000}
				height={500}
				data={{
					// Typescript is weird about this.
					labels: labels as number[],
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
							segment: {
								borderColor: (ctx) => {
									if (!options.colorEnabled) {
										return DEFAULT_COLOR
									}
									const idx = ctx.p0DataIndex
									const episode = filteredEpisodes[idx]

									if (options.showSeasonConnectionSegment) {
										const nextEpisode = filteredEpisodes[idx + 1]
										if (nextEpisode.season_number !== episode.season_number) {
											return "rgba(0,0,0,0)"
										}
									}
									const season = episode.season_number
									const color = COLOR_PALLETE[season % COLOR_PALLETE.length]
									return color
								},
							},
						},
					],
				}}
				options={{
					responsive: true,
					animation: { duration: 5 },
					maintainAspectRatio: false,
					scales: {
						y: {
							max: options.y_axis === "rating" ? 10 : undefined,
							beginAtZero: options.beginAtZero,
						},
						x:
							realXAxis === "air_date"
								? {
										type: "time",
										adapters: {
											date: {
												locale: enUS,
											},
										},
										time: {
											unit: "month",
											displayFormats: {
												quarter: "MMM YYYY",
											},
										},
										// eslint-disable-next-line no-mixed-spaces-and-tabs
								  }
								: {
										// type: "linear",
										// eslint-disable-next-line no-mixed-spaces-and-tabs
								  },
					},
					plugins: {
						legend: {
							display: false,
						},
						title: {
							display: true,
							text: options.y_axis === "rating" ? `Episode Ratings` : `Episode Votes`,
						},
						tooltip: {
							enabled: !options.disableChartHover,
							callbacks: {
								label: (ctx) => {
									const index = ctx.dataIndex
									const episode = filteredEpisodes[index]
									const value = episode.primary_title
									return value == null ? "[No Title]" : value
								},
								afterBody: (tooltipInfo) => {
									const index = tooltipInfo[0].dataIndex
									const episode = filteredEpisodes[index]
									let message = `Season ${episode.season_number} Episode ${episode.episode_number}`
									message += `\n${episode.average_rating}/10`
									message += `\n${episode.num_votes} votes`
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
