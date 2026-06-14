import { formatBRL } from '../utils/currency'

interface KpiCardProps {
  label: string
  value: number
  color: 'green' | 'red' | 'blue' | 'yellow'
  sub?: string
}

const colors = {
  green: { dot: 'bg-green-500', value: 'text-green-400' },
  red: { dot: 'bg-red-500', value: 'text-red-400' },
  blue: { dot: 'bg-blue-500', value: 'text-blue-400' },
  yellow: { dot: 'bg-yellow-500', value: 'text-yellow-400' },
}

export default function KpiCard({ label, value, color, sub }: KpiCardProps) {
  const c = colors[color]
  return (
    <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider mb-2">
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        {label}
      </div>
      <div className={`text-xl font-bold ${c.value}`}>{formatBRL(value)}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}
