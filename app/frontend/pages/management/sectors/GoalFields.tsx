import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { Competency, GoalLevel } from '@/types/management'
import { CompetencyCard } from './CompetencyCard'
import { GoalLevelPicker } from './GoalLevelPicker'
import type { GoalLevels } from './useGoalLevels'

type GoalFieldsProps = {
  levels: GoalLevel[]
  competencies: Competency[]
  goal: GoalLevels
  // Shown between the level picker and the rulers (e.g. the veterans note)
  children?: ReactNode
}

function LevelStatus({ level, adjusted }: { level: GoalLevel; adjusted: boolean }) {
  return (
    <p className="flex items-center gap-space-xs text-body-md text-on-surface-variant">
      <Icon name={adjusted ? 'tune' : 'check_circle'} className="text-[1.125rem] text-primary" />
      Nível escolhido:{' '}
      {adjusted ? (
        <>
          <strong className="text-on-surface">Personalizado</strong> (a partir do {level.label})
        </>
      ) : (
        <>
          <strong className="text-on-surface">{level.label}</strong> · {level.target} pts em todas as
          competências
        </>
      )}
    </p>
  )
}

// Level picker plus one ruler per competency, shown once a level is picked
export function GoalFields({ levels, competencies, goal, children }: GoalFieldsProps) {
  const { level, goals, adjusted, pickLevel, setGoal } = goal
  return (
    <>
      <GoalLevelPicker levels={levels} selected={level?.key ?? null} adjusted={adjusted} onPick={pickLevel} />
      {children}
      {level && (
        <>
          <LevelStatus level={level} adjusted={adjusted} />
          {competencies.map((competency, index) => (
            <CompetencyCard
              key={competency.name}
              competency={competency}
              goal={goals[index]}
              onGoalChange={(value) => setGoal(index, value)}
            />
          ))}
        </>
      )}
    </>
  )
}
