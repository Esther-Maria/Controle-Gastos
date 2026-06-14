import { useState } from 'react'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Layout/Sidebar'
import Topbar from './components/Layout/Topbar'
import Dashboard from './pages/Dashboard'
import Parcelamentos from './pages/Parcelamentos'
import LancamentosPage from './pages/LancamentosPage'
import Investimentos from './pages/Investimentos'
import Relatorios from './pages/Relatorios'
import Ajuda from './pages/Ajuda'
import Modal from './components/Modal'
import { FormField, Select } from './components/FormField'
import { useAppStore as store } from './store/useAppStore'

function LancamentoRapidoModal({ onClose }: { onClose: () => void }) {
  const { setPagina } = useAppStore()
  return (
    <Modal title="Adicionar Lançamento" onClose={onClose}>
      <div className="space-y-2">
        <p className="text-slate-400 text-sm mb-4">Escolha o tipo de lançamento:</p>
        {[
          { label: '💵 Receita', page: 'receitas', color: 'bg-green-600 hover:bg-green-500' },
          { label: '💸 Despesa', page: 'despesas', color: 'bg-red-600 hover:bg-red-500' },
          { label: '📈 Investimento', page: 'investimentos', color: 'bg-blue-600 hover:bg-blue-500' },
          { label: '🔄 Parcelamento', page: 'parcelamentos', color: 'bg-purple-600 hover:bg-purple-500' },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => { setPagina(item.page); onClose() }}
            className={`w-full ${item.color} text-white font-semibold py-2.5 rounded-lg transition-colors text-sm`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </Modal>
  )
}

export default function App() {
  const { paginaAtiva } = useAppStore()
  const [showLancamento, setShowLancamento] = useState(false)

  const renderPage = () => {
    switch (paginaAtiva) {
      case 'dashboard': return <Dashboard />
      case 'parcelamentos': return <Parcelamentos />
      case 'despesas': return <LancamentosPage tipo="despesa" />
      case 'receitas': return <LancamentosPage tipo="receita" />
      case 'investimentos': return <Investimentos />
      case 'relatorios': return <Relatorios />
      case 'ajuda': return <Ajuda />
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onAddLancamento={() => setShowLancamento(true)} />
        {/* pb-16 no mobile para não ficar atrás da barra inferior */}
        <div className="flex flex-col flex-1 min-h-0 pb-16 md:pb-0">
          {renderPage()}
        </div>
      </div>
      {showLancamento && <LancamentoRapidoModal onClose={() => setShowLancamento(false)} />}
    </div>
  )
}
