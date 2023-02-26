interface EpisodeInfo {
	tconst: string
	season_number: number
	episode_number: number
	average_rating: number | null
	num_votes: numbe | null
	primary_title: string | null
	start_year: number | null
	end_year: number | null
}

interface SeriesInfo {
	tconst: string
	primary_title: string
	start_year: number | null
	end_year: number | null
	num_votes: number
}

type mode = "line" | "point" | "both"

interface DetailedSeriesInfo {
	description: string
	episodes: {
		plot: string
	}[]
}
