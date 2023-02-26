import { Switch } from "@mui/material"
import React from "react"
import { useStore } from "../../hooks/store"

const ThemeChanger = () => {
	const theme = useStore((state) => state.theme)
	const setTheme = useStore((state) => state.setTheme)

	return (
		<div>
			<Switch
				value={theme}
				onChange={(event, checked) => {
					setTheme(checked ? "dark" : "light")
				}}
			/>
		</div>
	)
}

export default ThemeChanger
