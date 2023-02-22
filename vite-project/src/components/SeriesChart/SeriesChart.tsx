import React, { useEffect, useState } from "react"
import { get_episodes } from "../../api"

interface SeriesChartProps {
	parent_tconst: string
	title: string
	start_year: number
	end_year: number
}

const SeriesChart = ({ parent_tconst }: SeriesChartProps) => {
	const [episodes, setepisodes] = useState<EpisodeInfo[]>()

	useEffect(() => {
		const fetchEpisodes = async () => {
			const episodes = await get_episodes(parent_tconst)
			setepisodes(episodes)
		}
		fetchEpisodes()
	}, [parent_tconst])
    



	return <div className="episodes">{JSON.stringify(episodes)}</div>
}

export default SeriesChart
