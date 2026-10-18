import type { JourneyGoal, ModuleSummary, Stretch } from '@/types/management'

// Premissas do pitch: hora de repasse (veterano + gestor) e o ritmo de 5 min por dia útil
export const HOURLY_RATE = 40
export const MINUTES_PER_LESSON = 5
export const MINUTES_PER_WEEK = 25

export type JourneyValue = {
  hours: number
  cost: number
  modules: number
  lessons: number
  weeks: number
  covered: number
  total: number
}

const sum = (modules: ModuleSummary[], pick: (module: ModuleSummary) => number) =>
  modules.reduce((total, module) => total + pick(module), 0)

export function weeksToFinish(lessons: number) {
  if (lessons === 0) return 0
  return Math.max(1, Math.round((lessons * MINUTES_PER_LESSON) / MINUTES_PER_WEEK))
}

export function coveredCompetencies(modules: ModuleSummary[], goal: JourneyGoal) {
  return goal.competencies.filter((competency) => modules.some((module) => module.covers === competency))
}

export function journeyValue(stretches: Stretch[], goal: JourneyGoal): JourneyValue {
  const modules = stretches.flatMap((stretch) => stretch.modules)
  const hours = sum(modules, (module) => module.teaching_hours)
  const lessons = sum(modules, (module) => module.lessons)

  return {
    hours,
    cost: hours * HOURLY_RATE,
    modules: modules.length,
    lessons,
    weeks: weeksToFinish(lessons),
    covered: coveredCompetencies(modules, goal).length,
    total: goal.competencies.length,
  }
}

export function formatReais(amount: number) {
  return `R$ ${amount.toLocaleString('pt-BR')}`
}
