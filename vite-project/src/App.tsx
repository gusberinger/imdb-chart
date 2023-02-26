import { useEffect } from "react"
import "./App.css"
import Controller from "./components/SeriesChart/Controller"
import { useStore } from "./hooks/store"
import { get_episodes, get_more_info } from "./api"
import Search from "./components/Search/Search"

function App() {
	const showInfo = useStore((state) => state.showInfo)
	const { tconst } = showInfo

	const setEpisodes = useStore((state) => state.setEpisodes)

	useEffect(() => {
		const fetchAllEpisodeInfo = async () => {
			const episodes = await get_episodes(tconst)
			setEpisodes(episodes)
			// const detailedInfo = await get_more_info(tconst)
			// const episodePlots = detailedInfo.episodes
			// episodePlots.forEach((episode) => {
			// 	console.log(episode)
			// })
		}
		fetchAllEpisodeInfo()
	}, [tconst])

	return (
		<div className="chartContainer">
			<Search />
			<Controller />
		</div>
	)
}

export default App
