import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import StatWidget from "../components/StatWidget"; // Ton super composant !
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell   
} from "recharts";

//TODO; améliorer le design du graphique, ajouter des couleurs, des animations, etc.
// Faire détection des outliers pour les joueurs "prodiges" ou "vieux briscards" et les mettre en évidence sur le graphique. (scatter plot ?, ou un autre type de graphique ?)
interface GlobalStats {
  total_clubs: number;
  total_players: number;
  average_elo: number;
  average_age: number;
  age_max: number;
  age_min: number;
}

interface Club {
  nom: string;
  player_count: number;
  average_elo: number;
  average_age: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [Clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  type MetricKey = "player_count" | "average_elo" | "average_age";
  const [topMetrics, setTopMetrics] = useState<MetricKey>('player_count'); // 'player_count' par défaut
  useEffect(() => {
    // On utilise Promise.all pour faire les deux fetchs en même temps
    Promise.all([
      fetch("/api/stats").then((res) => res.json()),
      fetch("/api/clubs").then((res) => res.json())
    ])
      .then(([statsData, clubsData]) => {
        setStats(statsData);
        setClubs(clubsData);        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []); //on va tout chercher 1 fois
  const topClubs = [...Clubs]
    .sort((a, b) => b[topMetrics] - a[topMetrics])
    .slice(0, 5); // On ne garde que les 5 premiers clubs

  const titles = {
    player_count: "Nombre de joueurs",
    average_elo: "Elo moyen",
    average_age: "Âge moyen"
  };

 if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#1C1712] font-sans text-[#EDE3D3]">
        <Navbar />
        <div className="p-8 text-center text-[#8A7A62]">Analyse des données en cours...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1712] font-sans text-[#EDE3D3]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-[#BD8C3E]">
          L'état des Échecs en Belgique
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatWidget 
            title="Total Joueurs" 
            value={stats.total_players} 
            subtitle="Licenciés actifs" 
          />
          <StatWidget 
            title="Clubs" 
            value={stats.total_clubs} 
            subtitle="Répartis sur le territoire" 
          />
          <StatWidget 
            title="Elo Moyen National" 
            value={stats.average_elo} 
            subtitle="FIDE & National" 
          />
          <StatWidget 
            title="Âge Moyen" 
            value={stats.average_age} 
            subtitle={`De ${stats.age_min} à ${stats.age_max} ans`} 
          />
        </div>

          <div className="bg-[#241D16] border border-[#3A3025] rounded-xl p-6 shadow-lg">
            

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#EDE3D3]">
                {titles[topMetrics]}
              </h2>
              
              <select 
                value={topMetrics} 
                onChange={(e) => setTopMetrics(e.target.value as MetricKey)}
                className="bg-[#1C1712] border border-[#3A3025] text-[#8A7A62] p-2 rounded focus:outline-none focus:border-[#BD8C3E]"
              >
                <option value="player_count">Membres</option>
                <option value="average_elo">Elo Moyen</option>
                <option value="average_age">Âge Moyen</option>
              </select>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClubs} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="nom" type="category" axisLine={false} tickLine={false} tick={{ fill: '#8A7A62', fontSize: 12 }} width={150} />
                  <Tooltip cursor={{ fill: '#2A221A' }} contentStyle={{ backgroundColor: '#1C1712', borderColor: '#3A3025', color: '#EDE3D3' }} />
                  
                  <Bar dataKey={topMetrics} radius={[0, 4, 4, 0]}>
                    {topClubs.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#BD8C3E' : '#4A3F32'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      </main>
    </div>
  );
}