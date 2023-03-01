import { AppBar, CircularProgress, Container, Stack, Toolbar, Typography } from "@mui/material"
import React from "react"
import { useStore } from "../../hooks/store"
import { getSeriesLabel } from "../../utils"
import ThemeChanger from "../ThemeChanger/ThemeChanger"
import BarChartIcon from "@mui/icons-material/BarChart"

const Header = () => {
	const showInfo = useStore((state) => state.showInfo)
	const isLoadingDetails = useStore((state) => state.isLoadingDetails)

	return (
		<AppBar position="static" color="primary" enableColorOnDark>
			<Toolbar>
				<Container
					sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 100000 }}
				>
					<Stack direction="row" spacing={1}>
						<BarChartIcon />
						<Typography variant="h6" component="div" sx={{}}>
							IMDb Charts
						</Typography>
					</Stack>
					<Typography variant="h6">{getSeriesLabel(showInfo)}</Typography>
					<Stack direction={"row"} spacing={2}>
						<ThemeChanger />
						{isLoadingDetails ? <CircularProgress color="secondary" /> : null}
					</Stack>
				</Container>
			</Toolbar>
		</AppBar>
	)
}

export default Header
