import { useAppStore } from '../../store/useAppStore'
import { MESES } from '../../types'

interface TopbarProps {
  onAddLancamento?: () => void
}

export default function Topbar({ onAddLancamento }: TopbarProps) {
  const { mesAtivo, anoAtivo, setMesAno } = useAppStore()

  function prevMes() {
    if (mesAtivo === 1) setMesAno(12, anoAtivo - 1)
    else setMesAno(mesAtivo - 1, anoAtivo)
  }

  function nextMes() {
    if (mesAtivo === 12) setMesAno(1, anoAtivo + 1)
    else setMesAno(mesAtivo + 1, anoAtivo)
  }

  return (
    <header className="bg-[#161b27] border-b border-[#1e2535] px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
      {/* Logo só no mobile (substitui sidebar) */}
      <div className="md:hidden flex items-center gap-2 mr-1">
        <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center text-sm">💰</div>
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center gap-1.5 flex-1 md:flex-none">
        <button
          onClick={prevMes}
          className="w-7 h-7 bg-[#1e2535] rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#253045] transition-colors text-sm flex items-center justify-center"
        >
          ‹
        </button>
        <span className="text-[14px] md:text-[15px] font-bold text-slate-100 min-w-[110px] md:min-w-[130px] text-center">
          {MESES[mesAtivo - 1]} {anoAtivo}
        </span>
        <button
          onClick={nextMes}
          className="w-7 h-7 bg-[#1e2535] rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#253045] transition-colors text-sm flex items-center justify-center"
        >
          ›
        </button>
      </div>

      <div className="ml-auto">
        <button
          onClick={onAddLancamento}
          className="bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          + Lançamento
        </button>
      </div>
    </header>
  )
}
