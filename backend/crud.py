from imdb import Cinemagoer
from sqlalchemy.orm import Session
from sqlalchemy import text
import models
from unidecode import unidecode


ia = Cinemagoer()


def get_episodes(db: Session, parent_tconst: str):
    """
    Returns all episodes matching the parent_tconst, ordered by season_number and episode_number
    """
    episodes_queried = (
        db.query(models.EpisodeTable)
        .filter(models.EpisodeTable.parent_tconst == parent_tconst)
        .order_by(models.EpisodeTable.season_number, models.EpisodeTable.episode_number)
        .all()
    )
    return episodes_queried


def sanitize_search_query(query: str):
    """
    Cleans the query for Full Text Search
    """
    query = query.lower()
    query = unidecode(query)
    query = query.replace("&", "and")
    query = query.replace(":", "")
    query = query.replace(";", "")
    query = query.replace("!", "")
    query = query.replace("?", "")
    query = query.replace("-", "")
    return query


def search(db: Session, query: str):
    """
    Performs a search for the query using Full Text Search
    """

    query = sanitize_search_query(query)
    sql = """
    SELECT tconst, primary_title, start_year, end_year, num_votes
    FROM search
    ORDER BY
    jarowinkler(:query, searchable_title) DESC
    LIMIT 10
    """
    return db.execute(text(sql), {"query": query}).fetchall()


def get_detailed_info(db: Session, parent_tconst: str):
    # check the cache
    cache = (
        db.query(models.CacheTable)
        .filter(models.CacheTable.tconst == parent_tconst)
        .first()
    )
    if cache:
        return cache.json_data

    formatted_parent_tconst = parent_tconst[2:]
    imdb_series = ia.get_movie(formatted_parent_tconst)
    series_escription = imdb_series.get("plot outline")

    ia.update(imdb_series, "episodes")
    imdb_episodes = imdb_series["episodes"]

    episode_json = []

    for season_number in imdb_episodes:
        for episode_number in imdb_episodes[season_number]:
            episode = imdb_episodes[season_number][episode_number]
            tconst = f"tt{episode.movieID}"
            plot = episode.get("plot").strip()
            episode_json.append(
                {
                    "tconst": tconst,
                    "description": plot,
                }
            )

    json = {
        "episodes": episode_json,
        "description": series_escription,
    }

    # add to cache
    cache = models.CacheTable(
        tconst=parent_tconst,
        json_data=json,
    )
    db.add(cache)
    db.commit()
    return json
