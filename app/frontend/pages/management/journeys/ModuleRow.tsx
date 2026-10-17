import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { StatusPill } from '@/components/StatusPill'
import type { ModuleSummary } from '@/types/management'

type ModuleRowProps = {
  module: ModuleSummary
  position: number
  isFirst: boolean
  isLast: boolean
  onMove: (direction: -1 | 1) => void
}

const ARROW =
  'flex size-7 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30'

export function ModuleRow({ module, position, isFirst, isLast, onMove }: ModuleRowProps) {
  return (
    <li className="flex items-stretch gap-space-xs rounded-xl bg-surface-container-low">
      <Link
        href={`/management/modules/${module.id}`}
        className="flex min-w-0 flex-1 items-start gap-space-sm p-space-sm"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-sm text-on-primary">
          {position}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-label-lg text-on-surface">{module.name}</span>
          <span className="text-body-sm text-on-surface-variant">
            {module.competency} · {module.lessons} lições
          </span>
          <StatusPill status={module.status} />
        </span>
      </Link>
      <div className="flex flex-col justify-center pr-space-xs">
        <button
          type="button"
          aria-label={`Subir ${module.name}`}
          disabled={isFirst}
          onClick={() => onMove(-1)}
          className={ARROW}
        >
          <Icon name="keyboard_arrow_up" className="text-[1.25rem]" />
        </button>
        <button
          type="button"
          aria-label={`Descer ${module.name}`}
          disabled={isLast}
          onClick={() => onMove(1)}
          className={ARROW}
        >
          <Icon name="keyboard_arrow_down" className="text-[1.25rem]" />
        </button>
      </div>
    </li>
  )
}
