# BelChess platform (Juillet 2026 -> toujours en cours de développement)


Une plateforme Data "Full-Stack" dédiée à l’analyse et à la visualisation des statistiques des clubs et des joueurs d’échecs belges.


Ce projet personnel vise à apprendre et à m’améliorer sur le domaine de la data; via un ETL, donc j’extrais les données moi-même, je les transforme avec pandas et je les transmets via mon api REST (via fastapi). Ainsi qu’en apprendre plus sur du frontend en créant le dashboard en react (que je connais déjà) et en typescript(appris lors du projet). Mais aussi en découvrant des technos que je ne connaissais que de noms comme Docker, SQLAlchemy.


⚠️
Tous les retours, conseils sont les bienvenues. Mon but est surtout d’apprendre et non pas d’aller vite.
Pas d’utilisation de LLM hormis pour débug, ainsi que parfois pour m’aider dans le design du frontend et copilot en tant qu'auto-completion.
⚠️


##  Architecture du Projet


1. **Pipeline Data / ETL (Python & Pandas)**
   - Scripts de scraping pour récolter les données depuis le site de la Fédération belge d’échecs.
   - Nettoyage, calcul des moyennes d’âge, Elo, ratios nationalités via **Pandas**.
   - Ingestion des données propres dans la base de données.


2. **Base de Données (PostgreSQL & Docker)**
   - Conteneurisation de la base de données via **Docker Compose**, pas forcément nécessaire mais c’était surtout pour apprendre Docker.


3. **Backend / API REST (FastAPI)**
   - API développée sur-mesure avec **FastAPI**.
   - **SQLAlchemy** pour l’interaction avec la base de données.
   - **Pydantic** pour la validation des schémas de données et la sécurité des flux sortants.


4. **Frontend / Dashboard (React & TypeScript)**
   - Interface utilisateur dynamique développée avec **React**.
   - **TypeScript** : toujours dans le but d’apprendre mais ca semble particulièrement pertinent dans un projet data ou on manipule beaucoup de types de données différents.
   - Algorithmes de tri et de filtrage implémentés côté client.
   - [EN COURS ] Visualisation de données avec **Recharts** et le tout est stylisé via **Tailwind CSS**.
  

## Features que j'espère faire dans le futur;
- [ ] Graphiques/liste mettant en évidences les prodiges donc les outliers ceux qui ressortent à leur age (jeunes ou vieux) via machine learning ou simplement statistique
- [ ] Pages listant tout les joueurs par elo, age, ... (7000 joueurs donc faudra bien gérer les perfs)
- [ ] Liaison avec swar résults  (site affichant les tournois belges en cours/finis) pour afficher les tournois d'un club sur sa page perso
- [ ] Liaison avec un système d'archive de la FRBE pour retrouver les fiches précédentes et pouvoir afficher la progression des clubs en termes de membres et voir pour chaque joueur par quel club ils sont passées.
- [ ] Déployer le site et la db et l'optimiser pour éviter les requetes inutiles et avoir de bonnes perfs.
- [ ] Essayer de créer une vraie D.A au site en trouvant des composants adaptés, animation, ... Et essayer de rendre la navigation accesible pour tous.
- [ ] Création de visuels générés via PowerBI pour démontrer un peu le site (et pour apprendre Power BI)
