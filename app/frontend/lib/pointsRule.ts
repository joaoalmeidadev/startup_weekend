import type { PointsRule } from '@/types/management'

// Mirrors Management::PointsRule: one hour of in-person training costs the hour of who teaches plus the hour of
// who learns (monthly salary ÷ 220 h); the company's share of that saving becomes points (1 point = R$ 1 in rewards)
export const HOURS_PER_MONTH = 220

const round2 = (value: number) => Math.round(value * 100) / 100

export const hourlyFrom = (salary: number) => round2(salary / HOURS_PER_MONTH)

export const teacherHourly = (rule: PointsRule) => hourlyFrom(rule.teacher_salary)

export const learnerHourly = (rule: PointsRule) => hourlyFrom(rule.learner_salary)

export const hourCost = (rule: PointsRule) => round2(teacherHourly(rule) + learnerHourly(rule))

export const pointsPerHour = (rule: PointsRule) => Math.round(hourCost(rule) * rule.reward_share)

export const pointsFor = (hours: number, rule: PointsRule) => Math.round(hours * pointsPerHour(rule))

export const savedFor = (hours: number, rule: PointsRule) => Math.round(hours * hourCost(rule))
