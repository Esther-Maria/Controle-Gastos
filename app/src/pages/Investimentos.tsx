import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Investimento, CategoriaInvestimento } from '../types'
import { formatBRL, parseBRL } from '../utils/currency'
import Modal from '../components/Modal'
import { FormField, Input, Select } from '../components/FormField'

function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }

const CATEGORIAS: CategoriaInvestimento[] = ['Renda Fixa','Ações','FIIs','Criptomoedas','Poupança','Outros']

export default function Investimentos() {
  const { mesAtivo, anoAtivo, investimentos, addInvestimento, updateInvestimento, deleteInvestimento } = useAppStore()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editando, setEditando] = useState<Investimento | null>(null)
  const [valorInput, setValorInput] = useState('')
  const [form, setForm] = useState<Omit<Investimento, 'id'>>({
    descricao: '', categoria: 'Renda Fixa', valor: 0, mes: mesAtivo, ano: anoAtivo,
  })

  const itens = investimentos.filter((i) => i.mes === mesAtivo && i.ano === anoAtivo)
  const total = itens.reduce((a, i) => a + i.valor, 0)

  function abrirAdd() {
    setForm({ descricao: '', categoria: 'Renda Fixa', valor: 0, mes: mesAtivo, ano: anoAtivo })
    setValorInput('')
    setModal('add')
  }

  function abrirEdit(i: Investimento) {
    setEditando(i); setForm({ ...i })
    setValorInput(i.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
    setModal('edit')
  }

  function fechar() { setModal(null); setEditando(null) }

  function salvar() {
    if (!form.descricao || form.valor <= 0) return
    if (modal === 'add') addInvestimento({ ...form, id: newId() })
    else if (editando) updateInvestimento({ ...form, id: editando.id })
    fechar()
  }

  function remover(id: string) { if (confirm('Remover?')) deleteInvestimento(id) }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total investido no mês</p>
          <p className="text-xl font-bold text-blue-400">{formatBRL(total)}</p>
        </div>
        <button onClick={abrirAdd} className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg">
          + Novo Investimento
        </button>
      </div>

      <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
        {itens.length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-sm">
            Nenhum investimento.{' '}
            <button onClick={abrirAdd} className="text-blue-500 underline">Adicionar</button>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#1e2535]">
                {['Descrição','Categoria','Valor',''].map((h) => (
                  <th key={h} className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id} className="border-b border-[#1a2030] hover:bg-[#1a2030] group">
                  <td className="px-4 py-3 text-slate-200">{i.descricao}</td>
                  <td className="px-4 py-3 text-slate-400">{i.categoria}</td>
                  <td className="px-4 py-3 text-blue-400 font-semibold">{formatBRL(i.valor)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button onClick={() => abrirEdit(i)} className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 bg-[#1e2535] rounded">✏️</button>
                      <button onClick={() => remover(i.id)} className="text-red-400 text-xs px-2 py-1 bg-[#1e2535] rounded">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Novo Investimento' : 'Editar'} onClose={fechar}>
          <div className="space-y-3">
            <FormField label="Descrição">
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: CDB Nubank 120%" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Valor (R$)">
                <Input value={valorInput} onChange={(e) => { setValorInput(e.target.value); setForm({ ...form, valor: parseBRL(e.target.value) }) }} placeholder="0,00" />
              </FormField>
              <FormField label="Categoria">
                <Select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaInvestimento })}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </FormField>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={fechar} className="flex-1 bg-[#1e2535] text-slate-400 text-sm py-2 rounded-lg">Cancelar</button>
              <button onClick={salvar} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg">Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
