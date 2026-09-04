interface StatWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string; 
}

export default function StatWidget({ title, value, subtitle }: StatWidgetProps) {
  return (
    <div className="bg-[#241D16] rounded-lg p-4">
      <h3 className="text-[#8A7A62] text-sm">{title}</h3>
      <p className="text-[#BD8C3E] text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-[#8A7A62] text-xs">{subtitle}</p>}
    </div>
  )
}