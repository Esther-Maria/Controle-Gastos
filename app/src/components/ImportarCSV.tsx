import { useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { importarParcelamentosCSV } from '../utils/importCSV'
import Modal from './Modal'

export default function ImportarCSV() {
  const [open, setOpen] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)
  const [ano, setAno] = useState(new Date().getFullYear())
  const inputRef = useRef<HTMLInputElement>(null)
  const { importarParcelas, anoAtivo } = useAppStore()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parcelas = importarParcelamentosCSV(text, ano)
      if (parcelas.length === 0) {
        setResultado('Nenhum parcelamento encontrado no arquivo.')
        return
      }
      importarParcelas(parcelas)
      setResultado(`✅ ${parcelas.length} parcelamentos importados com sucesso!`)
    }
    reader.readAsText(file, 'utf-8')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] text-slate-400 hover:bg-[#1e2535] hover:text-slate-200 transition-all"
      >
        <span className="text-sm w-4 text-center">📥</span>
        Importar CSV
      </button>

      {open && (
        <Modal title="Importar Parcelamentos do CSV" onClose={() => { setOpen(false); setResultado(null) }}>
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">
              Selecione o arquivo <span className="text-green-400 font-mono">Controle de gastos - Parcelamentos.csv</span> para importar seus parcelamentos existentes.
            </p>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Ano dos parcelamentos</label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value) || anoAtivo)}
                className="bg-[#0f1117] border border-[#1e2535] rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-green-500/60 w-full"
              />
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="hidden"
            />
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

            <button
              onClick={() => { setOpen(false); setResultado(null) }}
              className="w-full bg-[#1e2535] text-slate-400 hover:text-slate-200 text-sm py-2 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
