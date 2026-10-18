import { describe, expect, it } from 'vitest'
import { hoursText, pointsFormula } from './submissionText'

describe('hoursText', () => {
  it('writes the training hours the Brazilian way', () => {
    expect(hoursText(3)).toBe('3 h de treino')
    expect(hoursText(1.5)).toBe('1,5 h de treino')
  })
})

describe('pointsFormula', () => {
  it('shows hours × the author hour × the company share = the suggestion', () => {
    expect(pointsFormula({ hours: 3, hourly: 12, share: 0.4, points: 14 })).toBe(
      '3 h × R$ 12/h × 40% = 14 pts',
    )
  })

  it('keeps cents when the hour is not round', () => {
    expect(pointsFormula({ hours: 1.5, hourly: 9.5, share: 0.4, points: 6 })).toBe(
      '1,5 h × R$ 9,50/h × 40% = 6 pts',
    )
  })
})
