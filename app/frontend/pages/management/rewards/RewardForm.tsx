import { useState, type ReactNode } from 'react'
import { Modal } from '@/components/Modal'
import type { PointsRule, Reward } from '@/types/management'
import { belowCost, hoursReplaced } from './rewardValue'

const CATEGORIES = ['Folga', 'Experiência', 'Brinde', 'Vale']
const FIELD =
  'h-11 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

type Draft = {
  name: string
  category: string
  cost: string
  points: string
  stock: string
  pointsTouched: boolean
}

const draftFrom = (idea: Reward | null): Draft => ({
  name: idea?.name ?? '',
  category: idea?.category ?? CATEGORIES[0],
  cost: idea ? String(idea.cost) : '',
  points: idea ? String(idea.points) : '',
  stock: '',
  pointsTouched: false,
})

function Field({ label, children }: { label: string; children: (id: string) => ReactNode }) {
  const id = `reward-${label.toLowerCase().replace(/\W+/g, '-')}`
  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor={id} className="text-label-md text-on-surface">
        {label}
      </label>
      {children(id)}
    </div>
  )
}

function RuleCheck({ cost, points, rule }: { cost: number; points: number; rule: PointsRule }) {
  if (belowCost({ cost, points })) {
    return (
      <p className="text-body-sm text-error">Abaixo do custo: a empresa pagaria mais do que a regra prevê.</p>
    )
  }
  const hours = hoursReplaced(points, rule)
  return (
    hours && (
      <p className="text-body-sm text-on-surface-variant">{`Equivale a ~${hours} h de treino substituído`}</p>
    )
  )
}

type RewardFormProps = {
  idea: Reward | null
  rule: PointsRule
  onSave: (reward: Reward) => void
  onClose: () => void
}

export function RewardForm({ idea, rule, onSave, onClose }: RewardFormProps) {
  const [draft, setDraft] = useState(() => draftFrom(idea))
  const cost = Number(draft.cost || 0)
  const points = Number(draft.points || 0)
  const ready = draft.name.trim() !== '' && draft.cost !== '' && points > 0 && !belowCost({ cost, points })

  const changeCost = (value: string) =>
    setDraft((current) => ({
      ...current,
      cost: value,
      points: current.pointsTouched ? current.points : value,
    }))

  const save = () =>
    onSave({
      id: draft.name.toLowerCase().replace(/\s+/g, '-'),
      name: draft.name.trim(),
      icon: idea?.icon ?? 'redeem',
      category: draft.category,
      cost,
      points,
      stock: draft.stock ? Number(draft.stock) : null,
    })

  return (
    <Modal icon="redeem" title="Cadastrar recompensa" onClose={onClose}>
      <Field label="Nome">
        {(id) => (
          <input
            id={id}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className={FIELD}
          />
        )}
      </Field>
      <Field label="Categoria">
        {(id) => (
          <select
            id={id}
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className={FIELD}
          >
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        )}
      </Field>
      <div className="grid grid-cols-3 gap-space-sm">
        <Field label="Custo (R$)">
          {(id) => (
            <input
              id={id}
              type="number"
              min={0}
              value={draft.cost}
              onChange={(e) => changeCost(e.target.value)}
              className={FIELD}
            />
          )}
        </Field>
        <Field label="Pontos">
          {(id) => (
            <input
              id={id}
              type="number"
              min={0}
              value={draft.points}
              onChange={(e) => setDraft({ ...draft, points: e.target.value, pointsTouched: true })}
              className={FIELD}
            />
          )}
        </Field>
        <Field label="Estoque">
          {(id) => (
            <input
              id={id}
              type="number"
              min={0}
              placeholder="Sem limite"
              value={draft.stock}
              onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
              className={FIELD}
            />
          )}
        </Field>
      </div>
      {draft.cost !== '' && <RuleCheck cost={cost} points={points} rule={rule} />}
      <button
        type="button"
        disabled={!ready}
        onClick={save}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        Cadastrar
      </button>
    </Modal>
  )
}
