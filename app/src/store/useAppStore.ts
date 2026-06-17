import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Parcela, Lancamento, Investimento } from '../types'

interface AppState {
  mesAtivo: number
  anoAtivo: number
  parcelas: Parcela[]
  lancamentos: Lancamento[]
  investimentos: Investimento[]
  paginaAtiva: string
  importarModalAberto: boolean

  setPagina: (p: string) => void
  setMesAno: (mes: number, ano: number) => void
  setImportarModalAberto: (v: boolean) => void

  addParcela: (p: Parcela) => void
  updateParcela: (p: Parcela) => void
  deleteParcela: (id: string) => void

  addLancamento: (l: Lancamento) => void
  updateLancamento: (l: Lancamento) => void
  deleteLancamento: (id: string) => void

  addInvestimento: (i: Investimento) => void
  updateInvestimento: (i: Investimento) => void
  deleteInvestimento: (id: string) => void

  importarParcelas: (parcelas: Parcela[]) => void
}

const hoje = new Date()

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mesAtivo: hoje.getMonth() + 1,
      anoAtivo: hoje.getFullYear(),
      parcelas: [],
      lancamentos: [],
      investimentos: [],
      paginaAtiva: 'dashboard',
      importarModalAberto: false,

      setPagina: (p) => set({ paginaAtiva: p }),
      setImportarModalAberto: (v) => set({ importarModalAberto: v }),

      setMesAno: (mes, ano) => set({ mesAtivo: mes, anoAtivo: ano }),

      addParcela: (p) => set((s) => ({ parcelas: [...s.parcelas, p] })),
      updateParcela: (p) => set((s) => ({ parcelas: s.parcelas.map((x) => (x.id === p.id ? p : x)) })),
      deleteParcela: (id) => set((s) => ({ parcelas: s.parcelas.filter((x) => x.id !== id) })),

      addLancamento: (l) => set((s) => ({ lancamentos: [...s.lancamentos, l] })),
      updateLancamento: (l) => set((s) => ({ lancamentos: s.lancamentos.map((x) => (x.id === l.id ? l : x)) })),
      deleteLancamento: (id) => set((s) => ({ lancamentos: s.lancamentos.filter((x) => x.id !== id) })),

      addInvestimento: (i) => set((s) => ({ investimentos: [...s.investimentos, i] })),
      updateInvestimento: (i) => set((s) => ({ investimentos: s.investimentos.map((x) => (x.id === i.id ? i : x)) })),
      deleteInvestimento: (id) => set((s) => ({ investimentos: s.investimentos.filter((x) => x.id !== id) })),

      importarParcelas: (parcelas) => set({ parcelas }),
    }),
    {
      name: 'controle-gastos-data',
      partialize: (s) => ({
        mesAtivo: s.mesAtivo, anoAtivo: s.anoAtivo, parcelas: s.parcelas,
        lancamentos: s.lancamentos, investimentos: s.investimentos, paginaAtiva: s.paginaAtiva,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const migrar = (f: string) => (f === 'santander' || f === 'nubank' ? 'cartao' : f)
        state.parcelas = state.parcelas.map((p) => ({ ...p, formaPagamento: migrar(p.formaPagamento) as any }))
        state.lancamentos = state.lancamentos.map((l) => ({ ...l, formaPagamento: l.formaPagamento ? migrar(l.formaPagamento) as any : undefined }))
      },
    }
  )
)
