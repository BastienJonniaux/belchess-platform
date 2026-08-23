import { useState, useMemo } from "react";

export interface Column<T> {
  key: keyof T; // La clé doit exister dans l'objet T (ex: 'nom', 'elo')
  label: string; // Le texte affiché dans l'en-tête
  render?: (item: T) => React.ReactNode; // Optionnel : si on veut un affichage spécial (ex: un lien cliquable)
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export default function SortableTable<T>({ data, columns }: SortableTableProps<T>) {
  // Les états de tri (uniquement les paramètres, pas les données !)
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // La logique de tri 
  // On utilise useMemo pour des questions de performances (le tri n'est refait que si data, sortKey ou sortDirection changent)
  const sortedData = useMemo(() => {
    if (!sortKey) return data; // Si aucun tri, on renvoie les données de base

    // On crée une copie pour ne pas modifier l'original
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      // Tri pour les textes (strings)
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Tri pour les nombres (et le cas où les valeurs sont nulles ou undefined)
      const numA = valA as number;
      const numB = valB as number;
      return sortDirection === "asc" ? numA - numB : numB - numA;
    });
  }, [data, sortKey, sortDirection]);

  // La fonction déclenchée au clic sur une colonne
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc"); // Par défaut, on trie en descendant quand on change de colonne
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#3A3025] bg-[#241D16]">
      <table className="min-w-full text-left">
        <thead className="bg-[#1C1712] border-b border-[#3A3025]">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="p-4 cursor-pointer hover:text-[#BD8C3E] uppercase text-xs tracking-wider text-[#8A7A62]"
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1 text-[#BD8C3E]">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className={`border-t border-[#18140F] hover:bg-[#2A221A] transition-colors ${
                index % 2 === 1 ? "bg-[#1f1913]" : ""
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="p-4 text-[#EDE3D3]">
                  {/* Si la colonne a une fonction 'render' spéciale, on l'utilise, sinon on affiche la valeur brute */}
                  {col.render ? col.render(item) : String(item[col.key] ?? "0")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}