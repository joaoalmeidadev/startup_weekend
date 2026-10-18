import { describe, expect, it } from 'vitest'
import {
  hourCost,
  hourlyFrom,
  learnerHourly,
  pointsFor,
  pointsPerHour,
  savedFor,
  stepHourCost,
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

  it("gives the learner their own hour × the company's share per hour studied", () => {
    expect(pointsPerHour(rule)).toBe(4)
    expect(pointsPerHour({ ...rule, reward_share: 0.6 })).toBe(6)
    expect(pointsPerHour({ ...rule, learner_salary: 2090 })).toBe(3.8)
  })

  it('prices hours studied in points, and hours of training replaced in R$', () => {
    expect(pointsFor(5, rule)).toBe(20)
    expect(pointsFor(8, { ...rule, learner_salary: 2090 })).toBe(30)
    expect(savedFor(9, rule)).toBe(270)
  })

  it('matches a sector with its own salaries', () => {
    const logistics = { ...rule, teacher_salary: 3960, learner_salary: 1980 }
    expect(hourCost(logistics)).toBe(27)
    expect(pointsPerHour(logistics)).toBe(3.6)
  })

  it('uses the hour of who would give a content training, or the default one', () => {
    expect(stepHourCost(rule, 5500)).toBe(35)
    expect(stepHourCost(rule, null)).toBe(30)
  })
})
