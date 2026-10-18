import { describe, expect, it } from 'vitest'
import { pointsRule, serviceJourney } from '@/test/managementFixtures'
import { toSteps } from './journeyEditing'
import { hourCostFormula, ruleSource, savedFormula, stepFormula } from './journeyFormula'

const logistics = { teacher_salary: 3960, learner_salary: 1980, reward_share: 0.4 }
const service = () => toSteps(serviceJourney.modules)

describe('stepFormula', () => {
  it('uses the hour of who would give that content training plus the hour of who learns', () => {
    const [tratamento, uso] = service()

    expect(stepFormula(tratamento, pointsRule)).toBe('5 h × (R$ 25 + R$ 10)/h = R$ 175')
    expect(stepFormula(uso, pointsRule)).toBe('4 h × (R$ 15 + R$ 10)/h = R$ 100')
    expect(stepFormula({ ...tratamento, hours: 1.5 }, pointsRule)).toBe('1,5 h × (R$ 25 + R$ 10)/h = R$ 52,5')
  })

  it('falls back to the default teacher of the journey rule', () => {
    const [tratamento] = service()
    const plain = { ...tratamento, module: { ...tratamento.module, teacher_salary: null } }

    expect(stepFormula(plain, logistics)).toBe('5 h × (R$ 18 + R$ 9)/h = R$ 135')
  })
})

describe('savedFormula', () => {
  it('adds up the steps when they have different teachers', () => {
    expect(savedFormula(service(), pointsRule)).toBe('R$ 175 + R$ 100 = R$ 275 economizados')
  })

  it('multiplies the hours when every step uses the same hour', () => {
    const plain = service().map((step) => ({ ...step, module: { ...step.module, teacher_salary: null } }))

    expect(savedFormula(plain, pointsRule)).toBe('9 h × R$ 30/h = R$ 270 economizados')
  })
})

describe('hourCostFormula', () => {
  it('explains each content uses who would give it, and who learns', () => {
    expect(hourCostFormula(pointsRule)).toBe(
      '1 h de treino = quem daria o treino (o valor de cada conteúdo; padrão R$ 20/h) + quem aprende R$ 10/h',
    )
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
