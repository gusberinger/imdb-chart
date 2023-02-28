import { useEffect, useState } from "react"
import "./App.css"
import Controller from "./components/SeriesChart/Controller"
import { useStore } from "./hooks/store"
import { get_episodes, get_more_info } from "./api"
import Search from "./components/Search/Search"
import SeriesTable from "./components/SeriesTable/SeriesTable"
import axios from "axios"
import { GlobalStyles, ThemeProvider } from "@mui/material"

import { lightTheme, darkTheme } from "./themes/themes"
import ThemeChanger from "./components/ThemeChanger/ThemeChanger"
import SeriesChart from "./components/SeriesChart/SeriesChart"

function App() {
	const showInfo = useStore((state) => state.showInfo)
	const { tconst } = showInfo
	const [currentAbortController, setCurrentAbortController] = useState<AbortController>(new AbortController())
	const setEpisodes = useStore((state) => state.setEpisodes)
	const setIsLoadingDetails = useStore((state) => state.setIsLoadingDetails)
	const theme = useStore((state) => state.theme) === "light" ? lightTheme : darkTheme

	useEffect(() => {
		const fetchAllEpisodeInfo = async () => {
			// Use a new abort controller for each request
			// This is to prevent the episode description request
			// from overwriting the episode info request
			currentAbortController.abort()
			const newAbortController = new AbortController()
			setCurrentAbortController(newAbortController)

			try {
				const episodes = await get_episodes(tconst)
				setEpisodes(episodes)
				setIsLoadingDetails(true)
				const detailedInfo = await get_more_info(tconst, newAbortController)
				const episodeInfo = detailedInfo.episodes
				const mapping = new Map(episodeInfo.map((episode) => [episode.tconst, episode]))
				episodes.forEach((episode) => {
					const tconst = episode.tconst
					const info = mapping.get(tconst)
					const description = info?.description
					const airdateString = info?.air_date
					if (description) episode.description = description
					if (airdateString) {
						const airdate = new Date(Date.parse(airdateString.replace(/\./g, "")))
						episode.air_date = airdate
					}
				})
				setEpisodes(episodes)
				setIsLoadingDetails(false)
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log("Request cancelled")
				} else {
					console.error(error)
					throw error
				}
			}
		}
		fetchAllEpisodeInfo()
	}, [tconst])

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles
				styles={{
					body: {
						backgroundColor: theme.palette.background.default,
					},
				}}
			/>
			<div className="app-container">
				<ThemeChanger />
				<div className="app-element search">
					<Search />
				</div>
				<Controller />
				<div className="app-element chart">
					<SeriesChart />
				</div>
				<div className="app-element table">
					<SeriesTable />
				</div>
			</div>
		</ThemeProvider>
	)
}

export default App
