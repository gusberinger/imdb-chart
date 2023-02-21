from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import getpass

# SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
username = getpass.getuser()
SQLALCHEMY_DATABASE_URL = f"postgresql://{username}@localhost:5432/imdb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
