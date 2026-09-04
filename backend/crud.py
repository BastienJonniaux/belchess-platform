from sqlalchemy import func
from sqlalchemy.orm import Session
import models
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

