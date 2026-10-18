import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { hourCost, pointsFor, pointsPerHour, savedFor } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import { brl, hoursReplaced } from './rewardValue'

const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

type Inputs = { teacher: string; learner: string; percent: string; hours: string; cost: string }

const FIELDS: { key: keyof Inputs; label: string }[] = [
  { key: 'teacher', label: 'Salário de quem ensina (R$)' },
  { key: 'learner', label: 'Salário de quem aprende (R$)' },
  { key: 'percent', label: 'Quanto da economia vira prêmio (%)' },
  { key: 'hours', label: 'Horas de treino substituídas' },
  { key: 'cost', label: 'Custo do prêmio (R$)' },
]

const DEFAULT_HOURS = 6

const inputsFrom = (rule: PointsRule): Inputs => ({
  teacher: String(rule.teacher_salary),
  learner: String(rule.learner_salary),
  percent: String(Math.round(rule.reward_share * 100)),
  hours: String(DEFAULT_HOURS),
  cost: '',
})

const ruleFrom = (inputs: Inputs): PointsRule => ({
  teacher_salary: Number(inputs.teacher || 0),
  learner_salary: Number(inputs.learner || 0),
  reward_share: Number(inputs.percent || 0) / 100,
})

function Results({ inputs }: { inputs: Inputs }) {
  const rule = ruleFrom(inputs)
  const hours = Number(inputs.hours || 0)
  const cost = Number(inputs.cost || 0)
  const rewardHours = hoursReplaced(cost, rule)
  return (
    <ul className="flex flex-col gap-1 rounded-xl bg-surface-container-low p-space-md text-body-md text-on-surface">
      <li>{`1 h de treino presencial custa ${brl(hourCost(rule))}`}</li>
      <li className="text-label-lg text-primary">{`${pointsPerHour(rule)} pts por hora para quem estuda (1 pt = R$ 1)`}</li>
      <li>{`${inputs.hours || 0} h de treino → ${brl(savedFor(hours, rule))} economizados → ${pointsFor(hours, rule)} pts`}</li>
      {inputs.cost !== '' && rewardHours && (
        <li>{`Um prêmio de ${brl(cost)} vale ${cost} pts ≈ ${rewardHours} h de treino substituído`}</li>
      )}
    </ul>
  )
}

// A quick what-if for the manager; nothing is saved and the catalog keeps the company's rule
export function PointsCalculator({ rule, onClose }: { rule: PointsRule; onClose: () => void }) {
  const [inputs, setInputs] = useState(() => inputsFrom(rule))
  return (
    <Modal icon="calculate" title="Calcular pontuação" onClose={onClose}>
      <div className="grid grid-cols-2 gap-space-sm">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className={`flex flex-col gap-space-xs ${key === 'percent' ? 'col-span-2' : ''}`}>
            <label htmlFor={`calc-${key}`} className="text-label-md text-on-surface">
              {label}
            </label>
            <input
              id={`calc-${key}`}
              type="number"
              min={0}
              value={inputs[key]}
              onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
              className={FIELD}
            />
          </div>
        ))}
      </div>
      <Results inputs={inputs} />
      <button
        type="button"
        onClick={onClose}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container"
      >
        Fechar
      </button>
    </Modal>
  )
}
