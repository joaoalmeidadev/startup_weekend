import type { ModuleSummary, Stretch, StretchKey } from '@/types/management'

export function moveModule(
  stretches: Stretch[],
  key: StretchKey,
  index: number,
  direction: -1 | 1,
): Stretch[] {
  return stretches.map((stretch) => {
    const target = index + direction
    if (stretch.key !== key || target < 0 || target >= stretch.modules.length) return stretch
    const modules = [...stretch.modules]
    ;[modules[index], modules[target]] = [modules[target], modules[index]]
    return { ...stretch, modules }
  })
}

export function addModule(stretches: Stretch[], key: StretchKey, module: ModuleSummary): Stretch[] {
  return stretches.map((stretch) =>
    stretch.key === key ? { ...stretch, modules: [...stretch.modules, module] } : stretch,
  )
}
