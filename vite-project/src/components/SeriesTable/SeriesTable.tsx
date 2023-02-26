import React from "react"
import { useStore } from "../../hooks/store"
import MaterialTable, {
	MTableAction,
	/*, etc...*/
} from "@material-table/core"

const SeriesTable = () => {
	const episodes = useStore((state) => state.episodes)
	const { primary_title } = useStore((state) => state.showInfo)

	const columns = [
		{ title: "Title", field: "primary_title" },
		// { title: "Season", field: "season_number" },
		// { title: "Episode", field: "episode_number" },
		{ title: "Rating", field: "average_rating", sortDescFirst: true },
		{
			title: "Votes",
			field: "num_votes",
			render: (row: EpisodeInfo) => {
				return row.num_votes.toLocaleString()
			},
			sortingFn: "number",
			sortDescFirst: true,
			sortUndefined: 1,
		},
	]

	return <MaterialTable data={episodes} columns={columns} title={primary_title} />
}

export default SeriesTable
