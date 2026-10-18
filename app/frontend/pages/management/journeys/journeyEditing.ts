import type { ModuleSummary } from '@/types/management'

// One stop of the participant's path: the content, the hours of in-person training it replaces
// and the points the admin typed by hand, if any (they override the rule)
export type JourneyStep = { module: ModuleSummary; hours: number; manualPoints: number | null }

const toStep = (module: ModuleSummary): JourneyStep => ({
  module,
  hours: module.teaching_hours,
  manualPoints: null,
})

export const toSteps = (modules: ModuleSummary[]) => modules.map(toStep)

export function moveStep(steps: JourneyStep[], index: number, direction: -1 | 1): JourneyStep[] {
  const target = index + direction
  if (target < 0 || target >= steps.length) return steps
  const moved = [...steps]
  ;[moved[index], moved[target]] = [moved[target], moved[index]]
  return moved
}

export function addStep(steps: JourneyStep[], module: ModuleSummary): JourneyStep[] {
  return [...steps, toStep(module)]
}

export function removeStep(steps: JourneyStep[], moduleId: string): JourneyStep[] {
  return steps.filter((step) => step.module.id !== moduleId)
}

export function stepModuleIds(steps: JourneyStep[]) {
  return new Set(steps.map((step) => step.module.id))
}

const updateStep = (steps: JourneyStep[], moduleId: string, changes: Partial<JourneyStep>) =>
  steps.map((step) => (step.module.id === moduleId ? { ...step, ...changes } : step))

export function changeHours(steps: JourneyStep[], moduleId: string, hours: number) {
  return updateStep(steps, moduleId, { hours })
}

export function changeManualPoints(steps: JourneyStep[], moduleId: string, manualPoints: number | null) {
  return updateStep(steps, moduleId, { manualPoints })
}
