import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from sqlalchemy import func
from sqlalchemy.orm import Session
import models
import schemas
#fonction pour recup les données de ma bdd via sqlalchemy
def get_club(db: Session, club_matricule: int): #retourne le club correspondant au matricule donné
    return db.query(models.Club).filter(models.Club.matricule == club_matricule).first() 

def get_players_by_club(db: Session, club_matricule: int): #retourne les joueurs du club correspondant au matricule donné, triés par rang (rang = classement dans leur club)
    return db.query(models.Player).filter(models.Player.club_matricule == club_matricule).order_by(models.Player.rank).all()

def get_clubs(db: Session): #retourne tous les clubs
    return db.query(models.Club).all()

def global_stats(db: Session): #retourne les stats globales
    total_clubs = db.query(models.Club).count()
    player_stats = db.query(
        func.count(models.Player.player_matricule),
        func.avg(models.Player.elo_reference),
        func.avg(models.Player.age),
        func.max(models.Player.age),
        func.min(models.Player.age)
    ).first()
    total_players = player_stats[0]
    average_elo = round(player_stats[1]) if player_stats[1] is not None else 0
    average_age = round(player_stats[2]) if player_stats[2] is not None else 0
    age_max = player_stats[3]
    age_min = player_stats[4]
    return total_clubs, total_players, average_elo, average_age, age_max, age_min

# Intégration de l'api gémini (avec cache en mémoire pour préserver les quotas)
from google import genai
from google.genai import types

_analysis_cache: dict[int, schemas.ClubAnalysis] = {}

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Erreur initialisation Gemini Client: {e}")
        return None

def get_club_analysis(db: Session, club_matricule: int):
    if club_matricule in _analysis_cache:
        return _analysis_cache[club_matricule]

    club = get_club(db, club_matricule=club_matricule)
    if not club:
        return None

    players = get_players_by_club(db, club_matricule=club_matricule)
    if not players:
        return None

    client = get_gemini_client()
    if not client:
        print("GEMINI_API_KEY non configurée.")
        return None

    prompt = f"Analyse the following chess club data and provide a summary, strengths, and areas for growth (answer in French):\n\n"
    prompt += f"Club: {club.nom}, City: {club.ville}, League: {club.ligue}\n\nPlayers:\n"
    prompt += "\n".join([f"{p.first_name} {p.last_name}, Rank: {p.rank}, ELO: {p.elo_reference}, Age: {p.age}" for p in players[:50]])

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
                max_output_tokens=600,
                response_schema=schemas.ClubAnalysis
            ),
        )
        if response.parsed:
            _analysis_cache[club_matricule] = response.parsed
            return response.parsed
        return None
    except Exception as e:
        print(f"Erreur lors de la génération de l'analyse du club: {e}")
        return None