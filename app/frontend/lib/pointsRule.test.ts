import { describe, expect, it } from 'vitest'
import { hourCost, pointsFor, pointsPerHour, savedFor } from './pointsRule'

const rule = { manager_hourly: 60, person_hourly: 25, reward_share: 0.4 }

describe('pointsRule', () => {
  it('costs the manager hour plus the person hour', () => {
    expect(hourCost(rule)).toBe(85)
  })

  it('turns the admin share of the saving into points per hour', () => {
    expect(pointsPerHour(rule)).toBe(34)
    expect(pointsPerHour({ ...rule, reward_share: 0.5 })).toBe(43)
  })

  it('prices hours of training replaced in points and R$', () => {
    expect(pointsFor(6, rule)).toBe(204)
    expect(savedFor(6, rule)).toBe(510)
  })
})
