interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  hintColor?: "positive" | "negative" | "neutral";
  valueColor?: string; // e.g. "text-[#BD8C3E]" to highlight (Elo, etc.)
}

const HINT_COLORS = {
  positive: "text-[#7C9B72]",
  negative: "text-[#A85C4F]",
  neutral: "text-[#8A7A62]",
};

export default function StatCard({
  label,
  value,
  hint,
  hintColor = "neutral",
  valueColor = "text-[#EDE3D3]",
}: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-[#3A3025] bg-[#241D16] p-3.5">
      <div className="text-xs text-[#B3A48C]">{label}</div>
      <div className={`mt-1.5 font-mono text-xl font-medium ${valueColor}`}>
        {value}
      </div>
      {hint && (
        <div className={`mt-1 text-[11px] ${HINT_COLORS[hintColor]}`}>{hint}</div>
      )}
    </div>
  );
}
