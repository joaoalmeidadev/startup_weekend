import { describe, expect, it } from 'vitest'
import {
  hourCost,
  hourlyFrom,
  learnerHourly,
  pointsFor,
  pointsPerHour,
  savedFor,
  teacherHourly,
} from './pointsRule'

const rule = { teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4 }

describe('pointsRule', () => {
  it('turns monthly salaries into hours (÷ 220 h)', () => {
    expect(hourlyFrom(4400)).toBe(20)
    expect(teacherHourly(rule)).toBe(20)
    expect(learnerHourly(rule)).toBe(10)
    expect(hourCost(rule)).toBe(30)
  })

  it("turns the company's share of the saving into points per hour", () => {
    expect(pointsPerHour(rule)).toBe(12)
    expect(pointsPerHour({ ...rule, reward_share: 0.6 })).toBe(18)
  })

  it('prices hours of training replaced in points and R$', () => {
    expect(pointsFor(5, rule)).toBe(60)
    expect(savedFor(9, rule)).toBe(270)
  })

  it('matches a sector with its own salaries', () => {
    const logistics = { ...rule, teacher_salary: 3960, learner_salary: 1980 }
    expect(hourCost(logistics)).toBe(27)
    expect(pointsPerHour(logistics)).toBe(11)
  })
})
