import { createTheme } from "@mui/material/styles"

export const lightTheme = createTheme({
	palette: {
		mode: "light", // default mode is light
		primary: {
			main: "#0077FF",
		},
		secondary: {
			main: "#FF77AA",
		},
	},
	typography: {
		fontFamily: "Roboto, sans-serif",
		fontSize: 16,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 700,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 0,
					boxShadow: "none",
					fontWeight: "bold",
					textTransform: "none",
				},
			},
		},
	},
})

// override some values for dark mode
export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#00E5FF",
		},
		secondary: {
			main: "#FFAA77",
		},
		background: {
			default: "#1E1E1E",
			paper: "#222",
		},
		text: {
			primary: "#FFF",
			secondary: "#BBB",
		},
	},
})
