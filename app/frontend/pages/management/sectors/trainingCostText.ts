import { hourCost } from '@/lib/pointsRule'
import type { PointsRule, SectorTrainingCost } from '@/types/management'

const SHARE_TITLES: Record<number, string> = { 0.2: 'Econômico', 0.4: 'Equilibrado', 0.6: 'Generoso' }

export const reais = (value: number) => `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`

export const hourText = (rule: PointsRule) => `${reais(hourCost(rule))}/h`

// "Equilibrado (40%)", or "Personalizado (35%)" for a share outside the three options
export const shareText = (share: number) =>
  `${SHARE_TITLES[share] ?? 'Personalizado'} (${Math.round(share * 100)}%)`

// The rule a work sector really uses: its own salaries or the company's, always with the company share
export const sectorRule = (company: PointsRule, cost: SectorTrainingCost | null): PointsRule =>
  cost?.own
    ? { ...company, teacher_salary: cost.teacher_salary, learner_salary: cost.learner_salary }
    : company
