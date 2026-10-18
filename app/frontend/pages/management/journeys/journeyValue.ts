import { savedFor } from '@/lib/pointsRule'
import type { JourneyGoal, PointsRule } from '@/types/management'
import type { JourneyStep } from './journeyEditing'

// Ritmo do pitch: 5 min por dia útil
export const MINUTES_PER_LESSON = 5
export const MINUTES_PER_WEEK = 25

export type JourneyValue = {
  hours: number
  saved: number
  modules: number
  lessons: number
  weeks: number
  covered: number
  total: number
}

const sum = (steps: JourneyStep[], pick: (step: JourneyStep) => number) =>
  steps.reduce((total, step) => total + pick(step), 0)

export function weeksToFinish(lessons: number) {
  if (lessons === 0) return 0
  return Math.max(1, Math.round((lessons * MINUTES_PER_LESSON) / MINUTES_PER_WEEK))
}

export function coveredCompetencies(steps: JourneyStep[], goal: JourneyGoal) {
  return goal.competencies.filter((competency) => steps.some((step) => step.module.competency === competency))
}

export function journeyValue(steps: JourneyStep[], goal: JourneyGoal, rule: PointsRule): JourneyValue {
  const hours = sum(steps, (step) => step.hours)
  const lessons = sum(steps, (step) => step.module.lessons)

  return {
    hours,
    saved: savedFor(hours, rule),
    modules: steps.length,
    lessons,
    weeks: weeksToFinish(lessons),
    covered: coveredCompetencies(steps, goal).length,
    total: goal.competencies.length,
  }
}

export function formatReais(amount: number) {
  return `R$ ${amount.toLocaleString('pt-BR')}`
}

export function formatHours(hours: number) {
  return hours.toLocaleString('pt-BR')
}
