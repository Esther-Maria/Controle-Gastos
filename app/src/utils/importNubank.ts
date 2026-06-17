import { Lancamento } from '../types'

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Parseia extrato CSV do Nubank
// Formato esperado: Data,Valor,Identificador,Descrição
export function importarExtratoNubank(csvText: string): Omit<Lancamento, 'id'>[] {
  const linhas = csvText.split('\n').map((l) => l.trim()).filter(Boolean)
  if (linhas.length < 2) return []

  // Detectar separador (vírgula ou ponto-e-vírgula)
  const sep = linhas[0].includes(';') ? ';' : ','

  const resultado: Omit<Lancamento, 'id'>[] = []

  for (const linha of linhas.slice(1)) {
    const cols = linha.split(sep).map((c) => c.replace(/^"|"$/g, '').trim())
    if (cols.length < 3) continue

    // Nubank CSV: Data, Valor, Identificador, Descrição
    const dataStr = cols[0]
    const valorStr = cols[1]
    const descricao = cols[3] || cols[2] || ''

    if (!dataStr || !valorStr || !descricao) continue

    // Parsear data (formatos: YYYY-MM-DD ou DD/MM/YYYY)
    let mes = 0
    let ano = 0
    if (dataStr.includes('-')) {
      const partes = dataStr.split('-')
      ano = parseInt(partes[0])
      mes = parseInt(partes[1])
    } else if (dataStr.includes('/')) {
      const partes = dataStr.split('/')
      mes = parseInt(partes[1])
      ano = parseInt(partes[2])
    }

    if (!mes || !ano) continue

    // Parsear valor (pode ser negativo)
    const valorLimpo = valorStr.replace(/[R$\s]/g, '').replace(',', '.')
    const valor = parseFloat(valorLimpo)
    if (isNaN(valor) || valor === 0) continue

    resultado.push({
      tipo: valor < 0 ? 'despesa' : 'receita',
      descricao,
      categoria: 'Outros',
      valor: Math.abs(valor),
      mes,
      ano,
      formaPagamento: 'cartao',
    })
  }

  return resultado
}
