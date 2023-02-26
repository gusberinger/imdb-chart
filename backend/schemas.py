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


class Search(BaseModel):
    tconst: str
    primary_title: str
    start_year: int | None
    end_year: int | None
    num_votes: int

    class Config:
        orm_mode = True


class _DetailedInfoEpisode(BaseModel):
    tconst: str
    description: str | None


class DetailedInfo(BaseModel):
    description: str | None
    episodes: list[_DetailedInfoEpisode]

    class Config:
        orm_mode = True
