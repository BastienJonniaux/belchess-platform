export interface PlayerRow {
  rank: number;
  matricule: number;
  lastName: string;
  firstName: string;
  age: number;
  elo: number;
  nationality: "BE" | "FR" | string;
  games: number;
  lastGame: string; // "dd/mm"
  totalgames: number;
}

interface PlayerTableProps {
  players: PlayerRow[];
}

const COLUMNS = [
  { key: "rank", label: "#", align: "left" },
  { key: "name", label: "Joueur", align: "left" },
  { key: "age", label: "Âge", align: "right" },
  { key: "elo", label: "Elo", align: "right" },
  { key: "nationality", label: "Nat.", align: "right" },
  { key: "games", label: "Parties", align: "right" },
  { key: "lastGame", label: "Dernière", align: "right" },
  { key: "totalgames", label: "Total", align: "right" },
] as const;

export default function PlayerTable({ players }: PlayerTableProps) {
  return (
    <div className="px-6 pb-6 pt-3.5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#3A3025]">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-1 pb-1.5 text-[11px] uppercase tracking-wide text-[#8A7A62] ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr
              key={p.matricule}
              className={`border-b border-[#18140F] ${
                i % 2 === 1 ? "bg-[#241D16]" : ""
              }`}
            >
              <td className="px-1 py-2.5 font-mono text-xs text-[#8A7A62]">
                {p.rank}
              </td>
              <td className="px-1 py-2.5 text-sm text-[#EDE3D3]">
                {p.lastName}, {p.firstName}
              </td>
              <td className="px-1 py-2.5 text-right font-mono text-xs text-[#EDE3D3]">
                {p.age}
              </td>
              <td className="px-1 py-2.5 text-right font-mono text-sm text-[#BD8C3E]">
                {p.elo}
              </td>
              <td className="px-1 py-2.5 text-right text-[11px] text-[#B3A48C]">
                {p.nationality}
              </td>
              <td className="px-1 py-2.5 text-right font-mono text-xs text-[#EDE3D3]">
                {p.games}
              </td>
              <td className="px-1 py-2.5 text-right text-[11px] text-[#8A7A62]">
                {p.lastGame}
              </td>
              <td className="px-1 py-2.5 text-right font-mono text-xs text-[#EDE3D3]">
                {p.totalgames}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
