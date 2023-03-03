import React from "react"
import { AppBar, Container, Stack, Toolbar, Typography } from "@mui/material"
import { useStore } from "../../hooks/store"
import { getSeriesLabel } from "../../utils"
import BarChartIcon from "@mui/icons-material/BarChart"
import AdvancedSettings from "../AdvancedSettings/AdvancedSettings"

const Header = () => {
	const showInfo = useStore((state) => state.showInfo)

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
					<Stack direction={"row"} spacing={2} alignItems="center" sx={{ flexShrink: 1 }}>
						<AdvancedSettings />
					</Stack>
				</Container>
			</Toolbar>
		</AppBar>
	)
}

export default Header
