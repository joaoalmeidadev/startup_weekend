import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { RewardSharePicker } from '@/components/RewardSharePicker'
import { TrainingCostFields, type TrainingCost } from '@/components/TrainingCostFields'
import { pointsFor, pointsPerHour, savedFor } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import { brl, hoursReplaced } from './rewardValue'

const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

type WhatIf = { hours: string; cost: string }

const WHAT_IF_FIELDS: { key: keyof WhatIf; label: string }[] = [
  { key: 'hours', label: 'Horas de estudo' },
  { key: 'cost', label: 'Custo do prêmio (R$)' },
]

const DEFAULT_HOURS = 6

// The hour cost itself is shown live by TrainingCostFields, right under the salaries
function Results({ rule, whatIf }: { rule: PointsRule; whatIf: WhatIf }) {
  const hours = Number(whatIf.hours || 0)
  const cost = Number(whatIf.cost || 0)
  const rewardHours = hoursReplaced(cost, rule)
  return (
    <ul className="flex flex-col gap-1 rounded-xl bg-surface-container-low p-space-md text-body-md text-on-surface">
      <li className="text-label-lg text-primary">{`${pointsPerHour(rule).toLocaleString('pt-BR')} pts por hora para quem estuda (1 pt = R$ 1)`}</li>
      <li>{`${whatIf.hours || 0} h de estudo → ${brl(savedFor(hours, rule))} economizados → ${pointsFor(hours, rule)} pts`}</li>
      {whatIf.cost !== '' && rewardHours && (
        <li>{`Um prêmio de ${brl(cost)} vale ${cost} pts ≈ ${rewardHours} h de estudo`}</li>
      )}
    </ul>
  )
}

// A quick what-if for the manager; nothing is saved and the catalog keeps the company's rule
export function PointsCalculator({ rule: companyRule, onClose }: { rule: PointsRule; onClose: () => void }) {
  const [rule, setRule] = useState(companyRule)
  const [whatIf, setWhatIf] = useState<WhatIf>({ hours: String(DEFAULT_HOURS), cost: '' })
  const changeCost = (cost: TrainingCost) => setRule({ ...rule, ...cost })

  return (
    <Modal icon="calculate" title="Calcular pontuação" onClose={onClose}>
      {/* The modal does not scroll by itself; this keeps "Fechar" in reach on short screens */}
      <div className="-mr-space-sm flex max-h-[65vh] flex-col gap-space-md overflow-y-auto pr-space-sm">
        <TrainingCostFields value={rule} onChange={changeCost} />
        <RewardSharePicker
          value={rule.reward_share}
          onChange={(share) => setRule({ ...rule, reward_share: share })}
        />
        <div className="grid grid-cols-2 items-end gap-space-sm">
          {WHAT_IF_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-space-xs">
              <label htmlFor={`calc-${key}`} className="text-label-md text-on-surface">
                {label}
              </label>
              <input
                id={`calc-${key}`}
                type="number"
                min={0}
                value={whatIf[key]}
                onChange={(e) => setWhatIf({ ...whatIf, [key]: e.target.value })}
                className={FIELD}
              />
            </div>
          ))}
        </div>
        <Results rule={rule} whatIf={whatIf} />
      </div>
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
