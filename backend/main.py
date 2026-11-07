import os
import sys

# Permet d'importer les modules locaux (models, schemas, crud, database)
# que le serveur soit lancé depuis la racine (uvicorn backend.main:app) ou depuis backend/
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
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

@app.get("/api/clubs", response_model=List[schemas.ClubResponse])
def read_clubs(db: Session = Depends(get_db)):
    """Récupère tous les clubs."""
    clubs = crud.get_clubs(db)
    if not clubs:
        raise HTTPException(status_code=404, detail="Aucun club trouvé.")
    return clubs

@app.get("/api/stats", response_model=schemas.GlobalStatsResponse)
def read_global_stats(db: Session = Depends(get_db)):
    """Récupère les statistiques globales."""
    stats = crud.global_stats(db)
    if not stats:
        raise HTTPException(status_code=404, detail="Aucune statistique trouvée.")
    return schemas.GlobalStatsResponse(
        total_clubs=stats[0],
        total_players=stats[1],
        average_elo=stats[2],
        average_age=stats[3],
        age_max=stats[4],
        age_min=stats[5]
    )