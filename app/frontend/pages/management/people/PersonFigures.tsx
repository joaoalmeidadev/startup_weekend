import { Icon } from '@/components/Icon'
import type { Person } from '@/types/management'
import { PERSON_STATUS } from './personStatus'

export function JourneyProgress({ progress }: { progress: Person['progress'] }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex items-center gap-space-xs">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-primary-container"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <span className="text-label-sm text-on-surface">{progress.percent}%</span>
      </div>
      <span className="truncate text-body-sm text-on-surface-variant">
        {progress.current_module ? `Módulo atual: ${progress.current_module}` : 'Jornada concluída'}
      </span>
    </div>
  )
}

// Score against the sector goal: arrow + numbers + words, color only reinforces
export function ScoreVsGoal({
  score,
  goal,
  large = false,
}: Pick<Person, 'score' | 'goal'> & { large?: boolean }) {
  const figure = large ? 'text-headline-md font-bold' : 'text-label-lg'
  if (goal === null) {
    return (
      <div className="flex flex-col">
        <span className={`${figure} text-on-surface`}>{score} pts</span>
        <span className="text-body-sm text-outline">setor sem meta</span>
      </div>
    )
  }
  const reached = score >= goal
  return (
    <div className={`flex flex-col ${reached ? 'text-tertiary-container' : 'text-secondary'}`}>
      <span className={`flex items-center gap-1 ${figure}`}>
        <Icon
          name={reached ? 'arrow_upward' : 'arrow_downward'}
          className={large ? 'text-[1.5rem]' : 'text-[1rem]'}
        />
        <span>
          {score} / meta {goal}
        </span>
      </span>
      <span className="text-body-sm">{reached ? 'na meta' : 'abaixo da meta'}</span>
    </div>
  )
}

export function Forecast({ status, forecast }: Pick<Person, 'status' | 'forecast'>) {
  const style = PERSON_STATUS[status]
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-space-sm py-1 text-label-md ${style.soft}`}
    >
      <Icon name={style.icon} className="text-[1rem]" />
      {forecast}
    </span>
  )
}
