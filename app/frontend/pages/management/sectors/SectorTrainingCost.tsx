import { useState } from 'react'
import { useMockNotice } from '@/components/MockNotice'
import { TrainingCostFields, type TrainingCost } from '@/components/TrainingCostFields'
import { pointsPerHour } from '@/lib/pointsRule'
import type { PointsRule, SectorTrainingCost as Cost } from '@/types/management'
import { Block } from './Block'
import { hourText, sectorRule } from './trainingCostText'

const salariesOf = ({ teacher_salary, learner_salary }: TrainingCost): TrainingCost => ({
  teacher_salary,
  learner_salary,
})

type Props = { sector: string; companyRule: PointsRule; trainingCost: Cost }

function Choice({ checked, label, onPick }: { checked: boolean; label: string; onPick: () => void }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-space-sm rounded-xl p-space-md text-label-lg text-on-surface ${checked ? 'ring-2 ring-primary' : 'ring-1 ring-outline-variant/40'}`}
    >
      <input
        type="radio"
        name="training-cost"
        checked={checked}
        onChange={onPick}
        className="text-primary focus:ring-primary-container"
      />
      {label}
    </label>
  )
}

// A work sector uses the company training cost, or its own salaries; the share of the saving is company-wide
export function SectorTrainingCost({ sector, companyRule, trainingCost }: Props) {
  const notify = useMockNotice()
  const [own, setOwn] = useState(trainingCost.own)
  const [salaries, setSalaries] = useState<TrainingCost>(
    salariesOf(trainingCost.own ? trainingCost : companyRule),
  )
  const rule = sectorRule(companyRule, { ...salaries, own })

  return (
    <Block title="Custo do treino" hint="Quanto custa, neste setor, parar uma hora para treinar alguém.">
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
        <Choice
          checked={!own}
          label={`Usar o padrão da empresa (${hourText(companyRule)})`}
          onPick={() => setOwn(false)}
        />
        <Choice checked={own} label="Valor próprio deste setor" onPick={() => setOwn(true)} />
      </div>
      {own && <TrainingCostFields value={salaries} onChange={setSalaries} />}
      <div className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-low p-space-md sm:flex-row sm:items-center">
        <p className="text-label-lg text-primary">{`Neste setor, 1 h de treino vira ${pointsPerHour(rule)} pts`}</p>
        <button
          type="button"
          onClick={() => notify(`Custo do treino de ${sector} salvo (simulação).`)}
          className="h-11 rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-sm hover:bg-primary-container"
        >
          Salvar
        </button>
      </div>
    </Block>
  )
}
