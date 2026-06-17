import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { importarParcelamentosCSV } from '../utils/importCSV'
import { importarExtratoNubank } from '../utils/importNubank'
import Modal from './Modal'
import { FormField, Input } from './FormField'

export default function ImportarModal() {
  const { importarModalAberto, setImportarModalAberto, importarParcelas, addLancamento, anoAtivo } = useAppStore()
  const [tipo, setTipo] = useState<'parcelamentos' | 'extrato'>('parcelamentos')
  const [step, setStep] = useState<1 | 2>(1)
  const [anoImport, setAnoImport] = useState(new Date().getFullYear())
  const [resultado, setResultado] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function fechar() {
    setImportarModalAberto(false)
    setStep(1)
    setTipo('parcelamentos')
    setResultado(null)
  }

  function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (tipo === 'parcelamentos') {
        const novasParcelas = importarParcelamentosCSV(text, anoImport)
        if (novasParcelas.length === 0) {
          setResultado('Nenhum parcelamento encontrado no arquivo.')
          return
        }
        importarParcelas(novasParcelas)
        setResultado(`✅ ${novasParcelas.length} parcelamentos importados com sucesso!`)
      } else {
        const lancamentos = importarExtratoNubank(text)
        if (lancamentos.length === 0) {
          setResultado('Nenhuma transação encontrada no arquivo.')
          return
        }
        lancamentos.forEach((l) =>
          addLancamento({ ...l, id: Math.random().toString(36).slice(2) + Date.now().toString(36) })
        )
        setResultado(`✅ ${lancamentos.length} transações importadas com sucesso!`)
      }
    }
    reader.readAsText(file, 'utf-8')
    e.target.value = ''
  }

  if (!importarModalAberto) return null

  return (
    <Modal title="Importar CSV" onClose={fechar}>
      <div className="space-y-4">
        {/* Indicador de steps */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= s ? 'bg-green-500 text-white' : 'bg-[#1e2535] text-slate-500'}`}>{s}</div>
              {s < 2 && <div className={`h-px w-6 ${step > s ? 'bg-green-500' : 'bg-[#1e2535]'}`} />}
            </div>
          ))}
          <span className="text-[11px] text-slate-500 ml-1">{step === 1 ? 'Tipo' : 'Upload'}</span>
        </div>

        {/* Step 1 — Tipo */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">O que deseja importar?</p>
            {([
              { value: 'parcelamentos', label: '🔄 Parcelamentos', desc: 'Arquivo CSV próprio do app' },
              { value: 'extrato', label: '🏦 Extrato bancário', desc: 'Extrato exportado pelo Nubank' },
            ] as const).map((op) => (
              <button
                key={op.value}
                onClick={() => setTipo(op.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${tipo === op.value ? 'border-green-500/50 bg-green-500/10' : 'border-[#1e2535] hover:border-[#2e3a4e]'}`}
              >
                <p className="text-sm font-semibold text-slate-200">{op.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{op.desc}</p>
              </button>
            ))}
            <button
              onClick={() => setStep(2)}
              className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Step 2 — Upload */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-slate-400 text-sm">Selecione um arquivo CSV para importar.</p>
            {tipo === 'parcelamentos' && (
              <FormField label="Ano dos parcelamentos">
                <Input
                  type="number"
                  value={anoImport}
                  onChange={(e) => setAnoImport(parseInt(e.target.value) || anoAtivo)}
                />
              </FormField>
            )}
            <input ref={inputRef} type="file" accept=".csv" onChange={handleCSV} className="hidden" />
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-[#1e2535] hover:border-green-500/40 rounded-lg py-6 text-slate-500 hover:text-green-400 transition-all text-sm"
            >
              📂 Clique para selecionar o arquivo CSV
            </button>
            {resultado && (
              <div className={`rounded-lg px-3 py-2 text-sm ${resultado.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {resultado}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => { setStep(1); setResultado(null) }} className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg">← Voltar</button>
              <button onClick={fechar} className="flex-1 bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg">Fechar</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
