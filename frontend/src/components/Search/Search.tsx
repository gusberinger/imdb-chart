import { Autocomplete, TextField } from "@mui/material"
import React, { useState } from "react"
import { search_title } from "../../api"
import { useStore } from "../../hooks/store"
import { getSeriesLabel } from "../../utils"

const Search = () => {
	const [searchResults, setSearchResults] = useState<SeriesInfo[]>([])
	const [userInput, setUserInput] = useState("")

	const getSearchResults = async (input: string) => {
		if (input === "") {
			setSearchResults([])
			return
		}
		const results = await search_title(input)
		setSearchResults(results)
	}

	const showInfo = useStore((state) => state.showInfo)
	const setShow = useStore((state) => state.setShow)

	return (
		<Autocomplete
			key={showInfo.tconst}
			autoComplete
			noOptionsText={null}
			fullWidth={true}
			options={searchResults}
			getOptionLabel={(option) => getSeriesLabel(option)}
			filterOptions={(options) => options}
			inputValue={userInput}
			onInputChange={(event, value) => {
				if (event && event.type !== "change") return
				setUserInput(value)
				getSearchResults(value)
			}}
			onChange={(event, value) => {
				if (value == null || event.type !== "click") return
				setShow(value)
				setUserInput("")
				setSearchResults([])
			}}
			renderInput={(params) => <TextField {...params} label="Search" margin="normal" variant="outlined" />}
		/>
	)
}

export default Search
