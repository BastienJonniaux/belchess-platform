from pydantic import BaseModel, ConfigDict
from typing import Optional
#schemas.py sert à definir la facon dont les données sont validées et sérialisées dans les modèles Pydantic
class PlayerResponse(BaseModel):
    player_matricule: int
    club_matricule: int
    rank: Optional[int] = None 
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    elo_reference: float
    titre: Optional[str] = None
    nationality: Optional[str] = None
    elogained: Optional[float] = None
    totalgames: Optional[float] = None
    lastgame: Optional[str] = None
    age: Optional[int] = None
    model_config = ConfigDict(from_attributes=True) #permet de configurer le modèle Pydantic pour qu'il puisse être créé à partir d'instances de modèles SQLAlchemy, en mappant automatiquement les attributs des objets SQLAlchemy aux champs du modèle Pydantic.

class ClubResponse(BaseModel):
    matricule: int
    ville: Optional[str] = None
    nom: Optional[str] = None
    ligue: Optional[str] = None
    federation: Optional[str] = None
    player_count: Optional[int] = None
    average_elo: Optional[float] = None
    average_age: Optional[float] = None
    belgian_players_count: Optional[int] = None
    foreign_players_count: Optional[int] = None
    title_count: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)