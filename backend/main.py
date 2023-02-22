from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import crud, models, schemas
from database import sessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/tv_show/{parent_tconst}", response_model=list[schemas.Episode])
def get_episodes(parent_tconst: str, db: Session = Depends(get_db)):
    db_episodes = crud.get_episode(db, parent_tconst=parent_tconst)
    if db_episodes is None:
        raise HTTPException(status_code=404, detail="Episode not found")
    return db_episodes


@app.get("/search/{query}")
def search(query: str, db: Session = Depends(get_db)):
    return crud.search(db, query=query)

