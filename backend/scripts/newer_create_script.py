import psycopg2

from constants import (
    RATINGS_FILEPATH,
    EPISODE_INDEX_FILEPATH,
    BASICS_FILTERED_FILEPATH,
)

DEFINE_EXTENSIONS = """
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_similarity;
"""

CREATE_RATINGS_TABLE = """
    CREATE TABLE IF NOT EXISTS ratings (
        tconst VARCHAR(255),
        average_rating FLOAT,
        num_votes INTEGER
    );
    """

CREATE_EPISODE_INDEX_TABLE = """
    CREATE TABLE IF NOT EXISTS episode_index (
        tconst VARCHAR(255),
        parent_tconst VARCHAR(255),
        season_number INTEGER,
        episode_number INTEGER
    );
    """

CREATE_BASICS_TABLE = """
    CREATE TABLE IF NOT EXISTS basics (
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
            e.parent_tconst,
            b.primary_title,
            b.start_year,
            b.end_year,
            r.num_votes,
            r.average_rating,
            e.episode_number,
            e.season_number
        FROM basics b
        INNER JOIN ratings r ON r.tconst=b.tconst
        INNER JOIN episode_index e ON e.tconst=b.tconst
        WHERE
            (b.title_type='tvEpisode' OR b.title_type='tvMiniSeries')
            AND e.episode_number IS NOT NULL
            AND e.season_number IS NOT NULL;
"""

CREATE_SEARCH_TABLE = """
    DROP TABLE IF EXISTS search;
    CREATE TABLE search AS
        SELECT
            b.tconst,
            b.primary_title,
            b.start_year,
            b.end_year,
            r.num_votes,
            r.average_rating,
            LOWER(unaccent(primary_title)) AS searchable_title
        FROM basics b
        INNER JOIN ratings r ON r.tconst=b.tconst
        WHERE (title_type='tvSeries' OR title_type='tvMiniSeries')
            AND r.num_votes > 100
            AND b.tconst IN (SELECT DISTINCT parent_tconst FROM episodes);
"""

DROP_INTERFACE_TABLES = """
    DROP TABLE IF EXISTS ratings;
    DROP TABLE IF EXISTS episode_index;
    DROP TABLE IF EXISTS basics;
    """


ADD_INDECES = """
    CREATE INDEX episodes_parent_tconst_idx ON episodes (parent_tconst);
    ALTER TABLE episodes ADD PRIMARY KEY (tconst);
    ALTER TABLE search ADD PRIMARY KEY (tconst);
"""


if __name__ == "__main__":
    conn = psycopg2.connect(
        host="localhost",
        database="imdb",
        user="postgres",
        password="postgres",
    )
    cur = conn.cursor()

    cur.execute(DEFINE_EXTENSIONS)
    cur.execute(DROP_INTERFACE_TABLES)
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

    cur.execute(CREATE_SEARCH_TABLE)
    print("Search table created successfully")

    cur.execute(DROP_INTERFACE_TABLES)
    print("Interface tables dropped successfully")

    cur.execute(ADD_INDECES)
    print("Indeces added successfully")

    conn.commit()
    cur.close()
    conn.close()
