export type FormaPagamento = 'santander' | 'nubank' | 'pix' | 'boleto' | 'dinheiro' | 'outro'

export type CategoriaReceita =
  | 'Salário'
  | 'Freelance'
  | 'Investimentos'
  | 'Aluguel recebido'
  | 'Outros'

export type CategoriaDespesa =
  | 'Moradia'
  | 'Alimentação'
  | 'Transporte'
  | 'Saúde'
  | 'Educação'
  | 'Lazer'
  | 'Roupas'
  | 'Streaming'
  | 'Academia'
  | 'Internet'
  | 'Outros'

export type CategoriaInvestimento =
  | 'Renda Fixa'
  | 'Ações'
  | 'FIIs'
  | 'Criptomoedas'
  | 'Poupança'
  | 'Outros'

export interface Parcela {
  id: string
  descricao: string
  valorTotal: number
  numParcelas: number
  primeiraMes: number // 1–12
  ano: number
  formaPagamento: FormaPagamento
}

export interface Lancamento {
  id: string
  tipo: 'receita' | 'despesa'
  descricao: string
  categoria: string
  valor: number
  mes: number
  ano: number
  formaPagamento: FormaPagamento
}

export interface Investimento {
  id: string
  descricao: string
  categoria: CategoriaInvestimento
  valor: number
  mes: number
  ano: number
}

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export const MESES_CURTO = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: 'santander', label: 'Santander' },
  { value: 'nubank', label: 'Nubank' },
  { value: 'pix', label: 'Pix' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'outro', label: 'Outro' },
]

export const isCartao = (f: FormaPagamento) => f === 'santander' || f === 'nubank'

export const BADGE_CORES: Record<FormaPagamento, string> = {
  santander: 'bg-red-500/20 text-red-400',
  nubank: 'bg-purple-500/20 text-purple-400',
  pix: 'bg-green-500/20 text-green-400',
  boleto: 'bg-yellow-500/20 text-yellow-400',
  dinheiro: 'bg-emerald-500/20 text-emerald-400',
  outro: 'bg-slate-500/20 text-slate-400',
}
