interface TitleBadgeProps {
  title?: string | null;
}

export function TitleBadge({ title }: TitleBadgeProps) {
  if (!title) return null;
  const cleanTitle = title.trim().toUpperCase();

  const titleStyles: Record<string, { bg: string; text: string; border: string; label: string }> = {
    GM: {
      bg: "bg-[#C59448]/20",
      text: "text-[#F3CA7E]",
      border: "border-[#C59448]/50",
      label: "Grand Maître",
    },
    IM: {
      bg: "bg-[#B87A38]/20",
      text: "text-[#E8A55B]",
      border: "border-[#B87A38]/50",
      label: "Maître International",
    },
    FM: {
      bg: "bg-[#9A6237]/20",
      text: "text-[#D3996C]",
      border: "border-[#9A6237]/50",
      label: "Maître FIDE",
    },
    CM: {
      bg: "bg-[#5E4E3F]/30",
      text: "text-[#D6CABE]",
      border: "border-[#5E4E3F]/60",
      label: "Candidat Maître",
    },
    WGM: {
      bg: "bg-[#8A4A6E]/20",
      text: "text-[#E69EC0]",
      border: "border-[#8A4A6E]/50",
      label: "Grand Maître Féminin",
    },
    WIM: {
      bg: "bg-[#8A4A6E]/15",
      text: "text-[#DC87B0]",
      border: "border-[#8A4A6E]/40",
      label: "Maître International Féminin",
    },
    WFM: {
      bg: "bg-[#8A4A6E]/10",
      text: "text-[#CF79A3]",
      border: "border-[#8A4A6E]/30",
      label: "Maître FIDE Féminin",
    },
    WCM: {
      bg: "bg-[#5E4E3F]/30",
      text: "text-[#D6CABE]",
      border: "border-[#5E4E3F]/60",
      label: "Candidat Maître Féminin",
    },
  };

  const style = titleStyles[cleanTitle] || {
    bg: "bg-[#2E241B]",
    text: "text-[#C59448]",
    border: "border-[#3E3125]",
    label: cleanTitle,
  };

  return (
    <span
      title={style.label}
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}
    >
      {cleanTitle}
    </span>
  );
}

export function EloRatingBadge({ elo }: { elo: number }) {
  if (!elo || elo <= 0) {
    return <span className="font-mono text-xs text-[#6E5E4D]">—</span>;
  }

  // Échelons Elo FIDE / National
  let textColor = "text-[#A89882]";
  let label = "Club";
  let tierDot = "";

  if (elo >= 2400) {
    textColor = "text-[#F5D084] font-bold";
    label = "Niveau Maître International / GM";
    tierDot = "bg-[#F5D084]";
  } else if (elo >= 2200) {
    textColor = "text-[#E4A950] font-semibold";
    label = "Niveau Maître National / FIDE";
    tierDot = "bg-[#E4A950]";
  } else if (elo >= 2000) {
    textColor = "text-[#D19745]";
    label = "Expert / Candidat Maître";
    tierDot = "bg-[#D19745]";
  } else if (elo >= 1800) {
    textColor = "text-[#F4EFEA]";
    label = "Joueur de Club chevronné";
  } else {
    textColor = "text-[#C2B5A5]";
    label = "Joueur de Club";
  }

  return (
    <span title={`${label} (${elo} Elo)`} className="inline-flex items-center gap-1.5 font-mono">
      {tierDot && <span className={`h-1.5 w-1.5 rounded-full ${tierDot}`} />}
      <span className={`text-xs ${textColor}`}>{Math.round(elo)}</span>
    </span>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#C59448]/20 border border-[#C59448]/60 text-[#F5D084] text-[11px] font-mono font-bold">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#8E9499]/20 border border-[#8E9499]/50 text-[#D8E0E6] text-[11px] font-mono font-bold">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#A86B42]/20 border border-[#A86B42]/50 text-[#E39D6F] text-[11px] font-mono font-bold">
        3
      </span>
    );
  }
  return (
    <span className="text-[11px] font-mono text-[#766754] pl-1">
      #{rank}
    </span>
  );
}

export function NationalityBadge({ nationality }: { nationality: string }) {
  const isBelgian = nationality === "BEL";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-mono uppercase ${
        isBelgian ? "text-[#EDE3D3]" : "text-[#C59448]"
      }`}
    >
      <span className="text-[10px]">{isBelgian ? "🇧🇪" : "🌐"}</span>
      <span>{nationality || "—"}</span>
    </span>
  );
}
