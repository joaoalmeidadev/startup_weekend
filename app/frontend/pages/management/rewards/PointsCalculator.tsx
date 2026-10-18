import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { hourCost, pointsFor, pointsPerHour, savedFor } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import { brl } from './rewardValue'

const EXAMPLE_HOURS = 6
const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

type Draft = { manager: string; person: string; percent: string }

const draftFrom = (rule: PointsRule): Draft => ({
  manager: String(rule.manager_hourly),
  person: String(rule.person_hourly),
  percent: String(Math.round(rule.reward_share * 100)),
})

const ruleFrom = (draft: Draft): PointsRule => ({
  manager_hourly: Number(draft.manager || 0),
  person_hourly: Number(draft.person || 0),
  reward_share: Number(draft.percent || 0) / 100,
})

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor={id} className="text-label-md text-on-surface">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD}
      />
    </div>
  )
}

function Results({ rule }: { rule: PointsRule }) {
  return (
    <ul className="flex flex-col gap-1 text-body-md text-on-surface">
      <li>{`1 h de treino presencial custa ${brl(hourCost(rule))}`}</li>
      <li className="text-label-lg text-primary">{`vira ${pointsPerHour(rule)} pts para quem estuda`}</li>
      <li>1 pt = R$ 1 em prêmios</li>
      <li className="text-body-sm text-on-surface-variant">
        {`Uma etapa de ${EXAMPLE_HOURS} h → ${brl(savedFor(EXAMPLE_HOURS, rule))} economizados → ${pointsFor(EXAMPLE_HOURS, rule)} pts`}
      </li>
    </ul>
  )
}

type PointsCalculatorProps = { rule: PointsRule; onChange: (rule: PointsRule) => void; onSave: () => void }

// Only the manager sees this math: the collaborator only sees points
export function PointsCalculator({ rule, onChange, onSave }: PointsCalculatorProps) {
  const [draft, setDraft] = useState(() => draftFrom(rule))
  const change = (key: keyof Draft) => (value: string) => {
    const next = { ...draft, [key]: value }
    setDraft(next)
    onChange(ruleFrom(next))
  }

  return (
    <section
      aria-labelledby="calculator-title"
      className="flex flex-col gap-space-md rounded-xl bg-secondary-fixed/40 p-space-md"
    >
      <div className="flex items-start gap-space-md">
        <Icon name="calculate" className="text-[1.75rem] text-primary" />
        <div className="flex flex-col">
          <h2 id="calculator-title" className="text-headline-sm text-on-surface">
            Calculadora de pontos
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Só a gestão vê esta conta: a pessoa só vê os pontos e os prêmios.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        <NumberField
          id="rule-manager"
          label="Valor/hora do gestor (R$)"
          value={draft.manager}
          onChange={change('manager')}
        />
        <NumberField
          id="rule-person"
          label="Valor/hora da pessoa (R$)"
          value={draft.person}
          onChange={change('person')}
        />
        <NumberField
          id="rule-share"
          label="Quanto da economia vira prêmio (%)"
          value={draft.percent}
          onChange={change('percent')}
        />
      </div>
      <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
        <Results rule={rule} />
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
        >
          Salvar regra
        </button>
      </div>
    </section>
  )
}
