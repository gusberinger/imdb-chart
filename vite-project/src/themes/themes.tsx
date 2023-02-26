import { blue, pink, red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"

export const lightTheme = createTheme({
	palette: {
		primary: blue,
		secondary: pink,
	},
})

export const darkTheme = createTheme({
	palette: {
		primary: red,
		secondary: pink,
	},
})
