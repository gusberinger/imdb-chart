export const getSeriesLabel = (seriesInfo: SeriesInfo) => {
	const { primary_title, end_year, start_year } = seriesInfo
	if (start_year == null) {
		return primary_title
	} else if (end_year == null) {
		return `${primary_title} (${start_year}–)`
	} else {
		return `${primary_title} (${start_year}–${end_year})`
	}
}
