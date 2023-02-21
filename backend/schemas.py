from pydantic import BaseModel


class Episode(BaseModel):
    tconst: str
    parent_tconst: str
    season_number: int
    episode_number: int
    average_rating: float
    num_votes: int
    primary_title: str | None
    start_year: int | None
    end_year: int | None

    class Config:
        orm_mode = True
