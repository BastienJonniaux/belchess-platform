import time
import pandas as pd
from sqlalchemy import create_engine
from scraper import scrape_players, scrape_club, all_matricules

print(f"Début du scraping pour {len(all_matricules)} clubs...")

all_players_data = []
all_clubs_data = []

# test
#all_matricules = all_matricules[:3] 

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


df_players['elo_reference'] = df_players['fide'].combine_first(df_players['elobelge']).fillna(0)


df_players = df_players.drop(columns=['player_name', 'dtn'])


print("Connexion à la base de données PostgreSQL...")


DATABASE_URL = 'postgresql://belchess_admin:superpassword@localhost:5433/belchess_db'
engine = create_engine(DATABASE_URL)

print("Insertion des données dans la base...")


df_clubs.to_sql('dim_club', engine, if_exists='replace', index=False)

df_players.to_sql('fact_player', engine, if_exists='replace', index=False)

print("Succès ! Pipeline terminé. Données injectées dans pgAdmin.")