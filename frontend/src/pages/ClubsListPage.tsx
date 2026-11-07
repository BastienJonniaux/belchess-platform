import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import SortableTable, { type Column } from "../components/SortableTable";
import { EloRatingBadge } from "../components/ChessBadges";

interface Club {
  matricule: number;
  nom: string;
  ville: string;
  ligue: string;
  federation?: string;
  player_count: number;
  average_elo: number;
  average_age: number;
  title_count?: number;
  foreign_players_count?: number;
}

export default function ClubsListPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLigue, setSelectedLigue] = useState<string>("ALL");

  useEffect(() => {
    fetch(`/api/clubs`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data: Club[]) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []);

  // Extraction unique des ligues principales
  const ligues = useMemo(() => {
    const list = Array.from(new Set(clubs.map((c) => c.ligue).filter(Boolean)));
    return ["ALL", ...list.slice(0, 6)];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    if (selectedLigue === "ALL") return clubs;
    return clubs.filter((c) => c.ligue === selectedLigue);
  }, [clubs, selectedLigue]);

  const clubColumns: Column<Club>[] = [
    {
      key: "matricule",
      label: "Matricule",
      render: (club) => (
        <span className="font-mono text-xs text-[#8A7A62]">
          #{club.matricule}
        </span>
      ),
    },
    {
      key: "nom",
      label: "Cercle / Club",
      render: (club) => (
        <Link
          to={`/clubs/${club.matricule}`}
          className="group inline-flex items-center gap-2 font-semibold text-[#EDE3D3] hover:text-[#C59448] transition-colors"
        >
          <span className="text-[#C59448]/80 group-hover:text-[#C59448] text-xs">♞</span>
          <span className="underline-offset-2 group-hover:underline">{club.nom}</span>
        </Link>
      ),
    },
    {
      key: "ville",
      label: "Ville",
      render: (club) => (
        <span className="text-xs text-[#A89882]">
          {club.ville || "—"}
        </span>
      ),
    },
    {
      key: "ligue",
      label: "Ligue",
      render: (club) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#221B14] border border-[#3A2F23] text-[#A89882]">
          {club.ligue || "FRBE"}
        </span>
      ),
    },
    {
      key: "player_count",
      label: "Membres",
      align: "right",
      render: (club) => (
        <span className="font-mono text-xs text-[#EDE3D3] font-medium">
          {club.player_count}
        </span>
      ),
    },
    {
      key: "average_elo",
      label: "Elo Moyen",
      align: "right",
      render: (club) => <EloRatingBadge elo={club.average_elo} />,
    },
    {
      key: "average_age",
      label: "Âge Moyen",
      align: "right",
      render: (club) => (
        <span className="font-mono text-xs text-[#8A7A62]">
          {club.average_age ? `${Math.round(club.average_age)} ans` : "—"}
        </span>
      ),
    },
    {
      key: "title_count",
      label: "Titrés",
      align: "right",
      render: (club) =>
        club.title_count && club.title_count > 0 ? (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#F3CA7E] bg-[#C59448]/10 px-1.5 py-0.5 rounded border border-[#C59448]/30">
            ★ {club.title_count}
          </span>
        ) : (
          <span className="font-mono text-xs text-[#5C5042]">0</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#14110E] font-sans text-[#EDE3D3]">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* En-tête de page noble */}
        <div className="mb-8 border-b border-[#2E241B] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C59448] mb-1.5">
            <span>Fédération Royale Belge d'Échecs</span>
            <span>·</span>
            <span>Annuaire National</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F4EFEA]">
            Cercles & Clubs d'Échecs
          </h1>
          <p className="mt-2 text-sm text-[#8A7A62] max-w-2xl leading-relaxed">
            Consultez les effectifs, forces Elo et compositions des cercles affiliés à la FRBE, la FEFB et la VSF.
          </p>

          {/* Filtres par Ligue */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-[#766754] mr-1">
              Ligues :
            </span>
            {ligues.map((ligue) => (
              <button
                key={ligue}
                onClick={() => setSelectedLigue(ligue)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  selectedLigue === ligue
                    ? "bg-[#C59448] text-[#14110E] font-bold shadow-sm"
                    : "bg-[#1E1812] text-[#A89882] border border-[#33271D] hover:border-[#C59448]/40 hover:text-[#EDE3D3]"
                }`}
              >
                {ligue === "ALL" ? "Toutes les ligues" : ligue}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau interactif */}
        {loading ? (
          <div className="rounded-xl border border-[#2E241B] bg-[#18130F] p-12 text-center text-xs text-[#8A7A62] font-mono">
            <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#C59448] border-t-transparent"></div>
            Chargement de l'annuaire des clubs...
          </div>
        ) : (
          <SortableTable
            data={filteredClubs}
            columns={clubColumns}
            searchPlaceholder="Rechercher par nom de club, matricule ou ville..."
            searchFilter={(club, q) =>
              club.nom?.toLowerCase().includes(q) ||
              club.ville?.toLowerCase().includes(q) ||
              String(club.matricule).includes(q) ||
              club.ligue?.toLowerCase().includes(q)
            }
          />
        )}
      </main>
    </div>
  );
}