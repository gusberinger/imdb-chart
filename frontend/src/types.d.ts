interface EpisodeInfo {
	tconst: string
	season_number: number
	episode_number: number
	average_rating: number
	num_votes: number
	primary_title: string | null
	start_year: number | null
	end_year: number | null
	description?: string
	air_date?: Date
}

interface SeriesInfo {
	tconst: string
	primary_title: string
	start_year: number | null
	end_year: number | null
	num_votes: number
}

type mode = "line" | "point" | "both"
type theme = "light" | "dark"

interface DetailedSeriesInfo {
	description: string
	episodes: {
		tconst: string
		description: string
		air_date: string
	}[]
}

interface ChartOptions {
	y_axis: "rating" | "votes"
	x_axis: "episode_number" | "air_date"
	mode: mode
	colorEnabled: boolean
	beginAtZero: boolean
	hidePilotEpisodes: boolean
	hideAdult: boolean
	disableHover: boolean
	showSeasonConnectionSegment: boolean
	clickablePoints: boolean
}
