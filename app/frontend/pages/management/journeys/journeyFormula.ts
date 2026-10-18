import { hourCost, learnerHourly, pointsFor, pointsPerHour, savedFor, teacherHourly } from '@/lib/pointsRule'
import type { PointsRule } from '@/types/management'
import type { JourneyStep } from './journeyEditing'
import { formatHours, formatReais } from './journeyValue'

// The math behind the journey figures, written out so the admin can follow it

const sum = (numbers: number[]) => numbers.reduce((total, number) => total + number, 0)

const isManual = (step: JourneyStep) => step.manualPoints !== null

const ruleTerm = (hours: number, rule: PointsRule) => `${formatHours(hours)} h × ${pointsPerHour(rule)} pts/h`

export function stepFormula(step: JourneyStep, rule: PointsRule) {
  if (step.manualPoints !== null) return `manual: ${step.manualPoints} pts`
  return `${ruleTerm(step.hours, rule)} = ${pointsFor(step.hours, rule)} pts`
}

export function savedFormula(hours: number, rule: PointsRule) {
  return `${formatHours(hours)} h × ${formatReais(hourCost(rule))}/h = ${formatReais(savedFor(hours, rule))} economizados`
}

// Points by the rule come from the hours of the steps without manual points; manual points add up apart
export function pointsFormula(steps: JourneyStep[], rule: PointsRule) {
  const priced = steps.filter((step) => !isManual(step))
  const typed = steps.filter(isManual)
  const manual = sum(typed.map((step) => step.manualPoints ?? 0))
  const rulePoints = sum(priced.map((step) => pointsFor(step.hours, rule)))
  const allTyped = typed.length > 0 && priced.length === 0
  const terms = [
    ...(allTyped ? [] : [ruleTerm(sum(priced.map((step) => step.hours)), rule)]),
    ...(typed.length > 0 ? [`${manual} pts manuais`] : []),
  ]
  return `${terms.join(' + ')} = ${rulePoints + manual} pts`
}

export function hourCostFormula(rule: PointsRule) {
  return `1 h de treino = quem ensina ${formatReais(teacherHourly(rule))}/h + quem aprende ${formatReais(learnerHourly(rule))}/h`
}

export function manualNote(steps: JourneyStep[]) {
  const count = steps.filter(isManual).length
  if (count === 0) return null
  return `inclui pontos manuais em ${count} ${count === 1 ? 'etapa' : 'etapas'}`
}

// The source comes from the server as "Atendimento · padrão da empresa", "padrão da empresa" or
// "menor valor entre ..."; each reads as a sentence on its own
export function ruleSource(source: string) {
  if (source.startsWith('menor valor')) return `Vale o ${source}`
  if (source === 'padrão da empresa') return `Valor ${source}`
  return `Valor de ${source}`
}
