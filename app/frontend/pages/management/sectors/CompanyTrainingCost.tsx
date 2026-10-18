import { useId, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import { useMockNotice } from '@/components/MockNotice'
import { RewardSharePicker } from '@/components/RewardSharePicker'
import { TrainingCostFields } from '@/components/TrainingCostFields'
import { hourCost, pointsPerHour } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import { reais, shareText } from './trainingCostText'

const summaryOf = (rule: PointsRule) =>
  `1 h de treino custa ${reais(hourCost(rule))} → vira ${pointsPerHour(rule)} pts · ${shareText(rule.reward_share)}`

type EditorProps = { rule: PointsRule; onSave: (rule: PointsRule) => void; onClose: () => void }

function CompanyRuleEditor({ rule, onSave, onClose }: EditorProps) {
  const [draft, setDraft] = useState(rule)
  return (
    <Modal icon="payments" title="Custo do treino da empresa" onClose={onClose}>
      <TrainingCostFields value={draft} onChange={(cost) => setDraft({ ...draft, ...cost })} />
      <RewardSharePicker
        value={draft.reward_share}
        onChange={(share) => setDraft({ ...draft, reward_share: share })}
      />
      <p className="rounded-xl bg-surface-container-low p-space-md text-label-lg text-primary">
        {`Cada hora de treino que a Nivela substitui vira ${pointsPerHour(draft)} pts`}
      </p>
      <div className="flex justify-end gap-space-sm">
        <button type="button" onClick={onClose} className="h-11 px-space-md text-label-lg text-primary">
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="h-11 rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-sm hover:bg-primary-container"
        >
          Salvar
        </button>
      </div>
    </Modal>
  )
}

// The training cost every work sector uses, unless it has its own salaries
export function CompanyTrainingCost({ initialRule }: { initialRule: PointsRule }) {
  const notify = useMockNotice()
  const titleId = useId()
  const [rule, setRule] = useState(initialRule)
  const [editing, setEditing] = useState(false)
  const save = (saved: PointsRule) => {
    setRule(saved)
    setEditing(false)
    notify('Custo do treino salvo (simulação).')
  }

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm sm:flex-row sm:items-center"
    >
      <div className="flex items-start gap-space-md">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">
          <Icon name="payments" className="text-[1.5rem]" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-headline-sm text-on-surface">
            Custo do treino da empresa
          </h2>
          <p className="text-label-lg text-primary">{summaryOf(rule)}</p>
          <p className="text-body-sm text-on-surface-variant">
            Vale para todos os setores, menos os que têm valor próprio.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex h-11 shrink-0 items-center justify-center gap-space-xs rounded-xl px-space-md text-label-lg text-primary ring-1 ring-outline-variant hover:bg-surface-container-low"
      >
        <Icon name="edit" className="text-[1.125rem]" />
        Editar
      </button>
      {editing && <CompanyRuleEditor rule={rule} onSave={save} onClose={() => setEditing(false)} />}
    </section>
  )
}
