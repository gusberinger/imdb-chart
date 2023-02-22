interface EpisodeInfo {
    tconst: string
    parent_tconst: string
    season_number: number
    episode_number: number
    average_rating: number
    num_votes: number
    primary_title: string | null
    start_year: number | null
    end_year: number | null
}


interface SearchTitleInfo {
    tconst: string
    primary_title: string
    start_year: number | null
    end_year: number | null
    num_votes: number
}
