import { useState, useEffect } from "react";
import { FileText, CheckCircle2, TrendingUp, AlertCircle, RefreshCw, Compass } from "lucide-react";

export interface ClubAnalysis {
  overview: string;
  strengths: string[];
  areas_for_growth: string[];
}

interface ClubAiReportProps {
  clubMatricule: number;
}

export default function ClubAiReport({ clubMatricule }: ClubAiReportProps) {
  const [analysis, setAnalysis] = useState<ClubAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Réinitialise le rapport si l'utilisateur navigue vers un autre club
  useEffect(() => {
    setAnalysis(null);
    setError(null);
  }, [clubMatricule]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/clubs/${clubMatricule}/analysis`);
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error("L'analyse est temporairement indisponible. Veuillez réessayer dans un instant.");
        }
        throw new Error("Impossible d'établir le dossier d'évaluation pour ce club.");
      }
      const data: ClubAnalysis = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-b border-[#2E241B] bg-[#17130F] p-6 sm:p-7">
      {/* En-tête du rapport */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#241C15] border border-[#3E3022] text-[#C59448]">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C59448] font-semibold">
                Scouting & Analyse de Club
              </span>
              <span className="text-[10px] font-mono text-[#6E5E4D]">· Fiche #{clubMatricule}</span>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#F4EFEA] tracking-tight">
              Dossier d'Évaluation Stratégique
            </h3>
          </div>
        </div>

        {/* Bouton de déclenchement sobre */}
        {!analysis && !loading && (
          <button
            onClick={fetchAnalysis}
            className="inline-flex items-center gap-2 rounded-md border border-[#C59448]/40 bg-[#C59448]/10 px-3.5 py-2 text-xs font-mono font-medium text-[#F4EFEA] hover:bg-[#C59448]/20 hover:border-[#C59448] transition-all shadow-sm active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <FileText className="h-3.5 w-3.5 text-[#C59448]" />
            <span>Générer le dossier d'évaluation</span>
          </button>
        )}
      </div>

      {/* État de chargement sobre */}
      {loading && (
        <div className="mt-5 rounded-lg border border-[#2E241B] bg-[#14110E] p-5">
          <div className="flex items-center gap-3 text-xs font-mono text-[#A89882]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#C59448] border-t-transparent"></div>
            <span>Analyse de l'effectif, des cotes Elo et des dynamiques du club en cours...</span>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mt-5 flex items-center justify-between rounded-lg border border-[#5C2B22] bg-[#2A1612]/40 p-4 text-xs text-[#E38B7C]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-[#E38B7C] shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAnalysis}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] underline hover:text-[#F5ACA0] transition-colors ml-3 cursor-pointer shrink-0"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* Corps du dossier */}
      {analysis && (
        <div className="mt-6 space-y-5 animate-in fade-in duration-300">
          {/* Synthèse générale / Note de synthèse */}
          <div className="relative rounded-lg border-l-2 border-[#C59448] border-y border-r border-[#2E241B] bg-[#1D1711] p-4 sm:p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8A7A62] mb-1.5">
              Synthèse de l'Observateur
            </div>
            <p className="font-sans text-sm leading-relaxed text-[#EDE3D3]/95">
              {analysis.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Forces & Dynamique */}
            <div className="rounded-lg border border-[#2E241B] bg-[#1A1510] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#2A2016]">
                <CheckCircle2 className="h-4 w-4 text-[#7C9B72]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#7C9B72]">
                  Forces & Dynamique du Club
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-[#EDE3D3]/85 leading-relaxed">
                {analysis.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#7C9B72] font-mono mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Axes de Progression */}
            <div className="rounded-lg border border-[#2E241B] bg-[#1A1510] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#2A2016]">
                <TrendingUp className="h-4 w-4 text-[#C59448]" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C59448]">
                  Perspectives & Axes de Développement
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-[#EDE3D3]/85 leading-relaxed">
                {analysis.areas_for_growth.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-[#C59448] font-mono mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 text-right">
            <span className="text-[10px] font-mono text-[#6E5E4D]">
              BelChess Analytics · Évaluation calculée sur les 50 premiers échiquiers enregistrés
            </span>
          </div>
        </div>
      )}
    </section>
  );
}