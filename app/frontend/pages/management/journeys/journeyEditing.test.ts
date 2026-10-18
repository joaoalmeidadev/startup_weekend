import { describe, expect, it } from 'vitest'
import { catalog, journey } from '@/test/managementFixtures'
import {
  addStep,
  changeHours,
  moveStep,
  removeStep,
  stepModuleIds,
  toSteps,
  type JourneyStep,
} from './journeyEditing'

const ids = (steps: JourneyStep[]) => steps.map((step) => step.module.id)
const postura = catalog[0].modules[2]
const steps = toSteps(journey.modules)

describe('journeyEditing', () => {
  it('starts each step with the training hours of its content', () => {
    expect(steps.map(({ hours }) => hours)).toEqual([3, 3, 6])
  })

  it('swaps a step with its neighbour', () => {
    expect(ids(moveStep(steps, 1, -1))).toEqual(['matematica', 'conversa-clara', 'rotinas-de-atendimento'])
  })

  it('ignores moves past the edges', () => {
    expect(moveStep(steps, 0, -1)).toEqual(steps)
    expect(moveStep(steps, 2, 1)).toEqual(steps)
  })

  it('appends a content to the end of the journey with its own hours', () => {
    const added = addStep(steps, postura)

    expect(ids(added)).toEqual([
      'conversa-clara',
      'matematica',
      'rotinas-de-atendimento',
      'postura-e-empatia',
    ])
    expect(added[3]).toEqual({ module: postura, hours: 3 })
  })

  it('removes a step', () => {
    expect(ids(removeStep(steps, 'conversa-clara'))).toEqual(['matematica', 'rotinas-de-atendimento'])
  })

  it('lists the ids of every content in the journey', () => {
    expect(stepModuleIds(steps)).toEqual(new Set(['conversa-clara', 'matematica', 'rotinas-de-atendimento']))
  })

  it('changes the hours of one step only', () => {
    expect(changeHours(steps, 'matematica', 4.5).map((step) => step.hours)).toEqual([3, 4.5, 6])
  })
})
