#import de bs4 
import re

from bs4 import BeautifulSoup
import requests

url_index = "https://www.frbe-kbsb.be/sites/manager/GestionFICHES/FRBE_Club.php"
response = requests.get(url_index)
soup = BeautifulSoup(response.content, 'html.parser')

    
all_matricules = []
for link in soup.find_all('a', href=re.compile(r'club=\d+')):
    matricule = link['href'].split('club=')[1]
    all_matricules.append(int(matricule))


def scrape_club(matricule):
    url = f"https://www.frbe-kbsb.be/sites/manager/GestionFICHES/FRBE_Club.php?club={matricule}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find("table", class_="table3")
    if not table: 
        return None
    
    ths = table.find_all("th")
    if len(ths) < 2:
        return None
    info_cell = ths[1]
    text_parts = list(info_cell.stripped_strings)
    
    club_info = {
            "matricule": matricule,
            "ville": text_parts[0].split(":")[1].strip() if ":" in text_parts[0] else text_parts[0],
            "nom": text_parts[1],
            "ligue": text_parts[3] if len(text_parts) > 3 else "Inconnue",
            "federation": text_parts[5] if len(text_parts) > 5 else "Inconnue"
        }
    return club_info

def scrape_players(matricule):
    url = f"https://www.frbe-kbsb.be/sites/manager/GestionFICHES/FRBE_Club.php?club={matricule}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    tables = soup.find_all("table", class_="table3")
    if len(tables) < 2:
        return [] #s'il n'y a pas de joueurs
        
    players_table = tables[1]
    
    players_list = []
    
    for row in players_table.find_all("tr"):  
        cells = row.find_all("td")
        
        if len(cells) < 11:
            continue
            
        rank = cells[0].get_text(strip=True)
        player_name = cells[1].get_text(strip=True)
        player_matricule = cells[3].get_text(strip=True) 
        dtn = cells[4].get_text(strip=True)
        elobelge = cells[6].get_text(strip=True)
        
        elo_titre = cells[7].get_text(strip=True)
        fide = elo_titre.split(" ")[0]
        if len(elo_titre.split(" ")) > 1:
            titre = elo_titre.split(" ")[1]
        else:
            titre = ""
        flag_img = cells[7].find("img")
        if flag_img and "alt" in flag_img.attrs:
            nationality = flag_img["alt"]
        else:
            nationality = "Inconnu"
            
        elogained = cells[8].get_text(strip=True)
        totalgames = cells[9].get_text(strip=True)
        lastgame = cells[10].get_text(strip=True)
        
    
        players_list.append({
            "club_matricule": matricule, 
            "rank": rank,
            "player_name": player_name,
            "player_matricule": player_matricule,
            "dtn": dtn,
            "elobelge": elobelge,
            "fide": fide,
            "titre": titre,
            "nationality": nationality,
            "elogained": elogained,
            "totalgames": totalgames,
            "lastgame": lastgame
        })
        
    return players_list

