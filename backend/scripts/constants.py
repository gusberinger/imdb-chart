from pathlib import Path


DOWNLOADS_FOLDER = Path(__file__).parent / "downloads"
RATINGS_FILEPATH = DOWNLOADS_FOLDER / "title.ratings.tsv.gz"
BASICS_FILEPATH = DOWNLOADS_FOLDER / "title.basics.tsv.gz"
BASICS_FILTERED_FILEPATH = DOWNLOADS_FOLDER / "title.basics.filtered.tsv.gz"
EPISODE_FILEPATH = DOWNLOADS_FOLDER / "title.episode.tsv.gz"

# The line count of the files as of 2023-02-18
RATINGS_EST_SIZE = 1280583
EPISODE_EST_SIZE = 7291989
BASICS_EST_SIZE = 9624114
BASICS_FILTERED_EST_SIZE = 7531134