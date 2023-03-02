import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL

export const api = axios.create({
	baseURL: baseURL,
})

export const search_title = async (title: string, controller: AbortController) => {
	const { data } = await api.get<SeriesInfo[]>(`/search/${title}`, { signal: controller.signal })
	return data
}

export const get_episodes = async (parent_tconst: string) => {
	const { data } = await api.get<EpisodeInfo[]>(`/episodes/${parent_tconst}`)
	return data
}

export const get_more_info = async (parent_tconst: string, controller: AbortController) => {
	const { data } = await api.get<DetailedSeriesInfo>(`/detailed_info/${parent_tconst}`, { signal: controller.signal })
	return data
}
