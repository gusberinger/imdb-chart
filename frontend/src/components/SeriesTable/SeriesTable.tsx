import React from "react"
import { useStore } from "../../hooks/store"
import MaterialTable, {
	MTableAction,
	/*, etc...*/
} from "@material-table/core"

const SeriesTable = () => {
	const episodes = useStore((state) => state.episodes)
	const { primary_title } = useStore((state) => state.showInfo)
	const theme = useStore((state) => state.theme)

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

	return (
		<MaterialTable
			data={episodes}
			columns={columns}
			title={primary_title}
			options={{
				draggable: false,
				rowStyle: {
					fontFamily: "Roboto, sans-serif",
					color: theme === "light" ? "#000" : "#fff",
					backgroundColor: theme === "light" ? "#fff" : "#2d3338",
				},
				headerStyle: {
					fontFamily: "Roboto, sans-serif",
					color: theme === "light" ? "#000" : "#fff",
					backgroundColor: theme === "light" ? "#fff" : "#2d3338",
				},
			}}
		/>
	)
}

export default SeriesTable
