import { pointsPerHour } from '@/lib/pointsRule'
import type { PointsRule, Reward } from '@/types/management'

// Hours of in-person training a reward's points stand for under the rule (null when the rule gives no points)
export function hoursReplaced(points: number, rule: PointsRule) {
  const perHour = pointsPerHour(rule)
  if (perHour <= 0) return null
  return (points / perHour).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

// 1 pt = R$ 1, so fewer points than the cost means the company pays more than the rule allows
export const belowCost = ({ cost, points }: Pick<Reward, 'cost' | 'points'>) => points < cost

export const brl = (value: number) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`
