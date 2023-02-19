import gzip
import csv
import getpass
from tqdm import tqdm
from sqlalchemy.engine.base import Engine
from typing import Dict, TypedDict
from constants import (
    RATINGS_FILEPATH,
    EPISODE_FILEPATH,
    BASICS_FILTERED_FILEPATH,
    RATINGS_EST_SIZE,
    EPISODE_EST_SIZE,
    BASICS_FILTERED_EST_SIZE,
)
from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    MetaData,
    Float,
    create_engine,
)


class EpisodeIndexDict(TypedDict):
    parent_tconst: str
    season_number: str
    episode_number: str


class RatingsDict(TypedDict):
    average_rating: float
    num_votes: int


class EpisodeBasicsDict(TypedDict):
    primary_title: str | None
    start_year: int | None
    end_year: int | None


class CompleteDict(TypedDict):
    tconst: str
    parent_tconst: str | None
    season_number: str | None
    episode_number: str | None
    average_rating: float | None
    num_votes: int | None
    primary_title: str | None
    start_year: int | None
    end_year: int | None


def create_ratings_dict() -> Dict[str, RatingsDict]:
    """
    Reads the ratings file and creates a dictionary of tconst to average rating and number of votes
    """
    with gzip.open(RATINGS_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        ratings_dict = {}
        for row in tqdm(reader, total=RATINGS_EST_SIZE):
            tconst = row["tconst"]
            average_rating = float(row["averageRating"])
            num_votes = int(row["numVotes"])

            ratings_dict[tconst] = RatingsDict(
                {
                    "average_rating": average_rating,
                    "num_votes": num_votes,
                }
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
            tconst = row["tconst"]
            parent_tconst = row["parentTconst"]
            season_number = row["seasonNumber"]
            episode_number = row["episodeNumber"]

            if season_number == "\\N" or episode_number == "\\N":
                continue

            episodes_dict[tconst] = EpisodeIndexDict(
                {
                    "parent_tconst": parent_tconst,
                    "season_number": season_number,
                    "episode_number": episode_number,
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
            tconst = row["tconst"]

            if row["titleType"] != "tvEpisode":
                continue

            primary_title = row["primaryTitle"]
            start_year = row["startYear"]
            end_year = row["endYear"]

            start_year = int(start_year) if start_year != "\\N" else None
            end_year = int(end_year) if end_year != "\\N" else None
            primary_title = str(primary_title) if primary_title != "\\N" else None

            basics_dict[tconst] = EpisodeBasicsDict(
                {
                    "primary_title": primary_title,
                    "start_year": start_year,
                    "end_year": end_year,
                }
            )
    return basics_dict


def create_complete_list() -> list[CompleteDict]:
    """
    Reads the ratings, episodes and basics files and creates a dictionary of tconst to all the information
    """
    ratings = create_ratings_dict()
    basics = create_episode_basics_dict()
    index = create_episodes_index_dict()

    complete_list: list[CompleteDict] = []

    for tconst, basics_data in tqdm(basics.items()):
        if tconst not in ratings or tconst not in index:
            continue
        ratings_data = ratings[tconst]
        index_data = index[tconst]

        complete_list.append(
            {
                "tconst": tconst,
                "parent_tconst": index_data["parent_tconst"],
                "season_number": index_data["season_number"],
                "episode_number": index_data["episode_number"],
                "average_rating": ratings_data["average_rating"],
                "num_votes": ratings_data["num_votes"],
                "primary_title": basics_data["primary_title"],
                "start_year": basics_data["start_year"],
                "end_year": basics_data["end_year"],
            }
        )

    return complete_list


def create_table(engine: Engine) -> Table:
    """
    Creates the table in the database if it doesn't exist
    """
    meta = MetaData()
    table = Table(
        "episodes",
        meta,
        Column("tconst", String, primary_key=True),
        Column("parent_tconst", String),
        Column("season_number", String),
        Column("episode_number", String),
        Column("average_rating", Float),
        Column("num_votes", Integer),
        Column("primary_title", String),
        Column("start_year", String),
        Column("end_year", String),
        extend_existing=True,
    )
    meta.create_all(engine)
    return table


def write_to_table(complete_dicts: list[CompleteDict], engine: Engine, table: Table):
    """
    Write all the dictionaries to the table `episodes`
    """
    with engine.connect() as con:
        con.execute(table.insert(), complete_dicts)
        con.commit()


if __name__ == "__main__":
    username = getpass.getuser()
    engine = create_engine(f"postgresql+psycopg2://{username}@localhost/imdb")
    complete_list = create_complete_list()
    table = create_table(engine)
    write_to_table(complete_list, engine, table)
