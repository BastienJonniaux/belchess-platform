from sqlalchemy.orm import Session
import models
#fonction pour recup les données de ma bdd via sqlalchemy
def get_club(db: Session, club_matricule: int): #retourne le club correspondant au matricule donné
    return db.query(models.Club).filter(models.Club.matricule == club_matricule).first() 

def get_players_by_club(db: Session, club_matricule: int): #retourne les joueurs du club correspondant au matricule donné, triés par rang (rang = classement dans leur club)
    return db.query(models.Player).filter(models.Player.club_matricule == club_matricule).order_by(models.Player.rank).all()