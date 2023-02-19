from pathlib import Path
import gzip
import csv
from tqdm import tqdm
from constants import (
    RATINGS_FILEPATH,
    EPISODE_FILEPATH,
    BASICS_FILTERED_FILEPATH,
    RATINGS_EST_SIZE,
    EPISODE_EST_SIZE,
    BASICS_FILTERED_EST_SIZE,
)


from typing import Dict, TypedDict


class EpisodeIndexDict(TypedDict):
    parent_tconst: str
    season_number: str
    episode_number: str


class RatingsDict(TypedDict):
    average_rating: str
    num_votes: str


class EpisodeBasicsDict(TypedDict):
    primary_title: str
    start_year: str
    end_year: str


class CompleteDict(TypedDict):
    parent_tconst: str
    season_number: str
    episode_number: str
    average_rating: str
    num_votes: str
    primary_title: str
    start_year: str
    end_year: str


def create_ratings_dict() -> Dict[str, RatingsDict]:
    """
    Reads the ratings file and creates a dictionary of tconst to average rating and number of votes
    """
    with gzip.open(RATINGS_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        ratings_dict = {}
        for row in tqdm(reader, total=RATINGS_EST_SIZE):
            ratings_dict[row["tconst"]] = RatingsDict(
                {"average_rating": row["averageRating"], "num_votes": row["numVotes"]}
            )
    return ratings_dict


def create_episodes_index_dict() -> Dict[str, EpisodeIndexDict]:
    """
    Reads the episodes file and creates a dictionary of tconst to parent tconst, season number, episode number
    """
    with gzip.open(EPISODE_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        episodes_dict = {}
        for row in tqdm(reader, total=EPISODE_EST_SIZE):
            episodes_dict[row["tconst"]] = EpisodeIndexDict(
                {
                    "parent_tconst": row["parentTconst"],
                    "season_number": row["seasonNumber"],
                    "episode_number": row["episodeNumber"],
                }
            )
    return episodes_dict


def create_episode_basics_dict() -> Dict[str, EpisodeBasicsDict]:
    """
    Reads the basics file and creates a dictionary of tconst to primary title, start year, end year
    """
    with gzip.open(BASICS_FILTERED_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        basics_dict = {}
        for row in tqdm(
            reader,
            total=BASICS_FILTERED_EST_SIZE,
        ):
            if row["titleType"] != "tvEpisode":
                continue
            basics_dict[row["tconst"]] = EpisodeBasicsDict(
                {
                    "primary_title": row["primaryTitle"],
                    "start_year": row["startYear"],
                    "end_year": row["endYear"],
                }
            )
    return basics_dict


def create_complete_dict() -> Dict[str, CompleteDict]:
    """
    Reads the ratings, episodes and basics files and creates a dictionary of tconst to all the information
    """
    ratings = create_ratings_dict()
    basics = create_episode_basics_dict()
    index = create_episodes_index_dict()

    complete_dict = CompleteDict(ratings | basics | index)
    return complete_dict



if __name__ == "__main__":
    complete_dict = create_complete_dict()
    
