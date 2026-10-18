import type { LearnerJourney, LearnerJourneyStatus } from '@/types/collaborator'

// Only one lesson is mocked so far: the one of her real next step
export const DEMO_LESSON_PATH = '/collaborator/lessons/rotinas-da-distribuidora'

export const NO_JOURNEY_MESSAGE = 'Sua empresa ainda vai liberar sua primeira jornada.'

export const JOURNEY_STATUS: Record<LearnerJourneyStatus, { label: string; tone: string }> = {
  done: { label: 'Concluída', tone: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
  active: { label: 'Em andamento', tone: 'bg-secondary-fixed text-on-secondary-container' },
  queued: { label: 'Na fila', tone: 'bg-surface-container-high text-on-surface-variant' },
}

export const stepsDone = (journey: LearnerJourney) =>
  journey.steps.filter((step) => step.status === 'done').length

export const pointsLeft = (journey: LearnerJourney) => journey.points_total - journey.points_earned

// Steps of a journey she is not doing right now: what is done stays done, the rest waits
const pause = (journey: LearnerJourney): LearnerJourney => ({
  ...journey,
  status: 'queued',
  steps: journey.steps.map((step) => (step.status === 'done' ? step : { ...step, status: 'locked' })),
})

// The first step not done becomes the current one
const resume = (journey: LearnerJourney): LearnerJourney => {
  const current = journey.steps.findIndex((step) => step.status !== 'done')
  return {
    ...journey,
    status: 'active',
    steps: journey.steps.map((step, index) => (index === current ? { ...step, status: 'current' } : step)),
  }
}

// One journey at a time: starting a queued one sends the active one back to the queue
export function startJourney(journeys: LearnerJourney[], id: string): LearnerJourney[] {
  return journeys.map((journey) => {
    if (journey.id === id) return resume(pause(journey))
    return journey.status === 'active' ? pause(journey) : journey
  })
}
