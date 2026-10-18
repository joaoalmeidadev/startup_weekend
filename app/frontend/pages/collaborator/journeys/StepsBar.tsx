import type { LearnerJourney } from '@/types/collaborator'
import { stepsDone } from './learnerJourneys'

// How many steps of a journey are done, as a thin bar
export function StepsBar({ journey }: { journey: LearnerJourney }) {
  const done = stepsDone(journey)
  const total = journey.steps.length
  return (
    <div
      role="progressbar"
      aria-label={`Etapas de ${journey.name}`}
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
      className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest"
    >
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${total === 0 ? 0 : (done / total) * 100}%` }}
      />
    </div>
  )
}
