from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base

#models.py sert à définir les tables de ma base de données via SQLAlchemy
class Club(Base):
    __tablename__ = "dim_clubs"
    matricule = Column(Integer, primary_key=True, index=True)
    ville = Column(String)
    nom = Column(String)
    ligue = Column(DateTime)
    federation = Column(DateTime)

class Player(Base):
    __tablename__ = "fact_player"
    player_matricule = Column(Integer, primary_key=True, index=True)
    club_matricule = Column(Integer, ForeignKey("dim_clubs.matricule"))
    rank = Column(Integer)
    last_name = Column(String)
    first_name = Column(String)
    elobelge = Column(Float)
    fide = Column(Float)
    elo_reference = Column(Float)
    titre = Column(String)
    nationality = Column(String)
    elogained = Column(Float)
    totalgames = Column(Float)
    birth_year = Column(Integer)
    age = Column(Integer)
    lastgame = Column()