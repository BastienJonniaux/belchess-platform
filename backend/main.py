from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware
#Fichier fastapi pour créer l'API RESTful, définissant les routes 
app = FastAPI(title="BelChess API", description="API pour les données des clubs d'échecs belges")
#middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines pour le développement, en production on restreindra à notre domaine [https://belchess-platform.app] par exemple
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/clubs/{club_matricule}", response_model=schemas.ClubResponse)
def read_club(club_matricule: int, db: Session = Depends(get_db)): #injecte automatiquement une session de bdd
    """Récupère les infos d'un club via son matricule."""
    db_club = crud.get_club(db, club_matricule=club_matricule) #operation de lecture de la bdd via la fonction get_club du fichier crud.py
    if not db_club:
        raise HTTPException(status_code=404, detail="Club non trouvé.")
    return db_club

@app.get("/api/clubs/{club_matricule}/players", response_model=List[schemas.PlayerResponse])
def read_players(club_matricule: int, db: Session = Depends(get_db)):
    """Récupère tous les joueurs d'un club, triés par rang."""
    players = crud.get_players_by_club(db, club_matricule=club_matricule)
    if not players:
        raise HTTPException(status_code=404, detail="Aucun joueur trouvé pour ce club.")
    return players