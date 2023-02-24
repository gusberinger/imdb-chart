import React from "react"
import { Autocomplete, TextField } from "@mui/material"

const Search = () => {
	return (
		<Autocomplete
			disablePortal
			options={[
				{
					label: "The Godfather",
					value: "tt0068646",
				},
			]}
			renderInput={(params) => <TextField {...params} label="Movie" />}
		/>
	)
}

export default Search
