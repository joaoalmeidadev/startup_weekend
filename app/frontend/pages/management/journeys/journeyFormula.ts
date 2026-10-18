import { hourCost, hourlyFrom, learnerHourly, stepHourCost, teacherHourly } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import type { JourneyStep } from './journeyEditing'
import { formatHours, formatReais } from './journeyValue'

// The math behind the journey figures, written out so the admin can follow it

const teacherOf = (step: JourneyStep, rule: PointsRule) =>
  hourlyFrom(step.module.teacher_salary ?? rule.teacher_salary)

const stepSaved = (step: JourneyStep, rule: PointsRule) =>
  Math.round(step.hours * stepHourCost(rule, step.module.teacher_salary) * 100) / 100

// Each step uses the hour of who would give that content training plus the hour of who learns
export function stepFormula(step: JourneyStep, rule: PointsRule) {
  const hours = `${formatHours(step.hours)} h`
  const hourly = `(${formatReais(teacherOf(step, rule))} + ${formatReais(learnerHourly(rule))})/h`
  return `${hours} × ${hourly} = ${formatReais(stepSaved(step, rule))}`
}

// One multiplication when every step costs the same hour; otherwise the sum of the steps
export function savedFormula(steps: JourneyStep[], rule: PointsRule) {
  const total = formatReais(Math.round(steps.reduce((sum, step) => sum + stepSaved(step, rule), 0)))
  const sameHour = new Set(steps.map((step) => stepHourCost(rule, step.module.teacher_salary))).size <= 1
  if (sameHour) {
    const hours = steps.reduce((sum, step) => sum + step.hours, 0)
    const hourly = steps.length > 0 ? stepHourCost(rule, steps[0].module.teacher_salary) : hourCost(rule)
    return `${formatHours(hours)} h × ${formatReais(hourly)}/h = ${total} economizados`
  }
  return `${steps.map((step) => formatReais(stepSaved(step, rule))).join(' + ')} = ${total} economizados`
}

export function hourCostFormula(rule: PointsRule) {
  return `1 h de treino = quem daria o treino (o valor de cada conteúdo; padrão ${formatReais(teacherHourly(rule))}/h) + quem aprende ${formatReais(learnerHourly(rule))}/h`
}

// The source comes from the server as "Atendimento · padrão da empresa", "padrão da empresa" or
// "menor valor entre ..."; each reads as a sentence on its own
export function ruleSource(source: string) {
  if (source.startsWith('menor valor')) return `Vale o ${source}`
  if (source === 'padrão da empresa') return `Valor ${source}`
  return `Valor de ${source}`
}
