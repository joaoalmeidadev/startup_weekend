import type { ModuleSummary } from '@/types/management'

// Editing the ordered list of modules the participant goes through
export function moveModule(modules: ModuleSummary[], index: number, direction: -1 | 1): ModuleSummary[] {
  const target = index + direction
  if (target < 0 || target >= modules.length) return modules
  const moved = [...modules]
  ;[moved[index], moved[target]] = [moved[target], moved[index]]
  return moved
}

export function addModule(modules: ModuleSummary[], module: ModuleSummary): ModuleSummary[] {
  return [...modules, module]
}

export function removeModule(modules: ModuleSummary[], moduleId: string): ModuleSummary[] {
  return modules.filter((module) => module.id !== moduleId)
}

export function moduleIds(modules: ModuleSummary[]) {
  return new Set(modules.map((module) => module.id))
}
