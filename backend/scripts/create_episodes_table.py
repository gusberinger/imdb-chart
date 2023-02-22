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
    season_number: int
    episode_number: int


class RatingsDict(TypedDict):
    average_rating: float
    num_votes: int


class EpisodeBasicsDict(TypedDict):
    primary_title: str | None
    title_type: str
    start_year: int | None
    end_year: int | None


class EpisodesTableDict(TypedDict):
    tconst: str
    parent_tconst: str | None
    season_number: int
    episode_number: int
    average_rating: float
    num_votes: int
    primary_title: str | None
    start_year: int | None
    end_year: int | None


class SearchTableDict(TypedDict):
    tconst: str
    primary_title: str | None
    num_votes: int
    average_rating: float
    start_year: int | None
    end_year: int | None
    num_votes: int | None


def read_ratings_file() -> Dict[str, RatingsDict]:
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


def read_index_file() -> Dict[str, EpisodeIndexDict]:
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


def read_basics_file() -> Dict[str, EpisodeBasicsDict]:
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

            title_type = row["titleType"]

            basics_dict[tconst] = EpisodeBasicsDict(
                {
                    "primary_title": primary_title,
                    "title_type": title_type,
                    "start_year": start_year,
                    "end_year": end_year,
                }
            )
    return basics_dict


def create_episode_list() -> list[EpisodesTableDict]:
    """
    Reads the ratings, episodes and basics files and creates a dictionary of tconst to all the information
    """
    ratings = read_ratings_file()
    basics = read_basics_file()
    index = read_index_file()

    complete_list: list[EpisodesTableDict] = []

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


def create_search_list() -> list[SearchTableDict]:
    """
    Reads the ratings, episodes and basics files and creates a dictionary of tconst to all the information
    """
    ratings = read_ratings_file()
    basics = read_basics_file()

    complete_list: list[SearchTableDict] = []

    for tconst, basics_data in tqdm(basics.items()):
        if tconst not in ratings:
            continue
        ratings_data = ratings[tconst]

        complete_list.append(
            {
                "tconst": tconst,
                "primary_title": basics_data["primary_title"],
                "start_year": basics_data["start_year"],
                "end_year": basics_data["end_year"],
                "average_rating": ratings_data["average_rating"],
                "num_votes": ratings_data["num_votes"],
            }
        )

    return complete_list


def create_episodes_table(engine: Engine) -> Table:
    """
    Creates the table in the database if it doesn't exist
    """
    meta = MetaData()
    table = Table(
        "episodes",
        meta,
        Column("tconst", String, primary_key=True),
        Column("parent_tconst", String, nullable=False),
        Column("season_number", Integer, nullable=False),
        Column("episode_number", Integer, nullable=False),
        Column("average_rating", Float),
        Column("num_votes", Integer),
        Column("primary_title", String),
        Column("start_year", Integer),
        Column("end_year", Integer),
        extend_existing=True,
    )
    meta.create_all(engine)
    return table


def create_search_table(engine: Engine) -> Table:
    """
    Creates the table for the search engine in the database if it doesn't exist
    """
    meta = MetaData()
    table = Table(
        "search",
        meta,
        Column("tconst", String, primary_key=True),
        Column("average_rating", Float),
        Column("num_votes", Integer),
        Column("primary_title", String),
        Column("start_year", Integer),
        Column("end_year", Integer),
        extend_existing=True,
    )
    meta.create_all(engine)
    return table

def write_to_table(inserted_dicts: list[TypedDict], engine: Engine, table: Table):
    """
    Write all the dictionaries to the table `episodes`
    """
    with engine.connect() as con:
        con.execute(table.insert(), inserted_dicts)
        con.commit()


if __name__ == "__main__":
    username = getpass.getuser()
    engine = create_engine(f"postgresql+psycopg2://{username}@localhost/imdb")
    episodes_list = create_episode_list()

    episodes_table = create_episodes_table(engine)
    search_table = create_search_table(engine)

    write_to_table(episodes_list, engine, episodes_table)
    
