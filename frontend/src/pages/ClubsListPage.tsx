import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

interface Club {
  matricule: number;
  nom: string;
  ville: string;
  ligue: string;
  player_count: number;
  average_elo: number;
  average_age: number;
}

export default function ClubsListPage() {
    const [clubs, setClubs] = useState<Club[]>([]);
    useEffect(() => {
        fetch(`/api/clubs`)
            .then((res) => {
                if (!res.ok) throw new Error("Erreur réseau");
                return res.json();
            })
            .then((data : Club[]) => {
                setClubs(data);
            })
            .catch((err) => {
                console.error("Erreur API:", err);
            });
    }, []);
    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="text-3xl font-bold mb-6">Liste des clubs</h1>
                <ul className="space-y-4">
                    {clubs.map((club) => (
                        <li key={club.matricule} className="bg-white shadow-md rounded-lg p-4">
                            <a href={`/clubs/${club.matricule}`} className="text-blue-500 hover:underline">
                                {club.nom}
                            </a>
                            <p className="text-gray-600">
                                Ligue: {club.ligue} | Joueurs: {club.player_count}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}