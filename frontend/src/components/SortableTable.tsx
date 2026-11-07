import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  emptyMessage?: string;
}

export default function SortableTable<T>({
  data,
  columns,
  searchPlaceholder,
  searchFilter,
  emptyMessage = "Aucun résultat trouvé.",
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrage des données par recherche textuelle
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();

    if (searchFilter) {
      return data.filter((item) => searchFilter(item, q));
    }

    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, searchQuery, searchFilter, columns]);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined || valA === "") return 1;
      if (valB === null || valB === undefined || valB === "") return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      const numA = Number(valA);
      const numB = Number(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }

      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  return (
    <div className="rounded-xl border border-[#2E241B] bg-[#18130F] shadow-lg shadow-black/40 overflow-hidden">
      {/* Barre d'action supérieure si la recherche est activée */}
      {searchPlaceholder && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#2E241B] bg-[#1C1611] px-4 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A7A62] pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#3A2F23] bg-[#14110E] pl-9 pr-3 py-1.5 text-xs text-[#F4EFEA] placeholder-[#766754] focus:border-[#C59448] focus:outline-none focus:ring-1 focus:ring-[#C59448]/30 transition-all font-sans"
            />
          </div>
          <div className="text-right text-[11px] font-mono text-[#8A7A62]">
            <span className="text-[#C59448] font-semibold">{sortedData.length}</span>{" "}
            {sortedData.length > 1 ? "éléments" : "élément"}
            {searchQuery && ` (sur ${data.length})`}
          </div>
        </div>
      )}

      {/* Tableau scrollable horizontalement */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs border-collapse">
          <thead className="bg-[#1C1611] border-b border-[#2E241B]">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left";
                return (
                  <th
                    key={String(col.key)}
                    className={`p-3.5 cursor-pointer hover:bg-[#251E17] hover:text-[#C59448] transition-colors uppercase text-[11px] font-mono tracking-wider text-[#9E8D76] select-none whitespace-nowrap ${alignClass}`}
                    onClick={() => handleSort(col.key)}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === "center"
                          ? "justify-center"
                          : col.align === "right"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <span>{col.label}</span>
                      {isSorted ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-[#C59448]" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-[#C59448]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-2.5 w-2.5 text-[#5C5042] opacity-40 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#241C15]">
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-[#251E16] transition-colors ${
                    index % 2 === 1 ? "bg-[#16120E]/70" : "bg-transparent"
                  }`}
                >
                  {columns.map((col) => {
                    const rawVal = item[col.key];
                    const alignClass =
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left";
                    return (
                      <td
                        key={String(col.key)}
                        className={`p-3.5 text-[#EDE3D3] whitespace-nowrap font-sans ${alignClass}`}
                      >
                        {col.render
                          ? col.render(item)
                          : rawVal !== null && rawVal !== undefined && rawVal !== ""
                          ? String(rawVal)
                          : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-xs text-[#8A7A62] font-sans"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}