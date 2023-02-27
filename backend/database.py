import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()


class DatabaseURLNotSpecified(Exception):
    pass


DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL is None:
    raise DatabaseURLNotSpecified("DATABASE_URL is not specified")

engine = create_engine(DATABASE_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
