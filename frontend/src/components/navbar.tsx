export default function Navbar() {
  const links = [
    { label: "Accueil", href: "/", active: true },
    { label: "Clubs", href: "/clubs", active: false },
    { label: "Joueurs", href: "/players", active: false },
    { label: "Régions", href: "/regions", active: false },
  ];

  return (
    <nav className="border-b border-[#3A3025] bg-[#1C1712]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#BD8C3E]">
            <span className="text-xs font-bold text-[#1C1712]">♞</span>
          </div>
          <span className="font-serif text-base font-semibold text-[#EDE3D3]">
            BelChess
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={
                link.active
                  ? "border-b-2 border-[#BD8C3E] pb-1 text-sm text-[#EDE3D3]"
                  : "pb-1 text-sm text-[#B3A48C] hover:text-[#EDE3D3]"
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Search placeholder */}
        <div className="flex w-44 items-center gap-2 rounded-md border border-[#3A3025] bg-[#241D16] px-3 py-1.5">
          <span className="text-[#8A7A62]">🔍</span>
          <span className="text-xs text-[#8A7A62]">Rechercher un club…</span>
        </div>
      </div>
    </nav>
  );
}
