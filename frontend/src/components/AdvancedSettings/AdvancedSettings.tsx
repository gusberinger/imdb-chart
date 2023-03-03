import React, { useState } from "react"
import Gear from "@mui/icons-material/Settings"
import { Box, Modal, Stack, Switch, Typography } from "@mui/material"
import { IconButton } from "@mui/material"
import { useStore } from "../../hooks/store"

const AdvancedSettings = () => {
	const [open, setOpen] = useState(false)
	const chartOptions = useStore((state) => state.chartOptions)
	const setChartOptions = useStore((state) => state.setChartOptions)

	return (
		<>
			<IconButton onClick={() => setOpen(true)} color="inherit">
				<Gear />
			</IconButton>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography variant="h4">Advanced Settings</Typography>
					<Stack>
						<Stack direction="row" alignItems="center">
							<Switch
								checked={chartOptions.showSeasonConnectionSegment}
								onChange={(event) => {
									setChartOptions({
										...chartOptions,
										showSeasonConnectionSegment: event.target.checked,
									})
								}}
							/>
							<Typography>Hide Season Connecting Segment</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Switch
								checked={chartOptions.hidePilotEpisodes}
								onChange={(event) => {
									setChartOptions({ ...chartOptions, hidePilotEpisodes: event.target.checked })
								}}
							/>
							<Typography>Hide Unaired Pilot Episodes</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Switch
								checked={chartOptions.beginAtZero}
								onChange={(event) => {
									setChartOptions({ ...chartOptions, beginAtZero: event.target.checked })
								}}
							/>
							<Typography>Fix Ratings Y Axis Between 0 and 10</Typography>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Switch
								checked={chartOptions.disableHover}
								onChange={(event) => {
									setChartOptions({ ...chartOptions, disableHover: event.target.checked })
								}}
							/>
							<Typography>Disable Hover Tooltip</Typography>
						</Stack>
					</Stack>
				</Box>
			</Modal>
		</>
	)
}

export default AdvancedSettings
