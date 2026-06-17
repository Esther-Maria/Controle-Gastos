import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Lancamento } from '../types'
import { formatBRL, parseBRL } from '../utils/currency'
import Modal from '../components/Modal'
import { FormField, Input, Select } from '../components/FormField'

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const CATEGORIAS_RECEITA = ['Salário','Freelance','Investimentos','Aluguel recebido','Outros']
const CATEGORIAS_DESPESA = ['Moradia','Alimentação','Transporte','Saúde','Educação','Lazer','Roupas','Streaming','Academia','Internet','Outros']

interface Props {
  tipo: 'receita' | 'despesa'
}

export default function LancamentosPage({ tipo }: Props) {
  const { mesAtivo, anoAtivo, lancamentos, addLancamento, updateLancamento, deleteLancamento } = useAppStore()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editando, setEditando] = useState<Lancamento | null>(null)
  const [valorInput, setValorInput] = useState('')
  const [form, setForm] = useState<Omit<Lancamento, 'id'>>({
    tipo,
    descricao: '',
    categoria: tipo === 'receita' ? 'Salário' : 'Moradia',
    valor: 0,
    mes: mesAtivo,
    ano: anoAtivo,
  })

  const categorias = tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  const itens = lancamentos.filter(
    (l) => l.tipo === tipo && l.mes === mesAtivo && l.ano === anoAtivo
  )

  const total = itens.reduce((a, l) => a + l.valor, 0)

  const catMap: Record<string, number> = {}
  itens.forEach((l) => { catMap[l.categoria] = (catMap[l.categoria] || 0) + l.valor })

  function abrirAdd() {
    setForm({ tipo, descricao: '', categoria: categorias[0], valor: 0, mes: mesAtivo, ano: anoAtivo })
    setValorInput('')
    setModal('add')
  }

  function abrirEdit(l: Lancamento) {
    setEditando(l)
    setForm({ ...l })
    setValorInput(l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
    setModal('edit')
  }

  function fechar() { setModal(null); setEditando(null) }

  function salvar() {
    if (!form.descricao || form.valor <= 0) return
    if (modal === 'add') addLancamento({ ...form, id: newId() })
    else if (editando) updateLancamento({ ...form, id: editando.id })
    fechar()
  }

  function remover(id: string) {
    if (confirm('Remover este lançamento?')) deleteLancamento(id)
  }

  const cor = tipo === 'receita' ? 'text-green-400' : 'text-red-400'
  const bgCor = tipo === 'receita' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* Totais por categoria */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4 col-span-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total no mês</p>
          <p className={`text-xl font-bold ${cor}`}>{formatBRL(total)}</p>
        </div>
        {Object.entries(catMap).slice(0, 3).map(([cat, val]) => (
          <div key={cat} className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 truncate">{cat}</p>
            <p className={`text-base font-bold ${cor}`}>{formatBRL(val)}</p>
          </div>
        ))}
      </div>

      {/* Botão */}
      <div className="flex justify-end">
        <button onClick={abrirAdd} className={`${bgCor} text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors`}>
          + {tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa'}
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-x-auto">
        {itens.length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-sm">
            Nenhum lançamento.{' '}
            <button onClick={abrirAdd} className={tipo === 'receita' ? 'text-green-500 underline' : 'text-red-500 underline'}>Adicionar</button>
          </div>
        ) : (
          <table className="w-full text-[11px] min-w-[300px]">
            <thead>
              <tr className="border-b border-[#1e2535]">
                {['Descrição','Categoria','Valor',''].map((h) => (
                  <th key={h} className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((l) => (
                <tr key={l.id} className="border-b border-[#1a2030] hover:bg-[#1a2030] group transition-colors">
                  <td className="px-4 py-3 text-slate-200">{l.descricao}</td>
                  <td className="px-4 py-3 text-slate-400">{l.categoria}</td>
                  <td className={`px-4 py-3 font-semibold ${cor}`}>{formatBRL(l.valor)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => abrirEdit(l)} className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 bg-[#1e2535] rounded">✏️</button>
                      <button onClick={() => remover(l.id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-[#1e2535] rounded">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={modal === 'add' ? `${tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa'}` : 'Editar'} onClose={fechar}>
          <div className="space-y-3">
            <FormField label="Descrição">
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição..." />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Valor (R$)">
                <Input
                  value={valorInput}
                  onChange={(e) => { setValorInput(e.target.value); setForm({ ...form, valor: parseBRL(e.target.value) }) }}
                  placeholder="0,00"
                />
              </FormField>
              <FormField label="Categoria">
                <Select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                  {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormField>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={fechar} className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg">Cancelar</button>
              <button onClick={salvar} className={`flex-1 ${bgCor} text-white text-sm font-semibold py-2 rounded-lg transition-colors`}>Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
