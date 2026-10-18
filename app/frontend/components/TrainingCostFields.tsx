import { useState } from 'react'
import { hourCost } from '@/lib/pointsRule'
import { reais, SalaryHourInput } from './SalaryHourInput'

export type TrainingCost = { teacher_salary: number; learner_salary: number }

const ROLES: { key: keyof TrainingCost; who: string; hint: string }[] = [
  { key: 'teacher_salary', who: 'quem ensina', hint: 'O gestor ou o veterano que hoje para para treinar' },
  { key: 'learner_salary', who: 'quem aprende', hint: 'O novato, que também para de trabalhar no treino' },
]

type Props = { value: TrainingCost; onChange: (value: TrainingCost) => void }

// Asks what everyone knows (the monthly salary) and shows the hour it makes: salary ÷ 220 h, no extra charges
export function TrainingCostFields({ value, onChange }: Props) {
  const [hourly, setHourly] = useState(false)

  return (
    <div className="flex flex-col gap-space-sm">
      {ROLES.map(({ key, who, hint }) => (
        <SalaryHourInput
          key={key}
          id={`training-cost-${key}`}
          salaryLabel={`Salário mensal de ${who} (R$)`}
          hourlyLabel={`Valor/hora de ${who} (R$)`}
          hint={hint}
          salary={value[key]}
          hourly={hourly}
          onChange={(salary) => onChange({ ...value, [key]: salary })}
        />
      ))}
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
