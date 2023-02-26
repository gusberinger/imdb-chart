import { useEffect, useState } from "react"
import "./App.css"
import Controller from "./components/SeriesChart/Controller"
import { useStore } from "./hooks/store"
import { get_episodes, get_more_info } from "./api"
import Search from "./components/Search/Search"
import SeriesChart from "./components/SeriesChart/SeriesChart"
import SeriesTable from "./components/SeriesTable/SeriesTable"
import axios from "axios"

function App() {
	const showInfo = useStore((state) => state.showInfo)
	const { tconst } = showInfo
	const [currentAbortController, setCurrentAbortController] = useState<AbortController>(new AbortController())
	const setEpisodes = useStore((state) => state.setEpisodes)

	useEffect(() => {
		const fetchAllEpisodeInfo = async () => {
			// if (controller.signal.aborted === false) controller.abort()

			currentAbortController.abort()
			const newAbortController = new AbortController()
			setCurrentAbortController(newAbortController)

			try {
				const episodes = await get_episodes(tconst)
				setEpisodes(episodes)
				const detailedInfo = await get_more_info(tconst, newAbortController)
				const episodeInfo = detailedInfo.episodes

				// create map of tconst to episode plot
				const mapping = new Map(episodeInfo.map((episode) => [episode.tconst, episode.description]))

				episodes.forEach((episode) => {
					const tconst = episode.tconst
					const description = mapping.get(tconst)
					if (description == null) return
					episode.description = description
				})
				setEpisodes(episodes)

				console.log(episodes)
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log("Request cancelled")
				} else {
					console.log(error)
					throw error
				}
			}
			// episodePlots.forEach((episode) => {
			// 	console.log(episode)
			// })
		}
		fetchAllEpisodeInfo()
	}, [tconst])

	return (
		<div className="app-container">
			<div className="app-element search">
				<Search />
			</div>
			<Controller />
			<div className="app-element table">
				<SeriesTable />
			</div>
		</div>
	)
}

export default App
