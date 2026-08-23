import StatCard from "./StatCard";

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
    <div className="border-b border-[#3A3025] px-6 py-5">
      {/* Identity */}
      <div className="mb-4 flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#3A3025]">
          <span className="text-2xl text-[#BD8C3E]">🛡</span>
        </div>
        <div>
          <div className="font-serif text-lg font-semibold text-[#EDE3D3]">
            {club.name}
          </div>
          <div className="text-xs text-[#8A7A62]">
            Club #{club.matricule} · {club.ville} · {club.ligue}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-2">
        <StatCard label="Joueurs" value={club.playerCount} />
        <StatCard label="Elo moyen" value={club.avgElo} valueColor="text-[#BD8C3E]" />
        <StatCard label="Âge moyen" value={club.avgAge} />
        <StatCard label="Titrés" value={club.titleCount} />
        <StatCard
          label="Belges / Étrangers"
          value={`${club.belgianCount} / ${club.foreignCount}`}
        />
      </div>
    </div>
  );
}
