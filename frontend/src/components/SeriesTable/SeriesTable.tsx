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

interface EpisodeInfoExtended extends EpisodeInfo {
	cum_episode_number: number
}

type rowsPerPageOptions = 10 | 50 | -1

const SeriesTable = () => {
	const isLoadingDetails = useStore((state) => state.isLoadingDetails)
	const episodes = useStore((state) => state.episodes)
	const [sortBy, setSortBy] = useState<keyof EpisodeInfoExtended>("average_rating")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
	const [page, setPage] = useState<number>(0)
	const [rowsPerPage, setRowsPerPage] = useState<rowsPerPageOptions>(10)

	const handleHeaderClick = (property: keyof EpisodeInfoExtended) => {
		if (sortBy === property) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc")
		}
		setSortBy(property)
		setPage(0)
	}

	const sortEpisodes = (): EpisodeInfoExtended[] => {
		const sortedEpisodes = [...episodes] as EpisodeInfoExtended[]
		sortedEpisodes.forEach((episode, idx) => {
			episode.cum_episode_number = idx + 1
		})

		if (sortBy === "cum_episode_number") {
			if (sortOrder === "asc") {
				return sortedEpisodes
			} else {
				sortedEpisodes.reverse()
				return sortedEpisodes
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
	const filteredEpisodes = sortedEpisodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 500 }} aria-label="simple table" size="small">
				<TableHead>
					<TableRow>
						<TableCell>Episode Title</TableCell>
						<TableCell align="right">
							<TableSortLabel
								active={sortBy === "cum_episode_number"}
								direction={sortOrder}
								onClick={() => handleHeaderClick("cum_episode_number")}
							>
								Episode #
							</TableSortLabel>
						</TableCell>

						<TableCell align="right">
							<TableSortLabel
								active={sortBy === "average_rating"}
								direction={sortOrder}
								onClick={() => handleHeaderClick("average_rating")}
							>
								Rating
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel
								active={sortBy === "num_votes"}
								direction={sortOrder}
								onClick={() => handleHeaderClick("num_votes")}
							>
								Votes
							</TableSortLabel>
						</TableCell>
						<TableCell align="right">
							<TableSortLabel
								active={sortBy === "air_date"}
								direction={sortOrder}
								onClick={() => handleHeaderClick("air_date")}
							>
								{!isLoadingDetails ? "Air Date" : "Air Date (Loading)"}
							</TableSortLabel>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{filteredEpisodes.map((episode) => {
						const designation = `S${episode.season_number}E${episode.episode_number}`
						return (
							<TableRow key={episode.tconst} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<TableCell component="th" scope="row">
									{episode.primary_title} ({designation})
								</TableCell>
								<TableCell align="right">{episode.cum_episode_number}</TableCell>
								<TableCell align="right">{episode.average_rating}</TableCell>
								<TableCell align="right">{episode.num_votes.toLocaleString()}</TableCell>
								<TableCell align="right">{episode.air_date?.toLocaleDateString()}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
			<TablePagination
				component="div"
				page={page}
				rowsPerPage={rowsPerPage}
				count={sortedEpisodes.length}
				onPageChange={(_event, newPage) => {
					setPage(newPage)
				}}
				onRowsPerPageChange={(event) => {
					setRowsPerPage(parseInt(event.target.value, 10) as rowsPerPageOptions)
				}}
			/>
		</TableContainer>
	)
}

export default SeriesTable
