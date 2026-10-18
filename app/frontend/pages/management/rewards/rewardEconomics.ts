import type { Reward, RewardRule } from '@/types/management'

type Priced = Pick<Reward, 'cost' | 'points'>

const round2 = (value: number) => Math.round(value * 100) / 100

// Enough points for the training saved to cover the cost at the rule's share (rounded to avoid float noise)
export function pointsFor(cost: number, rule: RewardRule) {
  const exact = Number((cost / (rule.point_value * rule.share)).toFixed(6))
  return Math.max(Math.ceil(exact), rule.min_points)
}

export function economics({ cost, points }: Priced, rule: RewardRule) {
  const saved = round2(points * rule.point_value)
  const kept = round2(saved - cost)
  return { saved, kept, keptShare: Math.round((kept / saved) * 100) }
}

export const withinRule = ({ cost, points }: Priced, rule: RewardRule) => points >= pointsFor(cost, rule)

export const brl = (value: number) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`
