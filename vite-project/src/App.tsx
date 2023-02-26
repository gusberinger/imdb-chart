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
	const setDetailedInfo = useStore((state) => state.setDetailedInfo)

	useEffect(() => {
		const fetchEpisodes = async () => {
			const episodes = await get_episodes(tconst)
			setEpisodes(episodes)
		}
		const fetchDetailedInfo = async () => {
			const detailedInfo = await get_more_info(tconst)
			setDetailedInfo(detailedInfo)
		}
		fetchEpisodes()
		fetchDetailedInfo()
	}, [tconst])

	return (
		<div className="chartContainer">
			<Search />
			<Controller />
		</div>
	)
}

export default App
