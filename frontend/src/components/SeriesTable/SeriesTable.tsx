import React from "react"
import { useStore } from "../../hooks/store"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

const SeriesTable = () => {
	const episodes = useStore((state) => state.episodes)

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
				<TableHead>
					<TableRow>
						<TableCell>Episode Title</TableCell>
						<TableCell align="right">Episode #</TableCell>
						<TableCell align="right">Designation</TableCell>
						<TableCell align="right">Air Date</TableCell>
						<TableCell align="right">Rating</TableCell>
						<TableCell align="right">Votes</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{episodes.map((episode, idx) => {
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
		</TableContainer>
	)
}

export default SeriesTable
