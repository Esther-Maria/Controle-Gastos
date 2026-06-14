import { Parcela, FormaPagamento } from '../types'

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function parseMoeda(str: string): number {
  if (!str || str.trim() === '') return 0
  const clean = str.replace(/[R$\s.]/g, '').replace(',', '.')
  return parseFloat(clean) || 0
}

const FORMAS_MAP: Record<string, FormaPagamento> = {
  'santander': 'santander',
  'nubank': 'nubank',
  'pix': 'pix',
  'boleto': 'boleto',
  'dinheiro': 'dinheiro',
}

function normalizarForma(str: string): FormaPagamento {
  const lower = str.toLowerCase().trim()
  for (const [key, val] of Object.entries(FORMAS_MAP)) {
    if (lower.includes(key)) return val
  }
  return 'outro'
}

export function importarParcelamentosCSV(csvText: string, ano: number = new Date().getFullYear()): Parcela[] {
  const linhas = csvText.split('\n').map((l) => l.trim()).filter(Boolean)
  const parcelas: Parcela[] = []

  // Pular cabeçalho e linhas de total/instrução
  for (const linha of linhas.slice(1)) {
    const cols = linha.split(',').map((c) => c.replace(/^"|"$/g, '').trim())
    if (!cols[0] || cols[0].startsWith('TOTAL') || /^\d+\./.test(cols[0])) continue

    const descricao = cols[0]
    const valorTotal = parseMoeda(cols[1])
    const numParcelas = parseInt(cols[2]) || 0
    const primeiraMes = parseInt(cols[3]) || 1
    const formaPagamento = normalizarForma(cols[5] || '')

    if (!descricao || valorTotal <= 0 || numParcelas <= 0) continue

    parcelas.push({
      id: newId(),
      descricao,
      valorTotal,
      numParcelas,
      primeiraMes,
      ano,
      formaPagamento,
    })
  }

  return parcelas
}
