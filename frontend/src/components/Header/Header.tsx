import { AppBar, Toolbar, Typography } from "@mui/material"
import React from "react"
import { useStore } from "../../hooks/store"
import ThemeChanger from "../ThemeChanger/ThemeChanger"

const Header = () => {
	const showInfo = useStore((state) => state.showInfo)

	return (
		<AppBar position="static" color="primary" enableColorOnDark>
			<Toolbar variant="dense">
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					IMDb Charts
				</Typography>
				{/* <Typography>
                    
                </Typography> */}

				<ThemeChanger />
			</Toolbar>
		</AppBar>
	)
}

export default Header
