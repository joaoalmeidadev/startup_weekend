import { describe, expect, it } from 'vitest'
import { pointsRule, serviceJourney } from '@/test/managementFixtures'
import { toSteps } from './journeyEditing'
import { hourCostFormula, ruleSource, savedFormula, stepFormula } from './journeyFormula'

const logistics = { teacher_salary: 3960, learner_salary: 1980, reward_share: 0.4 }
const service = () => toSteps(serviceJourney.modules)

describe('stepFormula', () => {
  it('shows the hours of a step times what one hour of training costs', () => {
    const [tratamento] = service()

    expect(stepFormula(tratamento, pointsRule)).toBe('5 h × R$ 30/h = R$ 150')
    expect(stepFormula({ ...tratamento, hours: 1.5 }, pointsRule)).toBe('1,5 h × R$ 30/h = R$ 45')
    expect(stepFormula(tratamento, logistics)).toBe('5 h × R$ 27/h = R$ 135')
  })
})

describe('savedFormula', () => {
  it('multiplies the hours by what one hour of training costs', () => {
    expect(savedFormula(9, pointsRule)).toBe('9 h × R$ 30/h = R$ 270 economizados')
    expect(savedFormula(9, logistics)).toBe('9 h × R$ 27/h = R$ 243 economizados')
  })
})

describe('hourCostFormula', () => {
  it('splits one hour of training into who teaches and who learns', () => {
    expect(hourCostFormula(pointsRule)).toBe('1 h de treino = quem ensina R$ 20/h + quem aprende R$ 10/h')
    expect(hourCostFormula(logistics)).toBe('1 h de treino = quem ensina R$ 18/h + quem aprende R$ 9/h')
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
