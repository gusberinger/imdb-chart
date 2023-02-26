import { create } from "zustand"
import breakingBad from "../assets/json/breakingbad.json"

interface SeriesStore {
	showInfo: SeriesInfo
	episodes: EpisodeInfo[]
	setEpisodes: (episodes: EpisodeInfo[]) => void
	setShow: (show: SeriesInfo) => void
	detailedInfo: DetailedSeriesInfo | null
	setDetailedInfo: (detailedInfo: DetailedSeriesInfo) => void
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
	detailedInfo: null as DetailedSeriesInfo | null,
}

const local = localStorage.getItem("showInfo")
if (local) {
	initialState.showInfo = JSON.parse(local) as SeriesInfo
}

export const useStore = create<SeriesStore>((set, get) => ({
	...initialState,
	setShow: (show: SeriesInfo) => {
		set({ showInfo: show })
		localStorage.setItem("showInfo", JSON.stringify(show))
	},
	setEpisodes: (episodes: EpisodeInfo[]) => {
		set({ episodes: episodes })
	},
	setDetailedInfo: (detailedInfo: DetailedSeriesInfo) => {
		set({ detailedInfo: detailedInfo })
	},
}))
