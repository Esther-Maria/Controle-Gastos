import { Parcela } from '../types'
import { getParcelasDoMes } from '../utils/parcelamentos'

const LABELS = ['J','F','M','A','M','J','J','A','S','O','N','D']

interface MonthPillsProps {
  parcela: Parcela
  mesAtivo: number
  anoAtivo: number
}

export default function MonthPills({ parcela, mesAtivo, anoAtivo }: MonthPillsProps) {
  return (
    <div className="flex gap-0.5">
      {LABELS.map((label, i) => {
        const mes = i + 1
        const ativas = getParcelasDoMes([parcela], mes, anoAtivo)
        const on = ativas.length > 0
        const isAtual = mes === mesAtivo
        return (
          <div
            key={i}
            className={`w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold transition-all ${
              on
                ? isAtual
                  ? 'bg-green-500/30 text-green-400 ring-1 ring-green-400'
                  : 'bg-green-500/20 text-green-500'
                : 'bg-[#1e2535] text-slate-600'
            }`}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
