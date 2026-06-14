import { useAppStore } from '../../store/useAppStore'
import ImportarCSV from '../ImportarCSV'

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'despesas', icon: '💸', label: 'Despesas' },
  { id: 'receitas', icon: '💵', label: 'Receitas' },
  { id: 'investimentos', icon: '📈', label: 'Investimentos' },
  { id: 'parcelamentos', icon: '🔄', label: 'Parcelamentos' },
  { id: 'relatorios', icon: '📋', label: 'Relatórios' },
]

export default function Sidebar() {
  const { paginaAtiva, setPagina, parcelas } = useAppStore()

  return (
    <aside className="w-48 bg-[#161b27] border-r border-[#1e2535] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-4 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-base">💰</div>
          <div>
            <div className="font-bold text-[13px] text-slate-100 leading-tight">Controle</div>
            <div className="text-[10px] text-slate-500">de Gastos</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        <div className="text-[9px] text-slate-600 uppercase tracking-widest px-2 pb-1 pt-1">Principal</div>
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setPagina(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] transition-all ${
              paginaAtiva === item.id
                ? 'bg-green-500/10 text-green-400'
                : 'text-slate-400 hover:bg-[#1e2535] hover:text-slate-200'
            }`}
          >
            <span className="text-sm w-4 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="text-[9px] text-slate-600 uppercase tracking-widest px-2 pt-3 pb-1">Ferramentas</div>
        {navItems.slice(4).map((item) => (
          <button
            key={item.id}
            onClick={() => setPagina(item.id)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] transition-all ${
              paginaAtiva === item.id
                ? 'bg-green-500/10 text-green-400'
                : 'text-slate-400 hover:bg-[#1e2535] hover:text-slate-200'
            }`}
          >
            <span className="text-sm w-4 text-center">{item.icon}</span>
            {item.label}
            {item.id === 'parcelamentos' && parcelas.length > 0 && (
              <span className="ml-auto bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                {parcelas.length}
              </span>
            )}
          </button>
        ))}
        <div className="text-[9px] text-slate-600 uppercase tracking-widest px-2 pt-3 pb-1">Dados</div>
        <ImportarCSV />
      </nav>
    </aside>
  )
}
