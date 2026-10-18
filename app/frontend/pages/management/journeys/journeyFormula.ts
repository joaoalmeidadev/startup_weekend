import { hourCost, learnerHourly, savedFor, teacherHourly } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import type { JourneyStep } from './journeyEditing'
import { formatHours, formatReais } from './journeyValue'

// The math behind the journey figures, written out so the admin can follow it

const savedTerm = (hours: number, rule: PointsRule) =>
  `${formatHours(hours)} h × ${formatReais(hourCost(rule))}/h = ${formatReais(savedFor(hours, rule))}`

export function stepFormula(step: JourneyStep, rule: PointsRule) {
  return savedTerm(step.hours, rule)
}

export function savedFormula(hours: number, rule: PointsRule) {
  return `${savedTerm(hours, rule)} economizados`
}

export function hourCostFormula(rule: PointsRule) {
  return `1 h de treino = quem ensina ${formatReais(teacherHourly(rule))}/h + quem aprende ${formatReais(learnerHourly(rule))}/h`
}

// The source comes from the server as "Atendimento · padrão da empresa", "padrão da empresa" or
// "menor valor entre ..."; each reads as a sentence on its own
export function ruleSource(source: string) {
  if (source.startsWith('menor valor')) return `Vale o ${source}`
  if (source === 'padrão da empresa') return `Valor ${source}`
  return `Valor de ${source}`
}
