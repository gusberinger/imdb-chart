import psycopg2

from constants import (
    RATINGS_FILEPATH,
    EPISODE_INDEX_FILEPATH,
    BASICS_FILTERED_FILEPATH,
)

DROP_TABLES = """
    DROP TABLE IF EXISTS ratings;
    DROP TABLE IF EXISTS episode_index;
    DROP TABLE IF EXISTS basics;
    """

CREATE_RATINGS_TABLE = """
    CREATE TABLE ratings (
        tconst VARCHAR(255),
        average_rating FLOAT,
        num_votes INTEGER
    );
    """

CREATE_EPISODE_INDEX_TABLE = """
    CREATE TABLE episode_index (
        tconst VARCHAR(255),
        parent_tconst VARCHAR(255),
        season_number INTEGER,
        episode_number INTEGER
    );
    """

CREATE_BASICS_TABLE = """
    CREATE TABLE basics (
        tconst VARCHAR(255),
        title_type VARCHAR(255),
        primary_title TEXT,
        start_year INTEGER,
        end_year INTEGER
    );
    """

CREATE_EPISODES_TABLE = """
    DROP TABLE IF EXISTS episodes;
    CREATE TABLE episodes AS
        SELECT
            b.tconst,
            b.primary_title,
            b.start_year,
            b.end_year,
            r.num_votes,
            r.average_rating,
            e.episode_number,
            e.season_number,
            e.parent_tconst
        FROM basics b
        INNER JOIN ratings r ON r.tconst=b.tconst
        INNER JOIN episode_index e ON e.tconst=b.tconst
        WHERE (b.title_type='tvEpisode' OR b.title_type='tvMiniSeries');
"""


if __name__ == "__main__":
    conn = psycopg2.connect(
        host="localhost",
        database="imdb",
        user="postgres",
        password="postgres",
    )
    cur = conn.cursor()

    cur.execute(DROP_TABLES)
    cur.execute(CREATE_RATINGS_TABLE)
    cur.execute(CREATE_EPISODE_INDEX_TABLE)
    cur.execute(CREATE_BASICS_TABLE)
    print("Tables created successfully")

    with open(BASICS_FILTERED_FILEPATH, "r") as f:
        next(f)  # Skip the header row.
        cur.copy_from(
            f,
            "basics",
            sep="|",
            null="\\N",
        )
    print("Copied basics file successfully")

    with open(EPISODE_INDEX_FILEPATH, "r") as f:
        next(f)
        cur.copy_from(f, "episode_index", sep="\t", null="\\N")
    print("Copied episode index file successfully")

    with open(RATINGS_FILEPATH, "r") as f:
        next(f)
        cur.copy_from(f, "ratings", sep="\t", null="\\N")
    print("Copied ratings file successfully")

    cur.execute(CREATE_EPISODES_TABLE)
    print("Episodes table created successfully")

    conn.commit()
    cur.close()
    conn.close()
