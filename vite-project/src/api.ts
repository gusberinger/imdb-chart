import axios from "axios"

export const api = axios.create({
	baseURL: "http://localhost:8000",
})

export const search_title = async (title: string) => {
	const { data } = await api.get<SeriesInfo[]>(`/search/${title}`)
	// console.log(data)
	return data
}

export const get_episodes = async (parent_tconst: string) => {
	const { data } = await api.get<EpisodeInfo[]>(`/episodes/${parent_tconst}`)
	// console.log(data)
	return data
}
