import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SortableTable, { type Column } from "../components/SortableTable";

interface Club {
  matricule: number;
  nom: string;
  ville: string;
  ligue: string;
  player_count: number;
  average_elo: number;
  average_age: number;
  title_count?: number;
  foreign_players_count?: number;
}

export default function ClubsListPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

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

  const clubColumns: Column<Club>[] = [
    { key: "matricule", label: "Matricule" },
    { 
      key: "nom", 
      label: "Nom du Club",
      render: (club) => (
        <a href={`/clubs/${club.matricule}`} className="text-[#BD8C3E] hover:underline font-bold">
          {club.nom}
        </a>
      )
    },
    { key: "ville", label: "Ville" },
    { key: "ligue", label: "Ligue" },
    { key: "player_count", label: "Joueurs" },
    { key: "average_elo", label: "Elo Moyen" },
    { key: "average_age", label: "Âge Moyen" },
    { key: "title_count", label: "Titres" },
    { key: "foreign_players_count", label: "Joueurs Étrangers" },
  ];

  return (
    <div className="min-h-screen bg-[#1C1712] font-sans text-[#EDE3D3]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-[#BD8C3E]">Liste des clubs</h1>
        
        {loading ? (
          <p className="text-[#8A7A62]">Chargement des clubs...</p>
        ) : (
          <SortableTable data={clubs} columns={clubColumns} />
        )}
      </div>
    </div>
  );
}