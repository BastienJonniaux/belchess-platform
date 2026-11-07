import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ClubHeader, { type ClubInfo } from "../components/ClubHeader";
import { useParams, Link } from "react-router-dom";
import type { Column } from "../components/SortableTable";
import SortableTable from "../components/SortableTable";
import {
  RankBadge,
  TitleBadge,
  EloRatingBadge,
  NationalityBadge,
} from "../components/ChessBadges";
import { ArrowLeft } from "lucide-react";

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

export interface PlayerRow {
  rank: number;
  matricule: number;
  lastName: string;
  firstName: string;
  titre?: string;
  age: number;
  elo: number;
  nationality: string;
  games: number;
  lastGame: string;
}

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
          titre: p.titre || "",
          age: p.age || 0,
          elo: p.elo_reference,
          nationality: p.nationality || "Inconnu",
          games: p.totalgames || 0,
          lastGame: p.lastgame || "N/A",
        }));

        setPlayers(formattedPlayers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, [club]);

  const playerColumns: Column<PlayerRow>[] = [
    {
      key: "rank",
      label: "Rang",
      align: "center",
      render: (p) => <RankBadge rank={p.rank} />,
    },
    {
      key: "matricule",
      label: "Matricule",
      render: (p) => (
        <span className="font-mono text-xs text-[#8A7A62]">
          #{p.matricule}
        </span>
      ),
    },
    {
      key: "lastName",
      label: "Joueur",
      render: (p) => (
        <div className="flex items-center gap-2">
          {p.titre && <TitleBadge title={p.titre} />}
          <span className="font-medium text-[#F4EFEA]">
            {p.lastName} {p.firstName}
          </span>
        </div>
      ),
    },
    {
      key: "elo",
      label: "Cote Elo",
      align: "right",
      render: (p) => <EloRatingBadge elo={p.elo} />,
    },
    {
      key: "nationality",
      label: "Fédération",
      render: (p) => <NationalityBadge nationality={p.nationality} />,
    },
    {
      key: "age",
      label: "Âge",
      align: "right",
      render: (p) => (
        <span className="font-mono text-xs text-[#8A7A62]">
          {p.age > 0 ? `${p.age} ans` : "—"}
        </span>
      ),
    },
    {
      key: "games",
      label: "Parties",
      align: "right",
      render: (p) => (
        <span className="font-mono text-xs text-[#EDE3D3]">
          {p.games}
        </span>
      ),
    },
    {
      key: "lastGame",
      label: "Dernière partie",
      align: "right",
      render: (p) => (
        <span className="font-mono text-[11px] text-[#766754]">
          {p.lastGame && p.lastGame !== "N/A" ? p.lastGame : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#14110E] font-sans text-[#EDE3D3]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Fil d'Ariane retour */}
        <div className="mb-4">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A7A62] hover:text-[#C59448] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Retour à l'annuaire des clubs</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#2E241B] bg-[#18130F] shadow-xl">
          {club ? (
            <ClubHeader club={club} />
          ) : (
            <div className="p-8 text-center text-xs text-[#8A7A62] font-mono">
              <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#C59448] border-t-transparent"></div>
              Chargement de la fiche du club...
            </div>
          )}

          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#F4EFEA]">
                  Effectif & Classement Interne
                </h2>
                <p className="text-xs text-[#8A7A62]">
                  Membres classés par rang officiel au sein du club
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-lg border border-[#2E241B] bg-[#14110E] p-8 text-center text-xs text-[#8A7A62] font-mono">
                <div className="mx-auto mb-2 h-4 w-4 animate-spin rounded-full border-2 border-[#C59448] border-t-transparent"></div>
                Chargement des joueurs...
              </div>
            ) : (
              <SortableTable
                data={players}
                columns={playerColumns}
                searchPlaceholder="Filtrer un joueur par nom, matricule ou fédération..."
                searchFilter={(p, q) =>
                  p.lastName.toLowerCase().includes(q) ||
                  p.firstName.toLowerCase().includes(q) ||
                  String(p.matricule).includes(q) ||
                  (p.titre && p.titre.toLowerCase().includes(q)) ||
                  p.nationality.toLowerCase().includes(q)
                }
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}