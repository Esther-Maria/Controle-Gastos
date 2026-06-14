import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAppStore } from '../store/useAppStore'
import KpiCard from '../components/KpiCard'
import Badge from '../components/Badge'
import MonthPills from '../components/MonthPills'
import { getParcelasDoMes, calcTotaisParcelamentos } from '../utils/parcelamentos'
import { formatBRL } from '../utils/currency'
import { MESES_CURTO } from '../types'

const PIZZA_CORES = ['#3b82f6','#22c55e','#f59e0b','#a855f7','#ef4444','#64748b']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161b27] border border-[#1e2535] rounded-lg p-2.5 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {formatBRL(p.value)}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { mesAtivo, anoAtivo, lancamentos, investimentos, parcelas } = useAppStore()

  const receitasMes = lancamentos
    .filter((l) => l.tipo === 'receita' && l.mes === mesAtivo && l.ano === anoAtivo)
    .reduce((a, l) => a + l.valor, 0)

  const despesasMes = lancamentos
    .filter((l) => l.tipo === 'despesa' && l.mes === mesAtivo && l.ano === anoAtivo)
    .reduce((a, l) => a + l.valor, 0)

  const investimentosMes = investimentos
    .filter((i) => i.mes === mesAtivo && i.ano === anoAtivo)
    .reduce((a, i) => a + i.valor, 0)

  const parcelasNoMes = getParcelasDoMes(parcelas, mesAtivo, anoAtivo)
  const totaisParcelas = calcTotaisParcelamentos(parcelasNoMes)
  const totalDespesasComParcelas = despesasMes + totaisParcelas.totalForaCartao

  const saldo = receitasMes - totalDespesasComParcelas - investimentosMes

  // Dados para gráfico de barras (12 meses)
  const barData = MESES_CURTO.map((mes, i) => {
    const m = i + 1
    const rec = lancamentos
      .filter((l) => l.tipo === 'receita' && l.mes === m && l.ano === anoAtivo)
      .reduce((a, l) => a + l.valor, 0)
    const desp = lancamentos
      .filter((l) => l.tipo === 'despesa' && l.mes === m && l.ano === anoAtivo)
      .reduce((a, l) => a + l.valor, 0)
    return { mes, Receitas: rec, Despesas: desp }
  })

  // Dados donut — despesas por categoria no mês
  const catMap: Record<string, number> = {}
  lancamentos
    .filter((l) => l.tipo === 'despesa' && l.mes === mesAtivo && l.ano === anoAtivo)
    .forEach((l) => {
      catMap[l.categoria] = (catMap[l.categoria] || 0) + l.valor
    })
  const donutData = Object.entries(catMap).map(([name, value]) => ({ name, value }))

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Receitas" value={receitasMes} color="green" sub="no mês" />
        <KpiCard label="Despesas" value={totalDespesasComParcelas} color="red" sub="inclui parcelamentos" />
        <KpiCard label="Investimentos" value={investimentosMes} color="blue" sub={receitasMes > 0 ? `${Math.round(investimentosMes / receitasMes * 100)}% da receita` : ''} />
        <KpiCard label="Saldo" value={saldo} color={saldo >= 0 ? 'green' : 'red'} sub={saldo >= 0 ? 'Positivo ✓' : 'Atenção!'} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Bar */}
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Evolução Anual</p>
          {barData.some((d) => d.Receitas > 0 || d.Despesas > 0) ? (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={barData} barSize={6} barGap={2}>
                <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Receitas" fill="#22c55e" radius={[3,3,0,0]} />
                <Bar dataKey="Despesas" fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-28 flex items-center justify-center text-slate-600 text-xs">
              Adicione lançamentos para ver o gráfico
            </div>
          )}
          <div className="flex gap-3 mt-2">
            <span className="text-[9px] text-slate-500 flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block"/>Receitas</span>
            <span className="text-[9px] text-slate-500 flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block"/>Despesas</span>
          </div>
        </div>

        {/* Donut */}
        <div className="bg-[#161b27] border border-[#1e2535] rounded-xl p-4">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Despesas por Categoria</p>
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={donutData} cx="40%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={2}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={PIZZA_CORES[i % PIZZA_CORES.length]} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(v) => <span style={{ fontSize: 10, color: '#94a3b8' }}>{v}</span>}
                />
                <Tooltip formatter={(v: number) => formatBRL(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-600 text-xs">
              Nenhuma despesa lançada no mês
            </div>
          )}
        </div>
      </div>

      {/* Parcelamentos do mês */}
      <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2535]">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Parcelamentos Ativos — {MESES_CURTO[mesAtivo - 1]}
          </p>
          <div className="flex gap-3 text-[10px]">
            <span className="text-slate-400">Cartão: <span className="text-blue-400 font-semibold">{formatBRL(totaisParcelas.totalCartao)}</span></span>
            <span className="text-slate-400">Fora do cartão: <span className="text-yellow-400 font-semibold">{formatBRL(totaisParcelas.totalForaCartao)}</span></span>
          </div>
        </div>

        {parcelasNoMes.length === 0 ? (
          <div className="py-8 text-center text-slate-600 text-xs">Nenhum parcelamento ativo neste mês</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-[11px] min-w-[500px]">
            <thead>
              <tr className="border-b border-[#1e2535]">
                <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2">Descrição</th>
                <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2">Valor/Parcela</th>
                <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2">Forma</th>
                <th className="text-left text-[9px] text-slate-600 uppercase tracking-wider px-4 py-2">Parcela</th>
              </tr>
            </thead>
            <tbody>
              {parcelasNoMes.map(({ parcela, valorParcela, numeroParcela }) => (
                <tr key={parcela.id} className="border-b border-[#1a2030] hover:bg-[#1a2030] transition-colors">
                  <td className="px-4 py-2.5 text-slate-200">{parcela.descricao}</td>
                  <td className="px-4 py-2.5 text-green-400 font-semibold">{formatBRL(valorParcela)}</td>
                  <td className="px-4 py-2.5"><Badge forma={parcela.formaPagamento} /></td>
                  <td className="px-4 py-2.5 text-slate-500">{numeroParcela}/{parcela.numParcelas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}

        {/* Totais rodapé */}
        {parcelasNoMes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#1e2535]">
            {[
              { label: 'Total no Mês', value: totaisParcelas.totalMes, color: 'text-red-400' },
              { label: 'Total Cartão', value: totaisParcelas.totalCartao, color: 'text-blue-400' },
              { label: 'Fora do Cartão', value: totaisParcelas.totalForaCartao, color: 'text-yellow-400' },
            ].map((t) => (
              <div key={t.label} className="px-4 py-3 border-r border-[#1e2535] last:border-r-0">
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">{t.label}</p>
                <p className={`text-base font-bold mt-0.5 ${t.color}`}>{formatBRL(t.value)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
