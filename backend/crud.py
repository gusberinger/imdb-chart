from sqlalchemy.orm import Session
from sqlalchemy import text
import models

def get_episode(db: Session, parent_tconst: str):
    """
    Returns all episodes matching the parent_tconst, ordered by season_number and episode_number
    """
    return db.query(models.EpisodeTable).filter(models.EpisodeTable.parent_tconst == parent_tconst).order_by(models.EpisodeTable.season_number, models.EpisodeTable.episode_number).all()


def search(db: Session, query: str):
    """
    Performs a search for the query using Full Text Search
    """
    sql_query = """
    SELECT tconst, primary_title, start_year, end_year, ts_rank(primary_title_vector, plainto_tsquery(:query)) as rank
    FROM search
    WHERE primary_title_vector @@ to_tsquery(:query)
    ORDER BY rank, num_votes DESC
    LIMIT 10;
    """
    return db.execute(text(sql_query), {"query": query}).fetchall()
    