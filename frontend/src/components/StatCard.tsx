interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  hintColor?: "positive" | "negative" | "neutral";
  valueColor?: string;
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
  valueColor = "text-[#F4EFEA]",
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-[#2E241B] bg-[#1A140F] p-3.5 shadow-sm transition-all hover:border-[#3E3125]">
      <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A7A62]">
        {label}
      </div>
      <div className={`mt-1 font-mono text-xl font-semibold tracking-tight ${valueColor}`}>
        {value}
      </div>
      {hint && (
        <div className={`mt-1 text-[11px] font-sans ${HINT_COLORS[hintColor]}`}>
          {hint}
        </div>
      )}
    </div>
  );
}
