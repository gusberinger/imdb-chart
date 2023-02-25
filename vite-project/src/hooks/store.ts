import { create } from "zustand"
import breakingBad from "../assets/json/breakingbad.json"

interface SeriesStore {
	showInfo: SeriesInfo
	episodes: EpisodeInfo[]
	setEpisodes: (episodes: EpisodeInfo[]) => void
	setShow: (show: SeriesInfo) => void
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
}

export const useStore = create<SeriesStore>((set, get) => ({
	...initialState,
	setShow: (show: SeriesInfo) => {
		set({ showInfo: show })
	},
	getShow: get().showInfo,
	setEpisodes: (episodes: EpisodeInfo[]) => {
		set({ episodes: episodes })
	},
	getEpisodes: get().episodes,
}))
