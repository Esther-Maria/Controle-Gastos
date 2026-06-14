import { useAppStore } from '../store/useAppStore'
import { MESES_CURTO } from '../types'
import { getParcelasDoMes, calcTotaisParcelamentos } from '../utils/parcelamentos'
import { formatBRL } from '../utils/currency'

export default function Relatorios() {
  const { anoAtivo, lancamentos, investimentos, parcelas } = useAppStore()

  const meses = Array.from({ length: 12 }, (_, i) => i + 1)

  const dados = meses.map((mes) => {
    const receitas = lancamentos
      .filter((l) => l.tipo === 'receita' && l.mes === mes && l.ano === anoAtivo)
      .reduce((a, l) => a + l.valor, 0)

    const despesas = lancamentos
      .filter((l) => l.tipo === 'despesa' && l.mes === mes && l.ano === anoAtivo)
      .reduce((a, l) => a + l.valor, 0)

    const invest = investimentos
      .filter((i) => i.mes === mes && i.ano === anoAtivo)
      .reduce((a, i) => a + i.valor, 0)

    const parcelasNoMes = getParcelasDoMes(parcelas, mes, anoAtivo)
    const totParcelas = calcTotaisParcelamentos(parcelasNoMes)

    const totalDespesas = despesas + totParcelas.totalForaCartao
    const saldo = receitas - totalDespesas - invest

    return {
      mes,
      receitas,
      despesas: totalDespesas,
      cartao: totParcelas.totalCartao,
      foraCartao: totParcelas.totalForaCartao,
      invest,
      saldo,
    }
  })

  const totais = {
    receitas: dados.reduce((a, d) => a + d.receitas, 0),
    despesas: dados.reduce((a, d) => a + d.despesas, 0),
    cartao: dados.reduce((a, d) => a + d.cartao, 0),
    foraCartao: dados.reduce((a, d) => a + d.foraCartao, 0),
    invest: dados.reduce((a, d) => a + d.invest, 0),
    saldo: dados.reduce((a, d) => a + d.saldo, 0),
  }

  const Cell = ({ value, color = '' }: { value: number; color?: string }) => (
    <td className={`px-3 py-2.5 text-[11px] font-medium text-right ${color || (value >= 0 ? 'text-slate-300' : 'text-red-400')}`}>
      {formatBRL(value)}
    </td>
  )

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e2535]">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Relatório Anual — {anoAtivo}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2.5 w-28">Categoria</th>
                {MESES_CURTO.map((m) => (
                  <th key={m} className="text-right text-[9px] text-slate-600 uppercase tracking-wider px-3 py-2.5">{m}</th>
                ))}
                <th className="text-right text-[9px] text-slate-600 uppercase tracking-wider px-3 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Receitas', key: 'receitas' as const, color: 'text-green-400' },
                { label: 'Despesas', key: 'despesas' as const, color: 'text-red-400' },
                { label: '↳ Cartão (parcelas)', key: 'cartao' as const, color: 'text-blue-400' },
                { label: '↳ Fora cartão', key: 'foraCartao' as const, color: 'text-yellow-400' },
                { label: 'Investimentos', key: 'invest' as const, color: 'text-blue-400' },
              ].map(({ label, key, color }) => (
                <tr key={key} className="border-b border-[#1a2030] hover:bg-[#1a2030]">
                  <td className={`px-4 py-2.5 text-[10px] font-medium ${color}`}>{label}</td>
                  {dados.map((d) => (
                    <Cell key={d.mes} value={d[key]} color={color} />
                  ))}
                  <td className={`px-3 py-2.5 text-[11px] font-bold text-right ${color}`}>{formatBRL(totais[key])}</td>
                </tr>
              ))}

              {/* Saldo */}
              <tr className="border-t-2 border-[#1e2535]">
                <td className="px-4 py-3 text-[10px] font-bold text-slate-300">Saldo</td>
                {dados.map((d) => (
                  <td key={d.mes} className={`px-3 py-3 text-[11px] font-bold text-right ${d.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatBRL(d.saldo)}
                  </td>
                ))}
                <td className={`px-3 py-3 text-[11px] font-bold text-right ${totais.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatBRL(totais.saldo)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
