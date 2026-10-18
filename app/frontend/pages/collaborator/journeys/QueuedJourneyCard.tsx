import type { LearnerJourney } from '@/types/collaborator'
import { pointsLeft } from './learnerJourneys'

type QueuedJourneyCardProps = { journey: LearnerJourney; onStart: () => void }

export function QueuedJourneyCard({ journey, onStart }: QueuedJourneyCardProps) {
  return (
    <li className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-label-lg text-on-surface">{journey.name}</span>
        <span className="flex flex-wrap gap-x-space-sm text-body-sm text-on-surface-variant">
          <span>{journey.steps.length} etapas</span>
          <span className="text-secondary">até +{pointsLeft(journey)} pts</span>
        </span>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="shrink-0 rounded-xl border border-primary px-space-md py-space-sm text-label-md text-primary transition hover:bg-primary-fixed/30"
      >
        Começar esta
      </button>
    </li>
  )
}
