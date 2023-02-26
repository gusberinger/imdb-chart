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
    formatted_parent_tconst = parent_tconst[2:]
    series = ia.get_movie(formatted_parent_tconst)
    # plot outline
    description = series.get("plot outline")

    ia.update(series, "episodes")
    episodes_json = series["episodes"]

    keyed_by_tconst = {}

    for season_number in episodes_json:
        for episode_number in episodes_json[season_number]:
            episode = episodes_json[season_number][episode_number]
            tconst = f"tt{episode.movieID}"
            plot = episode.get("plot").strip()
            keyed_by_tconst[tconst] = plot

    return {"episodes": keyed_by_tconst, "description": description}
