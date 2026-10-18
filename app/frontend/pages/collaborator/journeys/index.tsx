import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { Learner, LearnerJourney } from '@/types/collaborator'
import { JourneySection } from './JourneySection'
import { NO_JOURNEY_MESSAGE, startJourney } from './learnerJourneys'
import { QueuedJourneyCard } from './QueuedJourneyCard'
import { StepPath } from './StepPath'

const CARD = 'rounded-xl bg-surface-container-lowest p-space-lg shadow-sm'

function FinishedJourney({ journey }: { journey: LearnerJourney }) {
  return (
    <li className={`${CARD} flex items-center gap-space-md`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-primary">
        <Icon name="check" className="text-[1.25rem]" />
      </div>
      <span className="min-w-0 flex-1 text-label-lg text-on-surface">{journey.name}</span>
      <span className="shrink-0 text-label-md text-secondary">+{journey.points_earned} pts ganhos</span>
    </li>
  )
}

// The order is hers to choose, so starting another journey only happens here, in local state
type JourneyBoardProps = { initialJourneys: LearnerJourney[]; lessonStepId?: string }

function JourneyBoard({ initialJourneys, lessonStepId }: JourneyBoardProps) {
  const notify = useMockNotice()
  const [journeys, setJourneys] = useState(initialJourneys)
  const active = journeys.find((journey) => journey.status === 'active')
  const queued = journeys.filter((journey) => journey.status === 'queued')
  const finished = journeys.filter((journey) => journey.status === 'done')

  const start = (journey: LearnerJourney) => {
    setJourneys(startJourney(journeys, journey.id))
    notify(`Agora você está em ${journey.name} (simulação).`)
  }

  if (journeys.length === 0)
    return <p className={`${CARD} text-body-md text-on-surface-variant`}>{NO_JOURNEY_MESSAGE}</p>

  return (
    <>
      {active && (
        <JourneySection id="active-title" title="Em andamento">
          <div className={`${CARD} flex flex-col gap-space-lg`}>
            <h3 className="text-headline-sm text-on-surface">{active.name}</h3>
            <StepPath journey={active} lessonStepId={lessonStepId} />
          </div>
        </JourneySection>
      )}
      {queued.length > 0 && (
        <JourneySection id="queued-title" title="Na fila">
          <ul className="flex flex-col gap-space-sm">
            {queued.map((journey) => (
              <QueuedJourneyCard key={journey.id} journey={journey} onStart={() => start(journey)} />
            ))}
          </ul>
        </JourneySection>
      )}
      {finished.length > 0 && (
        <JourneySection id="finished-title" title="Concluídas">
          <ul className="flex flex-col gap-space-sm">
            {finished.map((journey) => (
              <FinishedJourney key={journey.id} journey={journey} />
            ))}
          </ul>
        </JourneySection>
      )}
    </>
  )
}

export default function JourneysIndex() {
  const { learner } = usePage<{ learner: Learner }>().props

  return (
    <CollaboratorLayout>
      <Head title="Jornadas" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-space-lg py-space-lg">
        <div className="flex flex-col gap-1">
          <h1 className="text-headline-md text-on-surface">Jornadas</h1>
          <p className="text-body-sm text-on-surface-variant">
            Faça uma jornada por vez. Você escolhe a ordem.
          </p>
        </div>
        <JourneyBoard initialJourneys={learner.journeys} lessonStepId={learner.next_step?.module_id} />
      </div>
    </CollaboratorLayout>
  )
}
