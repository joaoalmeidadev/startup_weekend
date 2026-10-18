import { Link } from '@inertiajs/react'
import type { LearnerJourney } from '@/types/collaborator'
import { JOURNEY_STATUS, NO_JOURNEY_MESSAGE, stepsDone } from '../journeys/learnerJourneys'
import { StepsBar } from '../journeys/StepsBar'

function JourneyRow({ journey }: { journey: LearnerJourney }) {
  const status = JOURNEY_STATUS[journey.status]
  return (
    <li className="flex flex-col gap-space-xs py-space-md first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-space-sm">
        <span className="text-label-lg text-on-surface">{journey.name}</span>
        <span className={`shrink-0 rounded-full px-space-sm py-0.5 text-label-sm font-bold ${status.tone}`}>
          {status.label}
        </span>
      </div>
      <StepsBar journey={journey} />
      <div className="flex justify-between text-body-sm text-on-surface-variant">
        <span>
          {stepsDone(journey)} de {journey.steps.length} etapas
        </span>
        <span>
          {journey.points_earned} de {journey.points_total} pts
        </span>
      </div>
    </li>
  )
}

export function JourneyList({ journeys }: { journeys: LearnerJourney[] }) {
  return (
    <section
      aria-labelledby="journeys-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 id="journeys-title" className="text-headline-sm text-on-surface">
          Minhas jornadas
        </h2>
        <Link href="/collaborator/journeys" className="text-label-md text-primary">
          Ver todas
        </Link>
      </div>
      {journeys.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">{NO_JOURNEY_MESSAGE}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-surface-container-high">
          {journeys.map((journey) => (
            <JourneyRow key={journey.id} journey={journey} />
          ))}
        </ul>
      )}
    </section>
  )
}
