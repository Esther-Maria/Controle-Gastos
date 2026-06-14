import { FormaPagamento, BADGE_CORES, FORMAS_PAGAMENTO } from '../types'

export default function Badge({ forma }: { forma: FormaPagamento }) {
  const label = FORMAS_PAGAMENTO.find((f) => f.value === forma)?.label ?? forma
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${BADGE_CORES[forma]}`}>
      {label}
    </span>
  )
}
