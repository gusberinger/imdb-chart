from database import Base
from sqlalchemy import Column, Integer, String, Float

class EpisodeTable(Base):
    __tablename__ = "episodes"
    tconst = Column(String, primary_key=True)
    parent_tconst = Column(String)
    season_number = Column(Integer)
    episode_number = Column(Integer)
    average_rating = Column(Float)
    num_votes = Column(Integer)
    primary_title = Column(String)
    start_year = Column(Integer)
    end_year = Column(Integer)
