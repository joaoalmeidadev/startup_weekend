import { describe, expect, it } from 'vitest'
import { journey, pointsRule, serviceJourney } from '@/test/managementFixtures'
import { changeHours, changeManualPoints, toSteps } from './journeyEditing'
import {
  hourCostFormula,
  manualNote,
  pointsFormula,
  ruleSource,
  savedFormula,
  stepFormula,
} from './journeyFormula'

const logistics = { teacher_salary: 3960, learner_salary: 1980, reward_share: 0.4 }
const service = () => toSteps(serviceJourney.modules)

describe('stepFormula', () => {
  it('shows the hours of a step times the points per hour', () => {
    const [tratamento] = service()

    expect(stepFormula(tratamento, pointsRule)).toBe('5 h × 12 pts/h = 60 pts')
    expect(stepFormula({ ...tratamento, hours: 1.5 }, pointsRule)).toBe('1,5 h × 12 pts/h = 18 pts')
  })

  it('shows the typed points when the admin set them by hand', () => {
    const [tratamento] = service()

    expect(stepFormula({ ...tratamento, manualPoints: 100 }, pointsRule)).toBe('manual: 100 pts')
  })
})

describe('savedFormula', () => {
  it('multiplies the hours by what one hour of training costs', () => {
    expect(savedFormula(9, pointsRule)).toBe('9 h × R$ 30/h = R$ 270 economizados')
    expect(savedFormula(9, logistics)).toBe('9 h × R$ 27/h = R$ 243 economizados')
  })
})

describe('pointsFormula', () => {
  it('multiplies the hours by the points per hour', () => {
    expect(pointsFormula(service(), pointsRule)).toBe('9 h × 12 pts/h = 108 pts')
    expect(pointsFormula(service(), logistics)).toBe('9 h × 11 pts/h = 99 pts')
  })

  it('adds the manual points apart, counting only the hours priced by the rule', () => {
    const steps = changeManualPoints(toSteps(journey.modules), 'rotinas-de-atendimento', 100)

    expect(pointsFormula(steps, pointsRule)).toBe('6 h × 12 pts/h + 100 pts manuais = 172 pts')
  })

  it('has only manual points when every step was typed by hand', () => {
    const steps = changeManualPoints(service(), 'tratamento-de-reclamacoes', 40)
    const allManual = changeManualPoints(steps, 'uso-do-sistema', 10)

    expect(pointsFormula(allManual, pointsRule)).toBe('50 pts manuais = 50 pts')
  })

  it('follows edited hours', () => {
    const steps = changeHours(service(), 'uso-do-sistema', 1)

    expect(pointsFormula(steps, pointsRule)).toBe('6 h × 12 pts/h = 72 pts')
  })
})

describe('hourCostFormula', () => {
  it('splits one hour of training into who teaches and who learns', () => {
    expect(hourCostFormula(pointsRule)).toBe('1 h de treino = quem ensina R$ 20/h + quem aprende R$ 10/h')
    expect(hourCostFormula(logistics)).toBe('1 h de treino = quem ensina R$ 18/h + quem aprende R$ 9/h')
  })
})

describe('manualNote', () => {
  it('says how many steps have manual points', () => {
    const one = changeManualPoints(service(), 'uso-do-sistema', 10)
    const two = changeManualPoints(one, 'tratamento-de-reclamacoes', 10)

    expect(manualNote(service())).toBeNull()
    expect(manualNote(one)).toBe('inclui pontos manuais em 1 etapa')
    expect(manualNote(two)).toBe('inclui pontos manuais em 2 etapas')
  })
})

describe('ruleSource', () => {
  it('tells where the value of the hour comes from', () => {
    expect(ruleSource('Atendimento · padrão da empresa')).toBe('Valor de Atendimento · padrão da empresa')
    expect(ruleSource('Logística · valor próprio')).toBe('Valor de Logística · valor próprio')
    expect(ruleSource('padrão da empresa')).toBe('Valor padrão da empresa')
    expect(ruleSource('menor valor entre Atendimento, Comercial e Logística')).toBe(
      'Vale o menor valor entre Atendimento, Comercial e Logística',
    )
  })
})
