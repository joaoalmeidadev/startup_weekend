import { describe, expect, it } from 'vitest'
import { rewardsProps } from '@/test/managementFixtures'
import { belowCost, brl, hoursReplaced } from './rewardValue'

const rule = rewardsProps.points_rule

describe('rewardValue', () => {
  it('tells how many hours of in-person training the points stand for, with one decimal', () => {
    expect(hoursReplaced(25, rule)).toBe('0,7')
    expect(hoursReplaced(150, rule)).toBe('4,4')
    expect(hoursReplaced(34, rule)).toBe('1')
  })

  it('follows the share the admin sets', () => {
    expect(hoursReplaced(25, { ...rule, reward_share: 0.2 })).toBe('1,5')
  })

  it('has no equivalence when the rule gives no points', () => {
    expect(hoursReplaced(25, { ...rule, reward_share: 0 })).toBeNull()
  })

  it('flags points below the cost, since 1 pt = R$ 1', () => {
    expect(belowCost({ cost: 40, points: 39 })).toBe(true)
    expect(belowCost({ cost: 40, points: 40 })).toBe(false)
    expect(belowCost({ cost: 0, points: 40 })).toBe(false)
  })

  it('formats reais in pt-BR', () => {
    expect(brl(2890)).toBe('R$ 2.890')
  })
})
