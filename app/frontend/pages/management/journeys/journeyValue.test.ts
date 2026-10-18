import { describe, expect, it } from 'vitest'
import { journey, journeyGoal, pointsRule, serviceJourney } from '@/test/managementFixtures'
import { changeHours, toSteps } from './journeyEditing'
import { formatHours, formatReais, journeyValue, weeksToFinish } from './journeyValue'

const value = (steps = toSteps(journey.modules)) => journeyValue(steps, journeyGoal, pointsRule)

describe('journeyValue', () => {
  it('adds up the training hours of the whole journey and what they save', () => {
    const service = journeyValue(toSteps(serviceJourney.modules), journeyGoal, pointsRule)

    expect(service).toMatchObject({ hours: 9, saved: 275 })
  })

  it('follows edited hours', () => {
    const edited = changeHours(toSteps(journey.modules), 'matematica', 1.5)

    expect(value(edited)).toMatchObject({ hours: 10.5, saved: 315 })
  })

  it('counts contents, lessons and the weeks to study them', () => {
    expect(value()).toMatchObject({ modules: 3, lessons: 16, weeks: 3 })
  })

  it('counts the goal competencies covered by at least one content', () => {
    expect(value()).toMatchObject({ covered: 2, total: 4 })
  })

  it('is all zero for an empty journey', () => {
    expect(value([])).toEqual({
      hours: 0,
      saved: 0,
      modules: 0,
      lessons: 0,
      weeks: 0,
      covered: 0,
      total: 4,
    })
  })
})

describe('weeksToFinish', () => {
  it('turns lessons of 5 minutes into weeks of 25 minutes, never less than one week', () => {
    expect(weeksToFinish(0)).toBe(0)
    expect(weeksToFinish(2)).toBe(1)
    expect(weeksToFinish(12)).toBe(2)
    expect(weeksToFinish(13)).toBe(3)
  })
})

describe('formatReais', () => {
  it('writes the amount in reais with the Brazilian thousands separator', () => {
    expect(formatReais(1040)).toBe('R$ 1.040')
    expect(formatReais(480)).toBe('R$ 480')
  })
})

describe('formatHours', () => {
  it('writes hours with a Brazilian decimal comma', () => {
    expect(formatHours(9)).toBe('9')
    expect(formatHours(10.5)).toBe('10,5')
  })
})
