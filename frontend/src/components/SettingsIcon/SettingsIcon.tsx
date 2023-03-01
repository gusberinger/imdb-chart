import React, { useState } from "react"
import Gear from "@mui/icons-material/Settings"
import { Box, Icon, Modal } from "@mui/material"
import { Container } from "@mui/system"
import { IconButton } from "@mui/material"

const SettingsIcon = () => {
	const [open, setOpen] = useState(false)

	return (
		<>
			<IconButton onClick={() => setOpen(true)} color="inherit">
				<Gear />
			</IconButton>
			{/* <Gear onClick={() => setOpen(true)} /> */}
			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						border: "2px solid #000",
						boxShadow: 24,
						p: 4,
					}}
				>
					<h1>Settings</h1>
					<p>Coming soon...</p>
				</Box>
			</Modal>
		</>
	)
}

export default SettingsIcon
