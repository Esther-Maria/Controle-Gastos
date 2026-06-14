import { useAppStore } from '../../store/useAppStore'
import { MESES } from '../../types'

interface TopbarProps {
  onAddLancamento?: () => void
}

export default function Topbar({ onAddLancamento }: TopbarProps) {
  const { mesAtivo, anoAtivo, setMesAno, paginaAtiva } = useAppStore()

  function prevMes() {
    if (mesAtivo === 1) setMesAno(12, anoAtivo - 1)
    else setMesAno(mesAtivo - 1, anoAtivo)
  }

  function nextMes() {
    if (mesAtivo === 12) setMesAno(1, anoAtivo + 1)
    else setMesAno(mesAtivo + 1, anoAtivo)
  }

  const titulos: Record<string, string> = {
    dashboard: 'Dashboard',
    despesas: 'Despesas',
    receitas: 'Receitas',
    investimentos: 'Investimentos',
    parcelamentos: 'Parcelamentos',
    relatorios: 'Relatórios',
  }

  return (
    <header className="bg-[#161b27] border-b border-[#1e2535] px-5 py-2.5 flex items-center gap-3 flex-shrink-0">
      {/* Month nav */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevMes}
          className="w-7 h-7 bg-[#1e2535] rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#253045] transition-colors text-xs flex items-center justify-center"
        >
          ‹
        </button>
        <span className="text-[15px] font-bold text-slate-100 min-w-[130px] text-center">
          {MESES[mesAtivo - 1]} {anoAtivo}
        </span>
        <button
          onClick={nextMes}
          className="w-7 h-7 bg-[#1e2535] rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#253045] transition-colors text-xs flex items-center justify-center"
        >
          ›
        </button>
      </div>

      <span className="text-[10px] text-slate-500 bg-[#1e2535] px-2.5 py-1 rounded-md">
        {titulos[paginaAtiva] || ''}
      </span>

      <div className="ml-auto flex gap-2 items-center">
        <button
          onClick={onAddLancamento}
          className="bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          + Lançamento
        </button>
      </div>
    </header>
  )
}
