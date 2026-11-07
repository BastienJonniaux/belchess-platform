import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, X, Shield, ArrowRight } from "lucide-react";

interface ClubItem {
  matricule: number;
  nom: string;
  ville: string;
  ligue: string;
  player_count?: number;
}

export default function Navbar() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const links = [
    { label: "Accueil", to: "/" },
    { label: "Clubs", to: "/clubs" },
  ];

  // Chargement paresseux de la liste des clubs pour la recherche
  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ClubItem[]) => setClubs(data))
      .catch(() => setClubs([]));
  }, []);

  // Fermeture du dropdown lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClubs = query.trim()
    ? clubs
        .filter(
          (c) =>
            c.nom?.toLowerCase().includes(query.toLowerCase()) ||
            c.ville?.toLowerCase().includes(query.toLowerCase()) ||
            String(c.matricule).includes(query.trim())
        )
        .slice(0, 6)
    : [];

  const handleSelectClub = (matricule: number) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/clubs/${matricule}`);
  };

  return (
    <nav className="border-b border-[#2E241B] bg-[#16120E]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        {/* Logo & Marque */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-transform active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C59448] text-[#14110E] shadow-sm shadow-[#C59448]/20 group-hover:bg-[#D4A359] transition-colors">
              <span className="text-sm font-bold">♞</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-[#F4EFEA] leading-tight">
                BelChess
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#8A7A62] font-mono">
                Data · Fiches · FRBE
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "relative py-1 text-sm font-medium text-[#F4EFEA] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#C59448]"
                    : "py-1 text-sm text-[#A89882] hover:text-[#F4EFEA] transition-colors"
                }
              >
                {link.label}
              </NavLink>
            ))}
            <span
              className="py-1 text-sm text-[#5C5042] cursor-not-allowed select-none hidden md:inline"
              title="Bientôt disponible"
            >
              Joueurs{" "}
              <span className="text-[9px] uppercase tracking-wider text-[#C59448]/50 border border-[#C59448]/20 px-1 py-0.5 rounded">
                bientôt
              </span>
            </span>
          </div>
        </div>

        {/* Barre de recherche interactive */}
        <div ref={searchRef} className="relative w-48 sm:w-64">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-[#8A7A62] pointer-events-none" />
            <input
              type="text"
              placeholder="Chercher un club, matricule..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full rounded-md border border-[#3A2F23] bg-[#201A14] pl-9 pr-7 py-1.5 text-xs text-[#F4EFEA] placeholder-[#766754] focus:border-[#C59448] focus:bg-[#251E17] focus:outline-none focus:ring-1 focus:ring-[#C59448]/40 transition-all font-sans"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
                className="absolute right-2 text-[#8A7A62] hover:text-[#F4EFEA]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown de résultats */}
          {isOpen && query.trim() !== "" && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-lg border border-[#3A2F23] bg-[#1C1611] p-1.5 shadow-2xl shadow-black/80 z-50">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#8A7A62] border-b border-[#2E241B] mb-1">
                Clubs correspondants ({filteredClubs.length})
              </div>
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => (
                  <button
                    key={club.matricule}
                    onClick={() => handleSelectClub(club.matricule)}
                    className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left hover:bg-[#2A2118] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#2A2118] border border-[#3A2F23] text-[#C59448]">
                        <Shield className="h-3 w-3" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#EDE3D3] group-hover:text-[#C59448] transition-colors truncate">
                          {club.nom}
                        </div>
                        <div className="text-[10px] text-[#8A7A62] font-mono">
                          #{club.matricule} · {club.ville}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#5C5042] group-hover:text-[#C59448] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-[#8A7A62]">
                  Aucun club trouvé pour « {query} »
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
