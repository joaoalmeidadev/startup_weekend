import { Icon } from '@/components/Icon'
import type { Competency } from '@/types/management'
import { GoalRuler } from './GoalRuler'

type CompetencyCardProps = {
  competency: Competency
  goal: number
  onGoalChange: (goal: number) => void
}

function ReachedToday({ competency }: { competency: Competency }) {
  const { reached, goal } = competency
  if (!reached || goal === null) return null
  return (
    <div className="flex items-center gap-space-xs text-on-surface-variant">
      <Icon name="groups" className="text-[1.125rem] text-tertiary" />
      <span className="text-body-md">
        Com a meta salva ({goal} pts),{' '}
        <strong className="text-on-surface">
          {reached.count} de {reached.of} pessoas
        </strong>{' '}
        já atingem.
      </span>
    </div>
  )
}

export function CompetencyCard({ competency, goal, onGoalChange }: CompetencyCardProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary" />
      <div className="mb-space-md flex flex-col justify-between gap-space-sm lg:flex-row lg:items-center">
        <div className="flex items-center gap-space-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
            <Icon name={competency.icon} className="text-[1.125rem]" />
          </div>
          <h2 className="text-headline-sm text-on-surface">{competency.name}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          {competency.experts_average !== null && (
            <div className="flex items-center gap-space-xs rounded-full bg-surface-container-high px-3 py-1">
              <span className="size-2 rounded-full bg-outline" />
              <span className="text-label-sm text-on-surface-variant">Referência dos seus veteranos:</span>
              <strong className="text-label-sm text-on-surface">{competency.experts_average} pts</strong>
            </div>
          )}
          <div className="flex items-center gap-space-xs rounded-full bg-primary-container px-3 py-1 text-on-primary">
            <Icon name="flag" className="text-[0.875rem]" />
            <strong className="text-label-sm font-bold">Meta: {goal} pts</strong>
          </div>
        </div>
      </div>
      <GoalRuler
        label={competency.name}
        goal={goal}
        expertsAverage={competency.experts_average}
        onChange={onGoalChange}
      />
      <ReachedToday competency={competency} />
    </section>
  )
}
