import { describe, expect, it } from 'vitest'
import { learner } from '@/test/collaboratorFixtures'
import { startJourney } from './learnerJourneys'

describe('startJourney', () => {
  const started = startJourney(learner.journeys, 'atendimento-na-pratica')
  const byId = (id: string) => started.find((journey) => journey.id === id)!

  it('makes the chosen journey the active one, from its first step not done', () => {
    expect(byId('atendimento-na-pratica').status).toBe('active')
    expect(byId('atendimento-na-pratica').steps.map((step) => step.status)).toEqual(['current', 'locked'])
  })

  it('sends the journey she was doing back to the queue, keeping what she finished', () => {
    expect(byId('jeito-distribuidora-sul').status).toBe('queued')
    expect(byId('jeito-distribuidora-sul').steps.map((step) => step.status)).toEqual(['done', 'locked'])
  })

  it('leaves the finished journeys alone', () => {
    expect(byId('base-nivela')).toEqual(learner.journeys[0])
  })

  it('picks up a journey again where she stopped', () => {
    const back = startJourney(started, 'jeito-distribuidora-sul')

    expect(
      back.find((journey) => journey.id === 'jeito-distribuidora-sul')!.steps.map((step) => step.status),
    ).toEqual(['done', 'current'])
  })
})
