import React from "react"
import { Switch } from "@mui/material"
import { useStore } from "../../hooks/store"

const ThemeChanger = () => {
	const theme = useStore((state) => state.theme)
	const setTheme = useStore((state) => state.setTheme)

	return (
		<div>
			<Switch
				checked={theme === "dark"}
				onChange={(_event, checked) => {
					setTheme(checked ? "dark" : "light")
				}}
			/>
		</div>
	)
}

export default ThemeChanger
