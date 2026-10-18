import { describe, expect, it } from 'vitest'
import { rewardsProps } from '@/test/managementFixtures'
import { economics, pointsFor, withinRule } from './rewardEconomics'

const { rule } = rewardsProps

describe('rewardEconomics', () => {
  it('suggests enough points for the reward to cost at most 40% of the training saved', () => {
    expect(pointsFor(25, rule)).toBe(53)
    expect(pointsFor(150, rule)).toBe(313)
    expect(pointsFor(24, rule)).toBe(50)
  })

  it('still asks for some effort when the reward costs nothing', () => {
    expect(pointsFor(0, rule)).toBe(30)
  })

  it('tells the training saved, what the company keeps and its share', () => {
    expect(economics({ cost: 25, points: 53 }, rule)).toEqual({ saved: 63.6, kept: 38.6, keptShare: 61 })
  })

  it('accepts only points at or above the rule', () => {
    expect(withinRule({ cost: 25, points: 53 }, rule)).toBe(true)
    expect(withinRule({ cost: 25, points: 40 }, rule)).toBe(false)
  })
})
