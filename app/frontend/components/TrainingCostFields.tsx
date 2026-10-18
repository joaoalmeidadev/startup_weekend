import { useState } from 'react'
import { HOURS_PER_MONTH, hourCost, hourlyFrom } from '@/lib/pointsRule'

export type TrainingCost = { teacher_salary: number; learner_salary: number }

const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

const ROLES: { key: keyof TrainingCost; who: string; hint: string }[] = [
  { key: 'teacher_salary', who: 'quem ensina', hint: 'O gestor ou o veterano que hoje para para treinar' },
  { key: 'learner_salary', who: 'quem aprende', hint: 'O novato, que também para de trabalhar no treino' },
]

const reais = (value: number) => `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`

type Props = { value: TrainingCost; onChange: (value: TrainingCost) => void }

// Asks what everyone knows (the monthly salary) and shows the hour it makes: salary ÷ 220 h, no extra charges
export function TrainingCostFields({ value, onChange }: Props) {
  const [hourly, setHourly] = useState(false)
  const set = (key: keyof TrainingCost, typed: string) => {
    const number = Number(typed || 0)
    onChange({ ...value, [key]: hourly ? Math.round(number * HOURS_PER_MONTH) : number })
  }

  return (
    <div className="flex flex-col gap-space-sm">
      {ROLES.map(({ key, who, hint }) => {
        const id = `training-cost-${key}`
        const label = hourly ? `Valor/hora de ${who} (R$)` : `Salário mensal de ${who} (R$)`
        return (
          <div key={key} className="flex flex-col gap-space-xs">
            <label htmlFor={id} className="text-label-md text-on-surface">
              {label}
            </label>
            <span className="text-body-sm text-on-surface-variant">{hint}</span>
            <div className="flex items-center gap-space-sm">
              <input
                id={id}
                type="number"
                min={0}
                value={hourly ? hourlyFrom(value[key]) : value[key]}
                onChange={(event) => set(key, event.target.value)}
                className={FIELD}
              />
              {!hourly && (
                <span className="shrink-0 text-label-md text-primary">{`= ${reais(hourlyFrom(value[key]))}/h`}</span>
              )}
            </div>
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => setHourly((current) => !current)}
        className="w-fit text-label-md text-primary hover:underline"
      >
        {hourly ? 'Prefiro digitar o salário' : 'Prefiro digitar o valor/hora'}
      </button>
      <p className="text-label-lg text-on-surface">
        {`1 h de treino presencial custa ${reais(hourCost({ ...value, reward_share: 0 }))}`}
      </p>
    </div>
  )
}
