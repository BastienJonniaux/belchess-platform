import time
import pandas as pd
from sqlalchemy import create_engine
from scraper import scrape_players, scrape_club, all_matricules



all_players_data = []
all_clubs_data = []

# test
#all_matricules = all_matricules[:3] 
print(f"Début du scraping pour {len(all_matricules)} clubs...")
for matricule in all_matricules:
    club_info = scrape_club(matricule)
    if club_info:
        all_clubs_data.append(club_info)
        
    players_info = scrape_players(matricule)
    if players_info:
        all_players_data.extend(players_info)
        
    time.sleep(1)

print("Scraping terminé ! Création et nettoyage des DataFrames...")

df_clubs = pd.DataFrame(all_clubs_data)
df_players = pd.DataFrame(all_players_data)

df_players['elobelge'] = pd.to_numeric(df_players['elobelge'], errors='coerce')
df_players['fide'] = pd.to_numeric(df_players['fide'], errors='coerce')
df_players['elogained'] = pd.to_numeric(df_players['elogained'], errors='coerce').fillna(0)
df_players['totalgames'] = pd.to_numeric(df_players['totalgames'], errors='coerce').fillna(0)

df_players[['last_name', 'first_name']] = df_players['player_name'].str.split(', ', n=1, expand=True)

df_players['birth_year'] = pd.to_numeric(df_players['dtn'].str[:4], errors='coerce')
df_players['age'] = 2026 - df_players['birth_year']
df_players['titre'] = df_players['titre'].replace({'': None})

df_players['elo_reference'] = df_players['fide'].combine_first(df_players['elobelge']).fillna(0)


df_players = df_players.drop(columns=['player_name', 'dtn'])
# CALCUL STATISTIQUES DES CLUBS

df_players_grouped = df_players.groupby('club_matricule').agg( #creation d'un DataFrame regroupé par club_matricule pour calculer les statistiques des joueurs par club
    player_count=('player_matricule', 'count'),
    average_elo=('elo_reference', 'mean'),
    average_age=('age', 'mean'),
    belgian_players_count=('nationality', lambda x: (x == 'BEL').sum()),
    foreign_players_count=('nationality', lambda x: (x != 'BEL').sum()),
    title_count=('titre', lambda x: x.notnull().sum())
).reset_index()
df_players_grouped['average_elo'] = df_players_grouped['average_elo'].round(2)
df_players_grouped['average_age'] = df_players_grouped['average_age'].round(2)
df_clubs = df_clubs.merge(df_players_grouped, left_on='matricule', right_on='club_matricule', how='left').drop(columns=['club_matricule']) #join les statistiques calculées sur les joueurs avec les informations des clubs, en utilisant le matricule du club comme clé de jointure. Les colonnes 'club_matricule' sont supprimées après la fusion pour éviter la redondance.


print("Connexion à la base de données PostgreSQL...")


DATABASE_URL = 'postgresql://belchess_admin:superpassword@localhost:5433/belchess_db'
engine = create_engine(DATABASE_URL)

print("Insertion des données dans la base...")


df_clubs.to_sql('dim_club', engine, if_exists='replace', index=False)

df_players.to_sql('fact_player', engine, if_exists='replace', index=False)

print("Succès ! Pipeline terminé. Données injectées dans pgAdmin.")