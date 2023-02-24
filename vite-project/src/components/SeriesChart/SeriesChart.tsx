import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import { get_episodes } from "../../api"
import Chart from "chart.js/auto"
import { CategoryScale, LinearScale, ScriptableContext } from "chart.js"
import zoomPlugin from "chartjs-plugin-zoom"
import { ZoomPluginOptions } from "chartjs-plugin-zoom/types/options"
import { COLOR_PALLETE, DEFAULT_COLOR } from "../../constants/theme"

Chart.register(CategoryScale)
Chart.register(LinearScale)
Chart.register(zoomPlugin)

interface ChartOptions {
	mode: "rating" | "votes"
	lineEnabled: boolean
	colorEnabled: boolean
	pointsEnabled: boolean
}

interface SeriesChartProps {
	parent_tconst: string
	showTitle: string
	options: ChartOptions
}

const SeriesChart = ({ parent_tconst, options, showTitle }: SeriesChartProps) => {
	const [episodes, setEpisodes] = useState<EpisodeInfo[]>([])

	useEffect(() => {
		const fetchEpisodes = async () => {
			const episodes = await get_episodes(parent_tconst)
			setEpisodes(episodes)
		}
		fetchEpisodes()
	}, [parent_tconst])

	if (episodes.length === 0) return <div className="loading-screen">Loading...</div>

	const labels = episodes.map((_episode, idx) => idx)
	const ratings = episodes.map((episode) => episode.average_rating)
	const votes = episodes.map((episode) => episode.num_votes)
	const titles = episodes.map((episode) => (episode.primary_title ? episode.primary_title : "[No Title]"))

	const getColorFromCtx = (ctx: ScriptableContext<"line">) => {
		const index = ctx.dataIndex
		const episode = episodes[index]
		const value = episode.season_number
		const color = COLOR_PALLETE[value % COLOR_PALLETE.length]
		return options.colorEnabled ? color : DEFAULT_COLOR
	}

	return (
		<div className="chart-container">
			<Line
				data={{
					labels: labels,
					datasets: [
						{
							label: "Episode Rating",
							data: options.mode === "rating" ? ratings : votes,
							pointBackgroundColor: (ctx) => getColorFromCtx(ctx),
							borderWidth: options.lineEnabled ? 3 : 0,
							pointBorderWidth: 0,
							pointHitRadius: 20,
							pointHoverRadius: options.pointsEnabled ? 6 : 1,
							pointRadius: options.pointsEnabled ? 4 : 0,
							borderCapStyle: "square",
							tension: 0.1,
						},
					],
				}}
				options={{
					responsive: true,
					animation: { duration: 5 },
					maintainAspectRatio: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},
					plugins: {
						legend: {
							display: false,
						},
						title: {
							display: true,
							text:
								options.mode === "rating"
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
									const imdbURL = `https://www.imdb.com/title/${episode.tconst}`
									const message = `Season ${episode.season_number} Episode ${episode.episode_number}\n<a href="${imdbURL}" target="_blank">IMDB</a>`
									return message
								},
							},
						},
					},
				}}
			/>
		</div>
	)
	// return <div className="episodes">{JSON.stringify(episodes)}</div>
}

export default SeriesChart
