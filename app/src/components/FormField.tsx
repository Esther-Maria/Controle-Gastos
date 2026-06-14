import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-slate-400 font-medium">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'bg-[#0f1117] border border-[#1e2535] rounded-lg px-3 py-2 text-sm text-slate-100 outline-none focus:border-green-500/60 transition-colors w-full'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputCls} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={inputCls + ' cursor-pointer'}>
      {props.children}
    </select>
  )
}
