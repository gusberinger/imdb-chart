import csv
import getpass
import gzip
from typing import TypedDict
from sqlalchemy.engine.base import Engine
from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    MetaData,
    Float,
    create_engine,
    inspect
)
from tqdm import tqdm
from constants import (
    RATINGS_FILEPATH,
    EPISODE_FILEPATH,
    BASICS_FILTERED_FILEPATH,
    RATINGS_EST_SIZE,
    EPISODE_EST_SIZE,
    BASICS_FILTERED_EST_SIZE,
)
import typer


class RatingsDict(TypedDict):
    tconst: str
    average_rating: float
    num_votes: int


class EpisodeIndexDict(TypedDict):
    tconst: str
    parent_tconst: str
    season_number: str
    episode_number: str


class BasicsDict(TypedDict):
    tconst: str
    primary_title: str
    start_year: int | None
    end_year: int | None


def create_ratings_table(engine: Engine) -> Table:
    """
    Drops the table if it already exists, then creates the ratings table
    """
    metadata = MetaData()
    ratings_table = Table(
        "ratings",
        metadata,
        Column("tconst", String, primary_key=True),
        Column("average_rating", Float),
        Column("num_votes", Integer),
        extend_existing=True,
    )
    inspector = inspect(engine)
    if inspector.has_table("ratings"):
        metadata.drop_all(engine)
    metadata.create_all(engine)
    return ratings_table


def create_episode_index_table(engine: Engine) -> Table:
    metadata = MetaData()
    episode_index_table = Table(
        "episode_index",
        metadata,
        Column("tconst", String, primary_key=True),
        Column("parent_tconst", String),
        Column("season_number", Integer),
        Column("episode_number", Integer),
        extend_existing=True,
    )
    inspector = inspect(engine)
    if inspector.has_table("episode_index"):
        metadata.drop_all(engine)
    metadata.create_all(engine)
    return episode_index_table


def create_basics_table(engine: Engine) -> Table:
    metadata = MetaData()
    basics_table = Table(
        "basics",
        metadata,
        Column("tconst", String, primary_key=True),
        Column("primary_title", String),
        Column("start_year", Integer),
        Column("end_year", Integer),
        extend_existing=True,
    )
    inspector = inspect(engine)
    if inspector.has_table("basics"):
        metadata.drop_all(engine)
    metadata.create_all(engine)
    return basics_table


def create_tables(engine: Engine) -> None:
    create_basics_table(engine)
    create_episode_index_table(engine)
    create_ratings_table(engine)


def read_ratings_file() -> list[RatingsDict]:
    ratings_list: list[RatingsDict] = []
    with gzip.open(RATINGS_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in tqdm(reader, total=RATINGS_EST_SIZE):
            tconst = row["tconst"]
            average_rating = float(row["averageRating"])
            num_votes = int(row["numVotes"])
            ratings_list.append(
                {
                    "tconst": tconst,
                    "average_rating": average_rating,
                    "num_votes": num_votes,
                }
            )
    return ratings_list


def read_episode_file() -> list[EpisodeIndexDict]:
    episode_list: list[EpisodeIndexDict] = []
    with gzip.open(EPISODE_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in tqdm(reader, total=EPISODE_EST_SIZE):
            tconst = row["tconst"]
            parent_tconst = row["parentTconst"]
            season_number = row["seasonNumber"]
            episode_number = row["episodeNumber"]

            if season_number == "\\N" or episode_number == "\\N":
                continue

            episode_list.append(
                {
                    "tconst": tconst,
                    "parent_tconst": parent_tconst,
                    "season_number": season_number,
                    "episode_number": episode_number,
                }
            )
    return episode_list


def read_basics_file() -> list[BasicsDict]:
    basics_list: list[BasicsDict] = []
    with gzip.open(BASICS_FILTERED_FILEPATH, "rt") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in tqdm(reader, total=BASICS_FILTERED_EST_SIZE):
            tconst = row["tconst"]
            primary_title = row["primaryTitle"]
            start_year = row["startYear"]
            end_year = row["endYear"]

            start_year = int(start_year) if start_year != "\\N" else None
            end_year = int(end_year) if end_year != "\\N" else None

            basics_list.append(
                {
                    "tconst": tconst,
                    "primary_title": primary_title,
                    "start_year": start_year,
                    "end_year": end_year,
                }
            )
    return basics_list



def main():
    username = getpass.getuser()
    engine = create_engine(f"postgresql://{username}@localhost:5432/imdb")

    ratings_list = read_ratings_file()
    episode_list = read_episode_file()
    basics_list = read_basics_file()

    ratings_table = create_ratings_table(engine)
    episode_index_table = create_episode_index_table(engine)
    basics_table = create_basics_table(engine)

    with engine.connect() as conn:
        conn.execute(ratings_table.insert(), ratings_list)
        conn.execute(episode_index_table.insert(), episode_list)
        conn.execute(basics_table.insert(), basics_list)
        conn.commit()


if __name__ == "__main__":

    typer.run(main)

