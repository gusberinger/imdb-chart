import { Autocomplete, TextField } from "@mui/material"
import React, { useState } from "react"
import { search_title } from "../../api"
import { useStore } from "../../hooks/store"
import { getSeriesLabel } from "../../utils"

const Search = () => {
	const [searchResults, setSearchResults] = useState<SeriesInfo[]>([])
	const [userInput, setUserInput] = useState("")
	const [currentAbortController, setCurrentAbortController] = useState<AbortController>(new AbortController())
	const [timeSinceLastCall, setTimeSinceLastCall] = useState(5000)

	const getSearchResults = async (input: string) => {
		if (input === "") {
			setSearchResults([])
			return
		}

		currentAbortController.abort()
		const newAbortController = new AbortController()
		setCurrentAbortController(newAbortController)
		const results = await search_title(input, newAbortController)
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
				// when user types
				if (event && event.type !== "change") return
				setUserInput(value)
				getSearchResults(value)
			}}
			onChange={(event, value) => {
				// when show selected
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
