# IMDb Chart

## Search

We expiremented with different search algorithms, and were able to get the best results with Jaro–Winkler distance.
The search results are fetched from postgres using the pg_similarity extension.
The algorithm may be improved in the future by weighting the results by the number of votes.
The architecture may be improved by moving do a dedicated search service like ElasticSearch.

## Data

IMDb provides limited TSV dumps of their data. This data is limited to episode titles, episode ratings, and episode numbers (i.e Season 1, Episode 5).
We supplement this data by directly querying IMDb using the python Cinemagoer library. If the show has ended, we cache the results for six months. If the show is still currently being made, we cache the results for 2 weeks.
