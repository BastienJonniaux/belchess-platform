import StatCard from "./StatCard";
import { MapPin } from "lucide-react";

export interface ClubInfo {
  matricule: number;
  name: string;
  ville: string;
  ligue: string;
  federation: string;
  playerCount: number;
  avgElo: number;
  avgAge: number;
  belgianCount: number;
  foreignCount: number;
  titleCount: number;
}

interface ClubHeaderProps {
  club: ClubInfo;
}

export default function ClubHeader({ club }: ClubHeaderProps) {
  return (
    <div className="border-b border-[#2E241B] bg-[#19140F] px-6 py-6">
      {/* Identity */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#231A12] border border-[#3E3022] shadow-inner text-[#C59448]">
            <span className="text-3xl">♞</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#281F17] border border-[#3E3022] text-[#C59448]">
                Matricule #{club.matricule}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#201A13] border border-[#33271D] text-[#A89882]">
                {club.ligue || "Ligue FRBE"}
              </span>
              {club.federation && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#201A13] border border-[#33271D] text-[#8A7A62]">
                  {club.federation}
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFEA] tracking-tight">
              {club.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#8A7A62] mt-1">
              <MapPin className="h-3 w-3 text-[#C59448]" />
              <span>{club.ville || "Belgique"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Effectif total" value={`${club.playerCount} joueurs`} />
        <StatCard
          label="Elo moyen équipe"
          value={club.avgElo ? Math.round(club.avgElo) : "—"}
          valueColor="text-[#E6B86C]"
        />
        <StatCard
          label="Âge moyen"
          value={club.avgAge ? `${Math.round(club.avgAge)} ans` : "—"}
        />
        <StatCard
          label="Joueurs titrés"
          value={club.titleCount || 0}
          valueColor={club.titleCount && club.titleCount > 0 ? "text-[#F5D084]" : "text-[#EDE3D3]"}
        />
        <StatCard
          label="Nationalités"
          value={`${club.belgianCount} BEL · ${club.foreignCount} INT`}
        />
      </div>
    </div>
  );
}
