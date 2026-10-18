import type { PointsRule } from '@/types/management'

// Mirrors Management::PointsRule: one hour of in-person training costs the manager hour plus the person hour,
// and the admin's share of that saving becomes points (1 point = R$ 1 in rewards)
export const hourCost = (rule: PointsRule) => rule.manager_hourly + rule.person_hourly

export const pointsPerHour = (rule: PointsRule) => Math.round(hourCost(rule) * rule.reward_share)

export const pointsFor = (hours: number, rule: PointsRule) => Math.round(hours * pointsPerHour(rule))

export const savedFor = (hours: number, rule: PointsRule) => Math.round(hours * hourCost(rule))
