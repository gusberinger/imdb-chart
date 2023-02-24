import React from "react"
import SeriesChart from "./SeriesChart"

const Controller = () => {
	return (
		<div>
			<SeriesChart
				parent_tconst="tt0903747"
				options={{
					mode: "rating",
					lineEnabled: true,
					colorEnabled: false,
				}}
			/>
		</div>
	)
}

export default Controller
