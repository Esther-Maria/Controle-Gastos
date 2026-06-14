import { Parcela, isCartao } from '../types'

export interface ParcelaNoMes {
  parcela: Parcela
  valorParcela: number
  numeroParcela: number
}

export function getParcelasDoMes(parcelas: Parcela[], mes: number, ano: number): ParcelaNoMes[] {
  const resultado: ParcelaNoMes[] = []

  for (const p of parcelas) {
    const inicioMes = p.primeiraMes
    const inicioAno = p.ano

    // Calcular o índice global (mês + ano convertido para índice absoluto)
    const inicioIdx = (inicioAno - 2020) * 12 + (inicioMes - 1)
    const mesIdx = (ano - 2020) * 12 + (mes - 1)

    const numeroParcela = mesIdx - inicioIdx + 1

    if (numeroParcela >= 1 && numeroParcela <= p.numParcelas) {
      resultado.push({
        parcela: p,
        valorParcela: p.valorTotal / p.numParcelas,
        numeroParcela,
      })
    }
  }

  return resultado
}

export function calcTotaisParcelamentos(parcelasNoMes: ParcelaNoMes[]) {
  let totalMes = 0
  let totalCartao = 0
  let totalForaCartao = 0

  for (const { parcela, valorParcela } of parcelasNoMes) {
    totalMes += valorParcela
    if (isCartao(parcela.formaPagamento)) {
      totalCartao += valorParcela
    } else {
      totalForaCartao += valorParcela
    }
  }

  return { totalMes, totalCartao, totalForaCartao }
}
