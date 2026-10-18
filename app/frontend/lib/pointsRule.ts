import type { PointsRule } from '@/types/management'

// Mirrors Management::PointsRule: one hour of in-person training saves the hour of who teaches plus the hour of who
// learns (monthly salary ÷ 220 h); the learner earns their own hour × the company's share per hour studied
// (1 point = R$ 1 in rewards)
export const HOURS_PER_MONTH = 220

const round2 = (value: number) => Math.round(value * 100) / 100

export const hourlyFrom = (salary: number) => round2(salary / HOURS_PER_MONTH)

export const teacherHourly = (rule: PointsRule) => hourlyFrom(rule.teacher_salary)

export const learnerHourly = (rule: PointsRule) => hourlyFrom(rule.learner_salary)

export const hourCost = (rule: PointsRule) => round2(teacherHourly(rule) + learnerHourly(rule))

// Points come from the learner's own hour (their salary), never from who teaches
export const pointsPerHour = (rule: PointsRule) =>
  Math.round(learnerHourly(rule) * rule.reward_share * 10) / 10

export const pointsFor = (hours: number, rule: PointsRule) =>
  Math.round(hours * learnerHourly(rule) * rule.reward_share)

export const savedFor = (hours: number, rule: PointsRule) => Math.round(hours * hourCost(rule))
