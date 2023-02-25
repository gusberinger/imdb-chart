from pathlib import Path

ROOT_FOLDER = Path(__file__).parent.parent
SCRIPTS_FOLDER = ROOT_FOLDER / "scripts"
DOWNLOADS_FOLDER = SCRIPTS_FOLDER / "downloads"
RATINGS_FILEPATH = DOWNLOADS_FOLDER / "title.ratings.tsv"
BASICS_FILEPATH = DOWNLOADS_FOLDER / "title.basics.tsv"
BASICS_FILTERED_FILEPATH = DOWNLOADS_FOLDER / "title.basics.filtered.tsv"
EPISODE_INDEX_FILEPATH = DOWNLOADS_FOLDER / "title.episode.tsv"
