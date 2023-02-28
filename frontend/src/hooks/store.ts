import { create } from "zustand"
import breakingBad from "../assets/json/breakingbad.json"

interface SeriesStore {
	showInfo: SeriesInfo
	episodes: EpisodeInfo[]
	setEpisodes: (episodes: EpisodeInfo[]) => void
	setShow: (show: SeriesInfo) => void
	isLoadingDetails: boolean
	setIsLoadingDetails: (isLoadingDetails: boolean) => void
	chartOptions: ChartOptions
	setChartOptions: (chartOptions: ChartOptions) => void
	theme: theme
	setTheme: (theme: theme) => void
}

const initialState = {
	showInfo: {
		tconst: "tt0903747",
		primary_title: "Breaking Bad",
		start_year: 2008,
		end_year: 2013,
		num_votes: 1900000,
	} as SeriesInfo,
	episodes: breakingBad as EpisodeInfo[],
	isLoadingDetails: false,
	chartOptions: {
		x_axis: "episode_number",
		y_axis: "rating",
		mode: "line",
		colorEnabled: true,
		beginAtZero: false,
	} as ChartOptions,
	theme: "light" as theme,
}

const localShowInfo = localStorage.getItem("showInfo")
if (localShowInfo) {
	initialState.showInfo = JSON.parse(localShowInfo) as SeriesInfo
}

const localChartOptions = localStorage.getItem("chartOptions")
if (localChartOptions) {
	initialState.chartOptions = JSON.parse(localChartOptions) as ChartOptions
}

const localTheme = localStorage.getItem("theme")
if (localTheme) {
	initialState.theme = localTheme as theme
}

export const useStore = create<SeriesStore>((set) => ({
	...initialState,
	setShow: (show: SeriesInfo) => {
		set({ showInfo: show })
		localStorage.setItem("showInfo", JSON.stringify(show))
	},
	setEpisodes: (episodes: EpisodeInfo[]) => {
		set({ episodes: episodes })
	},
	setIsLoadingDetails: (isLoadingDetails: boolean) => {
		set({ isLoadingDetails: isLoadingDetails })
	},
	setChartOptions: (chartOptions: ChartOptions) => {
		set({ chartOptions: chartOptions })
		localStorage.setItem("chartOptions", JSON.stringify(chartOptions))
	},
	setTheme: (theme: theme) => {
		set({ theme: theme })
		localStorage.setItem("theme", theme)
	},
}))
