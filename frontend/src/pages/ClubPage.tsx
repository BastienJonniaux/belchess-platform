import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ClubHeader, { type ClubInfo } from "../components/ClubHeader";
import PlayerTable, { type PlayerRow } from "../components/PlayerTable";
import { useParams } from "react-router-dom";

/*const PLACEHOLDER_CLUB: ClubInfo = {
  matricule: 541,
  name: "Échiquier Leuzois",
  town: "Leuze-en-Hainaut",
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
          town: data.ville,
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

if (!club) {
    return (
      <div className="min-h-screen bg-[#1C1712] font-sans text-[#EDE3D3]">
        <Navbar />
        <main className="mx-auto max-w-4xl">
          <div className="mt-6 overflow-hidden rounded-xl border border-[#3A3025] bg-[#1C1712]">
            <div className="p-6 text-center text-[#8A7A62]">Chargement du club...</div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#1C1712] font-sans text-[#EDE3D3]">
      <Navbar />
      <main className="mx-auto max-w-4xl">
        <div className="mt-6 overflow-hidden rounded-xl border border-[#3A3025] bg-[#1C1712]">
          <ClubHeader club={club} />
          
          {loading ? (
            <div className="p-6 text-center text-[#8A7A62]">Chargement des joueurs...</div>
          ) : (
            <PlayerTable players={players} />
          )}

        </div>
      </main>
    </div>
  );
}