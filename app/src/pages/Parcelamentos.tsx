import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Parcela, FORMAS_PAGAMENTO, MESES } from '../types'
import { getParcelasDoMes } from '../utils/parcelamentos'
import { formatBRL, parseBRL } from '../utils/currency'
import Badge from '../components/Badge'
import MonthPills from '../components/MonthPills'
import Modal from '../components/Modal'
import { FormField, Input, Select } from '../components/FormField'
import { importarParcelamentosCSV } from '../utils/importCSV'
import { importarExtratoNubank } from '../utils/importNubank'

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const emptyForm = (): Omit<Parcela, 'id'> => ({
  descricao: '',
  valorTotal: 0,
  numParcelas: 1,
  primeiraMes: new Date().getMonth() + 1,
  ano: new Date().getFullYear(),
  formaPagamento: 'cartao',
})

type Filtro = 'todos' | 'cartao' | 'outros' | 'ativos'

export default function Parcelamentos() {
  const { parcelas, mesAtivo, anoAtivo, addParcela, updateParcela, deleteParcela, importarParcelas, addLancamento } = useAppStore()
  const [modal, setModal] = useState<'add' | 'edit' | 'importar' | null>(null)
  const [editando, setEditando] = useState<Parcela | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [valorInput, setValorInput] = useState('')
  const [anoImport, setAnoImport] = useState(new Date().getFullYear())
  const [resultadoImport, setResultadoImport] = useState<string | null>(null)
  const [tipoImport, setTipoImport] = useState<'parcelamentos' | 'extrato'>('parcelamentos')
  const [bancoImport, setBancoImport] = useState<'nubank'>('nubank')
  const [stepImport, setStepImport] = useState<1 | 2 | 3>(1)
  const inputCSVRef = useRef<HTMLInputElement>(null)

  function abrirImportar() {
    setResultadoImport(null)
    setTipoImport('parcelamentos')
    setBancoImport('nubank')
    setStepImport(1)
    setModal('importar')
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (tipoImport === 'parcelamentos') {
        const novasParcelas = importarParcelamentosCSV(text, anoImport)
        if (novasParcelas.length === 0) {
          setResultadoImport('Nenhum parcelamento encontrado no arquivo.')
          return
        }
        importarParcelas(novasParcelas)
        setResultadoImport(`✅ ${novasParcelas.length} parcelamentos importados com sucesso!`)
      } else {
        const lancamentos = importarExtratoNubank(text)
        if (lancamentos.length === 0) {
          setResultadoImport('Nenhuma transação encontrada no arquivo.')
          return
        }
        lancamentos.forEach((l) => addLancamento({ ...l, id: Math.random().toString(36).slice(2) + Date.now().toString(36) }))
        setResultadoImport(`✅ ${lancamentos.length} transações importadas com sucesso!`)
      }
    }
    reader.readAsText(file, 'utf-8')
    e.target.value = ''
  }

  function abrirAdd() {
    setForm(emptyForm())
    setValorInput('')
    setModal('add')
  }

  function abrirEdit(p: Parcela) {
    setEditando(p)
    setForm({ ...p })
    setValorInput(p.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }))
    setModal('edit')
  }

  function fechar() {
    setModal(null)
    setEditando(null)
  }

  function salvar() {
    if (!form.descricao || form.valorTotal <= 0) return
    if (modal === 'add') {
      addParcela({ ...form, id: newId() })
    } else if (modal === 'edit' && editando) {
      updateParcela({ ...form, id: editando.id })
    }
    fechar()
  }

  function remover(id: string) {
    if (confirm('Remover este parcelamento?')) deleteParcela(id)
  }

  const parcelasNoMes = getParcelasDoMes(parcelas, mesAtivo, anoAtivo)
  const idsAtivos = new Set(parcelasNoMes.map((p) => p.parcela.id))

  const filtradas = parcelas.filter((p) => {
    if (filtro === 'cartao') return p.formaPagamento === 'cartao'
    if (filtro === 'outros') return p.formaPagamento !== 'cartao'
    if (filtro === 'ativos') return idsAtivos.has(p.id)
    return true
  })

  const valorParcela = form.numParcelas > 0 ? form.valorTotal / form.numParcelas : 0

  const filtros: { id: Filtro; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'ativos', label: `Ativos neste mês (${idsAtivos.size})` },
    { id: 'cartao', label: 'Cartão' },
    { id: 'outros', label: 'Pix / Boleto' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-5">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between mb-4">
        <div className="flex flex-wrap gap-1 bg-[#1e2535] rounded-lg p-1 w-full sm:w-auto">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] transition-all ${
                filtro === f.id ? 'bg-[#161b27] text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={abrirImportar}
            className="bg-[#1e2535] hover:bg-[#252d3d] text-slate-300 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            📥 Importar CSV
          </button>
          <button
            onClick={abrirAdd}
            className="bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            + Novo parcelamento
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden overflow-x-auto">
        {filtradas.length === 0 ? (
          <div className="py-12 text-center text-slate-600 text-sm">
            Nenhum parcelamento encontrado.{' '}
            <button onClick={abrirAdd} className="text-green-500 underline">Adicionar</button>
          </div>
        ) : (
          <table className="w-full text-[11px] min-w-[600px]">
            <thead>
              <tr className="border-b border-[#1e2535]">
                {['Descrição','Valor Total','Parcela','Forma','Meses',''].map((h) => (
                  <th key={h} className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((p) => {
                const pMes = parcelasNoMes.find((x) => x.parcela.id === p.id)
                return (
                  <tr key={p.id} className="border-b border-[#1a2030] hover:bg-[#1a2030] transition-colors group">
                    <td className="px-4 py-3 text-slate-200 font-medium">{p.descricao}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200">{formatBRL(p.valorTotal)}</div>
                      <div className="text-slate-500 text-[9px]">{formatBRL(p.valorTotal / p.numParcelas)}/mês</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {pMes ? `${pMes.numeroParcela}/` : '—/'}{p.numParcelas}x
                    </td>
                    <td className="px-4 py-3"><Badge forma={p.formaPagamento} /></td>
                    <td className="px-4 py-3">
                      <MonthPills parcela={p} mesAtivo={mesAtivo} anoAtivo={anoAtivo} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => abrirEdit(p)}
                          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 bg-[#1e2535] rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => remover(p.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-[#1e2535] rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Novo Parcelamento' : 'Editar Parcelamento'} onClose={fechar}>
          <div className="space-y-3">
            <FormField label="Descrição">
              <Input
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Magalu — TV 55"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Valor Total (R$)">
                <Input
                  value={valorInput}
                  onChange={(e) => {
                    setValorInput(e.target.value)
                    setForm({ ...form, valorTotal: parseBRL(e.target.value) })
                  }}
                  placeholder="0,00"
                />
              </FormField>
              <FormField label="Nº de Parcelas">
                <Input
                  type="number"
                  min={1}
                  max={72}
                  value={form.numParcelas}
                  onChange={(e) => setForm({ ...form, numParcelas: parseInt(e.target.value) || 1 })}
                />
              </FormField>
            </div>

            {valorParcela > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-[11px] text-green-400">
                Valor por parcela: <strong>{formatBRL(valorParcela)}</strong>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Mês da 1ª Parcela">
                <Select
                  value={form.primeiraMes}
                  onChange={(e) => setForm({ ...form, primeiraMes: parseInt(e.target.value) })}
                >
                  {MESES.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Ano">
                <Input
                  type="number"
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: parseInt(e.target.value) || 2025 })}
                />
              </FormField>
            </div>

            <FormField label="Forma de Pagamento">
              <Select
                value={form.formaPagamento}
                onChange={(e) => setForm({ ...form, formaPagamento: e.target.value as any })}
              >
                {FORMAS_PAGAMENTO.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </Select>
            </FormField>

            <div className="flex gap-2 pt-2">
              <button
                onClick={fechar}
                className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Importar CSV — steps */}
      {modal === 'importar' && (
        <Modal title="Importar CSV" onClose={() => { setModal(null); setResultadoImport(null) }}>
          <div className="space-y-4">
            {/* Indicador de step */}
            <div className="flex items-center gap-2 mb-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${stepImport >= s ? 'bg-green-500 text-white' : 'bg-[#1e2535] text-slate-500'}`}>{s}</div>
                  {s < 3 && <div className={`h-px w-6 ${stepImport > s ? 'bg-green-500' : 'bg-[#1e2535]'}`} />}
                </div>
              ))}
              <span className="text-[11px] text-slate-500 ml-1">
                {stepImport === 1 ? 'Tipo' : stepImport === 2 ? 'Banco' : 'Upload'}
              </span>
            </div>

            {/* Step 1 — Tipo de importação */}
            {stepImport === 1 && (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm">O que deseja importar?</p>
                {([
                  { value: 'parcelamentos', label: '🔄 Parcelamentos', desc: 'Arquivo CSV próprio do app' },
                  { value: 'extrato', label: '🏦 Extrato bancário', desc: 'Exportado pelo app do banco' },
                ] as const).map((op) => (
                  <button
                    key={op.value}
                    onClick={() => setTipoImport(op.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${tipoImport === op.value ? 'border-green-500/50 bg-green-500/10' : 'border-[#1e2535] hover:border-[#2e3a4e]'}`}
                  >
                    <p className="text-sm font-semibold text-slate-200">{op.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{op.desc}</p>
                  </button>
                ))}
                <button
                  onClick={() => setStepImport(tipoImport === 'parcelamentos' ? 3 : 2)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Continuar →
                </button>
              </div>
            )}

            {/* Step 2 — Banco de origem (só para extrato) */}
            {stepImport === 2 && (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm">Qual banco gerou o extrato?</p>
                {([
                  { value: 'nubank', label: '💜 Nubank', desc: 'CSV exportado pelo app Nubank' },
                ] as const).map((op) => (
                  <button
                    key={op.value}
                    onClick={() => setBancoImport(op.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${bancoImport === op.value ? 'border-green-500/50 bg-green-500/10' : 'border-[#1e2535] hover:border-[#2e3a4e]'}`}
                  >
                    <p className="text-sm font-semibold text-slate-200">{op.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{op.desc}</p>
                  </button>
                ))}
                <p className="text-[10px] text-slate-600">Outros bancos serão adicionados em breve.</p>
                <div className="flex gap-2">
                  <button onClick={() => setStepImport(1)} className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg">← Voltar</button>
                  <button onClick={() => setStepImport(3)} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors">Continuar →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Upload */}
            {stepImport === 3 && (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm">Selecione um arquivo CSV para importar.</p>
                {tipoImport === 'parcelamentos' && (
                  <FormField label="Ano dos parcelamentos">
                    <Input
                      type="number"
                      value={anoImport}
                      onChange={(e) => setAnoImport(parseInt(e.target.value) || new Date().getFullYear())}
                    />
                  </FormField>
                )}
                <input ref={inputCSVRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
                <button
                  onClick={() => inputCSVRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#1e2535] hover:border-green-500/40 rounded-lg py-6 text-slate-500 hover:text-green-400 transition-all text-sm"
                >
                  📂 Clique para selecionar o arquivo CSV
                </button>
                {resultadoImport && (
                  <div className={`rounded-lg px-3 py-2 text-sm ${resultadoImport.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {resultadoImport}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => { setStepImport(tipoImport === 'parcelamentos' ? 1 : 2); setResultadoImport(null) }} className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg">← Voltar</button>
                  <button onClick={() => { setModal(null); setResultadoImport(null) }} className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg">Fechar</button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
