import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell   
} from "recharts";
import { Users, Shield, Trophy, Activity, ArrowRight } from "lucide-react";

interface GlobalStats {
  total_clubs: number;
  total_players: number;
  average_elo: number;
  average_age: number;
  age_max: number;
  age_min: number;
}

interface Club {
  matricule: number;
  nom: string;
  ville: string;
  player_count: number;
  average_elo: number;
  average_age: number;
}

type MetricKey = "player_count" | "average_elo" | "average_age";

export default function HomePage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [topMetrics, setTopMetrics] = useState<MetricKey>("player_count");

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/clubs").then((res) => (res.ok ? res.json() : []))
    ])
      .then(([statsData, clubsData]) => {
        setStats(statsData);
        setClubs(clubsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []);

  const topClubs = [...clubs]
    .sort((a, b) => b[topMetrics] - a[topMetrics])
    .slice(0, 6);

  const metricTabs = [
    { key: "player_count" as MetricKey, label: "Effectif des Membres", unit: "joueurs" },
    { key: "average_elo" as MetricKey, label: "Elo Moyen d'Équipe", unit: "Elo" },
    { key: "average_age" as MetricKey, label: "Âge Moyen", unit: "ans" },
  ];

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#14110E] font-sans text-[#EDE3D3]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 text-xs font-mono text-[#8A7A62]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#C59448] border-t-transparent mb-3"></div>
          Chargement de l'observatoire BelChess...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14110E] font-sans text-[#EDE3D3]">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12 border-b border-[#2E241B] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C59448]/30 bg-[#C59448]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#F4EFEA] mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C59448] animate-pulse"></span>
            Observatoire Fédéral · Données FRBE-KBSB
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F4EFEA] max-w-3xl leading-tight">
            L'Échiquier Belge en Données
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#A89882] max-w-2xl leading-relaxed">
            Plateforme analytique dédiée aux cercles et joueurs d'échecs de Belgique.
            Forces Elo, pyramides d'âge et fiches d'évaluation tactique générées par IA.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/clubs"
              className="inline-flex items-center gap-2 rounded-md bg-[#C59448] px-4 py-2 text-xs font-mono font-bold text-[#14110E] hover:bg-[#D4A359] transition-all shadow-md shadow-[#C59448]/20"
            >
              <span>Consulter les clubs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Grille des 4 indicateurs clés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="rounded-xl border border-[#2E241B] bg-[#19140F] p-5 shadow-sm hover:border-[#3E3022] transition-colors">
            <div className="flex items-center justify-between text-[#8A7A62] mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Licenciés Actifs</span>
              <Users className="h-4 w-4 text-[#C59448]" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#F4EFEA]">
              {stats.total_players.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#766754] mt-1">Joueurs affiliés en Belgique</p>
          </div>

          <div className="rounded-xl border border-[#2E241B] bg-[#19140F] p-5 shadow-sm hover:border-[#3E3022] transition-colors">
            <div className="flex items-center justify-between text-[#8A7A62] mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Cercles Affiliés</span>
              <Shield className="h-4 w-4 text-[#C59448]" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#F4EFEA]">
              {stats.total_clubs}
            </div>
            <p className="text-[11px] text-[#766754] mt-1">Répartis en FEFB, VSF & SVDB</p>
          </div>

          <div className="rounded-xl border border-[#2E241B] bg-[#19140F] p-5 shadow-sm hover:border-[#3E3022] transition-colors">
            <div className="flex items-center justify-between text-[#8A7A62] mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Elo Moyen National</span>
              <Trophy className="h-4 w-4 text-[#F5D084]" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#F5D084]">
              {Math.round(stats.average_elo)}
            </div>
            <p className="text-[11px] text-[#766754] mt-1">Cote de référence FIDE & Belge</p>
          </div>

          <div className="rounded-xl border border-[#2E241B] bg-[#19140F] p-5 shadow-sm hover:border-[#3E3022] transition-colors">
            <div className="flex items-center justify-between text-[#8A7A62] mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Âge Moyen</span>
              <Activity className="h-4 w-4 text-[#C59448]" />
            </div>
            <div className="font-mono text-3xl font-bold text-[#F4EFEA]">
              {Math.round(stats.average_age)} ans
            </div>
            <p className="text-[11px] text-[#766754] mt-1">
              De {stats.age_min} à {stats.age_max} ans
            </p>
          </div>
        </div>

        {/* Section Graphique Comparatif */}
        <div className="rounded-xl border border-[#2E241B] bg-[#19140F] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2A2016]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C59448]">
                Palmarès & Comparatifs
              </span>
              <h2 className="font-serif text-xl font-bold text-[#F4EFEA]">
                Top Cercles Belges
              </h2>
            </div>

            {/* Onglets de sélection métrique */}
            <div className="flex rounded-lg border border-[#33271D] bg-[#14110E] p-1">
              {metricTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTopMetrics(tab.key)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                    topMetrics === tab.key
                      ? "bg-[#C59448] text-[#14110E] font-bold shadow"
                      : "text-[#8A7A62] hover:text-[#EDE3D3]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graphique Recharts épuré */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topClubs}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="nom"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#C2B5A5", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                  width={180}
                />
                <Tooltip
                  cursor={{ fill: "rgba(197, 148, 72, 0.08)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as Club;
                      return (
                        <div className="rounded-lg border border-[#3E3022] bg-[#1A140F] p-3 shadow-xl text-xs font-sans">
                          <div className="font-serif font-bold text-[#F4EFEA] mb-1">
                            {data.nom}
                          </div>
                          <div className="font-mono text-[#C59448] font-bold">
                            {data[topMetrics]} {metricTabs.find((t) => t.key === topMetrics)?.unit}
                          </div>
                          <div className="text-[10px] text-[#8A7A62] mt-0.5 font-mono">
                            #{data.matricule} · {data.ville}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey={topMetrics} radius={[0, 4, 4, 0]}>
                  {topClubs.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#C59448"
                          : index === 1
                          ? "#A87C3C"
                          : index === 2
                          ? "#8C652E"
                          : "#3A2E22"
                      }
                    />
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