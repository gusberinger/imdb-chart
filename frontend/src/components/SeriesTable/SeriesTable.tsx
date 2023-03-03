import React, { useState } from "react"
import { useStore } from "../../hooks/store"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { TablePagination, TableSortLabel } from "@mui/material"

// type TableHeaderPick = Pick<EpisodeInfo, "primary_title" | "air_date" | "average_rating" | "num_votes">
// interface TableHeader extends TableHeaderPick {
// 	cum_episode_number: number
// }

interface EpisodeInfoExtended extends EpisodeInfo {
	cum_episode_number: number
}

type rowsPerPageOptions = 10 | 50 | -1

const SeriesTable = () => {
	const episodes = useStore((state) => state.episodes)
	const [sortBy, setSortBy] = useState<keyof EpisodeInfoExtended>("average_rating")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
	const [page, setPage] = useState<number>(0)
	const [rowsPerPage, setRowsPerPage] = useState<rowsPerPageOptions>(10)

	const sortEpisodes = (): EpisodeInfo[] => {
		const sortedEpisodes = [...episodes] as EpisodeInfoExtended[]
		sortedEpisodes.forEach((episode, idx) => {
			episode.cum_episode_number = idx + 1
		})

		if (sortBy === "cum_episode_number") {
			if (sortOrder === "asc") {
				return episodes
			} else {
				return episodes.reverse()
			}
		}

		sortedEpisodes.sort((a, b) => {
			const aVal = a[sortBy]
			const bVal = b[sortBy]

			if (aVal == null || bVal == null) {
				return 0
			}

			if (aVal < bVal) {
				return sortOrder === "asc" ? -1 : 1
			} else if (aVal > bVal) {
				return sortOrder === "asc" ? 1 : -1
			} else {
				return 0
			}
		})

		return sortedEpisodes
	}

	const sortedEpisodes = sortEpisodes()

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
				<TableHead>
					<TableRow>
						<TableCell>Episode Title</TableCell>
						<TableCell align="right">
							<TableSortLabel active={sortBy === "cum_episode_number"} direction={sortOrder}>
								Episode #
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel active={sortBy === "primary_title"} direction={sortOrder}>
								Designation
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel active={sortBy === "average_rating"} direction={sortOrder}>
								Rating
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel active={sortBy === "num_votes"} direction={sortOrder}>
								Votes
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel active={sortBy === "air_date"} direction={sortOrder}>
								Air Date
							</TableSortLabel>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedEpisodes.map((episode, idx) => {
						const designation = `S${episode.season_number}E${episode.episode_number}`
						return (
							<TableRow key={episode.tconst} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<TableCell component="th" scope="row">
									{episode.primary_title}
								</TableCell>
								<TableCell align="right">{idx + 1}</TableCell>
								<TableCell align="right">{designation}</TableCell>
								<TableCell align="right">{episode.air_date?.toLocaleDateString()}</TableCell>
								<TableCell align="right">{episode.average_rating}</TableCell>
								<TableCell align="right">{episode.num_votes}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
			{/* <TablePagination rowsPerPageOptions={[10, 50, { value: -1, label: "All" }]} /> */}
		</TableContainer>
	)
}

export default SeriesTable
