import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ClubHeader, { type ClubInfo } from "../components/ClubHeader";
import { useParams } from "react-router-dom";
import type { Column } from "../components/SortableTable";
import SortableTable from "../components/SortableTable";

/*const PLACEHOLDER_CLUB: ClubInfo = {
  matricule: 541,
  name: "Échiquier Leuzois",
  ville: "Leuze-en-Hainaut",
  ligue: "Hainaut (FEFB)",
  federation: "F.E.F.B.",
  playerCount: 76,
  avgElo: 1712,
  avgAge: 34.8,
  belgianCount: 44,
  foreignCount: 32,
};*/
export default function ClubPage() {
  const {matricule} = useParams<{matricule: string}>(); 
  const [club, setClub] = useState<ClubInfo | null>(null);
  useEffect(() => {
    fetch(`/api/clubs/${matricule}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        setClub({
          matricule: data.matricule,
          name: data.nom,
          ville: data.ville,
          ligue: data.ligue,
          federation: data.federation,
          playerCount: data.player_count,
          avgElo: data.average_elo,
          avgAge: data.average_age,
          belgianCount: data.belgian_players_count,
          foreignCount: data.foreign_players_count,
          titleCount: data.title_count,
        });

      })
      .catch((err) => {
        console.error("Erreur API:", err);
      });
  }, [matricule]);

  


  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!club) return;
    fetch(`/api/clubs/${club.matricule}/players`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        //Transformation des données (Backend snake_case -> Frontend camelCase)
        const formattedPlayers: PlayerRow[] = data.map((p: any) => ({
          rank: p.rank,
          matricule: p.player_matricule,
          lastName: p.last_name || "",
          firstName: p.first_name || "",
          age: p.age || 0,
          elo: p.elo_reference, // <-- Note bien qu'on prend elo_reference de ton API
          nationality: p.nationality || "Inconnu",
          games: p.totalgames || 0,
          lastGame: p.lastgame || "N/A",
          totalgames: p.totalgames || 0,
        }));

        setPlayers(formattedPlayers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, [club]);

const playerColumns : Column<PlayerRow>[] = [
  { key: "rank", label: "Rang" },
  { key: "matricule", label: "Matricule" },
  { key: "lastName", label: "Nom" },
  { key: "firstName", label: "Prénom" },
  { key: "age", label: "Âge" },
  { key: "elo", label: "Elo" },
  { key: "nationality", label: "Fédération" },
  { key: "games", label: "Parties" },
  { key: "lastGame", label: "Dernière partie" },
  { key: "totalgames", label: "Total parties" },
];


  return (
    <div className="min-h-screen bg-[#1C1712] font-sans text-[#EDE3D3]">
      <Navbar />
      <main className="mx-auto max-w-5xl">
        <div className="mt-6 overflow-hidden rounded-xl border border-[#3A3025] bg-[#1C1712]">
          {club ? (
            <ClubHeader club={club} />
          ) : (
            <div className="p-6 text-center text-[#8A7A62]">Chargement du club...</div>
          )}
          
          {loading ? (
            <div className="p-6 text-center text-[#8A7A62]">Chargement des joueurs...</div>
          ) : (
            <SortableTable data={players} columns={playerColumns} />
          )}

        </div>
      </main>
    </div>
  );
}