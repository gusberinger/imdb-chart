from sqlalchemy.orm import Session
import models, schemas

def get_episode(db: Session, parent_tconst: str):
    """
    Returns all episodes matching the parent_tconst, ordered by season_number and episode_number
    """
    return db.query(models.Episode).filter(models.Episode.parent_tconst == parent_tconst).order_by(models.Episode.season_number, models.Episode.episode_number).all()


def get_episodes(db: Session):
    """
    Returns all episodes
    """
    return db.query(models.Episode).all().limit(100)

