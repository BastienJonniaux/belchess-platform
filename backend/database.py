from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
load_dotenv() # Load environment variables from .env file
import os
SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL") # Get the database URL from environment variables

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) #permet de créer des sessions pour interagir avec la base de données
Base = declarative_base() #permet de créer des classes qui représentent les tables de la base de données
def get_db(): #function to get a database session
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
