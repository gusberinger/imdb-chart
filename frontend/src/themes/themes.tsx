import { createTheme } from "@mui/material/styles"

export const lightTheme = createTheme({
	palette: {
		background: {
			default: "#fff",
		},
	},
})

export const darkTheme = createTheme({
	palette: {
		primary: {
			main: "#2d3338",
		},
		background: {
			default: "#2d3338",
		},
	},
})
