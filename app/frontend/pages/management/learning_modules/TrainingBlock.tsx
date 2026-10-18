import { useState } from 'react'
import { reais, SalaryHourInput } from '@/components/SalaryHourInput'
import { hourlyFrom, learnerHourly } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import { FIELD, FormBlock } from './FormBlock'
import type { ContentDraft } from './contentDraft'

type TrainingBlockProps = {
  draft: ContentDraft
  companyRule: PointsRule
  onChange: (draft: ContentDraft) => void
}

// What one person studying this content saves: its hours × (who would give the training + who learns)
function SavingLine({ draft, companyRule }: Omit<TrainingBlockProps, 'onChange'>) {
  const hours = Number(draft.hours)
  if (!(hours > 0)) return null
  const teacher = hourlyFrom(draft.teacherSalary)
  const learner = learnerHourly(companyRule)
  const saved = Math.round(hours * (teacher + learner))
  return (
    <p className="rounded-xl bg-surface-container-low p-space-md text-label-lg text-primary">
      {`Cada pessoa que estudar isto economiza ${hours.toLocaleString('pt-BR')} h × (${reais(teacher)} + ${reais(learner)})/h = ${reais(saved)} de treino`}
    </p>
  )
}

// The in-person training this content replaces, so the journeys can tell what they save
export function TrainingBlock({ draft, companyRule, onChange }: TrainingBlockProps) {
  const [hourly, setHourly] = useState(false)
  return (
    <FormBlock id="training-block" title="Treino presencial que este conteúdo substitui">
      <div className="flex flex-col gap-space-xs">
        <label htmlFor="content-hours" className="text-label-md text-on-surface">
          Quanto tempo levaria para treinar isso pessoalmente? (h)
        </label>
        <input
          id="content-hours"
          type="number"
          min={0}
          step={0.5}
          value={draft.hours}
          onChange={(event) => onChange({ ...draft, hours: event.target.value })}
          placeholder="Ex.: 4"
          className={FIELD}
        />
      </div>
      <SalaryHourInput
        id="content-teacher"
        salaryLabel="Salário de quem daria esse treino (R$)"
        hourlyLabel="Valor/hora de quem daria esse treino (R$)"
        hint="O gestor, a supervisora ou o veterano que hoje para para ensinar isso."
        salary={draft.teacherSalary}
        hourly={hourly}
        onChange={(teacherSalary) => onChange({ ...draft, teacherSalary })}
      />
      <button
        type="button"
        onClick={() => setHourly((current) => !current)}
        className="w-fit text-label-md text-primary hover:underline"
      >
        {hourly ? 'Prefiro digitar o salário' : 'Prefiro digitar o valor/hora'}
      </button>
      <SavingLine draft={draft} companyRule={companyRule} />
    </FormBlock>
  )
}
