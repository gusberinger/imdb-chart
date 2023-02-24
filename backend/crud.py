import random
from sqlalchemy.orm import Session
from sqlalchemy import text
import models
from unidecode import unidecode


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
    SIMILARITY(:query, searchable_title) DESC
    LIMIT 10
    """
    return db.execute(text(sql), {"query": query}).fetchall()
