import { useReactTable } from "@tanstack/react-table"
import React from "react"
import { useStore } from "../../hooks/store"

const SeriesTable = () => {
	const episodes = useStore((state) => state.episodes)
}

export default SeriesTable
