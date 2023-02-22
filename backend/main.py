from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import crud, models, schemas
from database import sessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173/"
    "http://localhost:5173",
    "https://localhost:5173",
    "localhost:5173",
    "127.0.0.1:5173",
    "http://localhost",
    

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Dependency
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/episodes/{parent_tconst}", response_model=list[schemas.Episode])
def get_episodes(parent_tconst: str, db: Session = Depends(get_db)):
    db_episodes = crud.get_episode(db, parent_tconst=parent_tconst)
    if db_episodes is None:
        raise HTTPException(status_code=404, detail="Episode not found")
    return db_episodes


# @app.get("/search/{query}")
@app.get("/search/{query}", response_model=list[schemas.Search])
def search(query: str, db: Session = Depends(get_db)):
    return crud.search(db, query=query)

