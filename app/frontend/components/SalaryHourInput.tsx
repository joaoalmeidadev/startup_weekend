import { HOURS_PER_MONTH, hourlyFrom } from '@/lib/pointsRule'

const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

export const reais = (value: number) => `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`

type Props = {
  id: string
  // e.g. "de quem ensina": the label reads "Salário mensal de quem ensina (R$)" or "Valor/hora de quem ensina (R$)"
  salaryLabel: string
  hourlyLabel: string
  hint?: string
  salary: number
  hourly: boolean
  onChange: (salary: number) => void
}

// One monthly salary with the hour it makes (÷ 220 h); in hourly mode the typed hour is turned back into a salary
export function SalaryHourInput({ id, salaryLabel, hourlyLabel, hint, salary, hourly, onChange }: Props) {
  const set = (typed: string) => {
    const number = Number(typed || 0)
    onChange(hourly ? Math.round(number * HOURS_PER_MONTH) : number)
  }

  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor={id} className="text-label-md text-on-surface">
        {hourly ? hourlyLabel : salaryLabel}
      </label>
      {hint && <span className="text-body-sm text-on-surface-variant">{hint}</span>}
      <div className="flex items-center gap-space-sm">
        <input
          id={id}
          type="number"
          min={0}
          value={hourly ? hourlyFrom(salary) : salary}
          onChange={(event) => set(event.target.value)}
          className={FIELD}
        />
        {!hourly && (
          <span className="shrink-0 text-label-md text-primary">{`= ${reais(hourlyFrom(salary))}/h`}</span>
        )}
      </div>
    </div>
  )
}
