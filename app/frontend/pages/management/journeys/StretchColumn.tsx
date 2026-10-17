import { Icon } from '@/components/Icon'
import type { Stretch } from '@/types/management'
import { ModuleRow } from './ModuleRow'
import { STRETCHES } from './stretches'

type StretchColumnProps = {
  stretch: Stretch
  number: number
  onMove: (index: number, direction: -1 | 1) => void
  onAdd: () => void
}

export function StretchColumn({ stretch, number, onMove, onAdd }: StretchColumnProps) {
  const guide = STRETCHES.find((s) => s.key === stretch.key)

  return (
    <section
      aria-label={`Trecho ${stretch.title}`}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
    >
      <div className="flex items-center gap-space-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
          <Icon name={guide?.icon ?? 'route'} className="text-[1.375rem]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-headline-sm text-on-surface">
            {number}. {stretch.title}
          </h2>
          <span className="text-body-sm text-on-surface-variant">{guide?.hint}</span>
        </div>
      </div>
      {stretch.modules.length > 0 ? (
        <ol className="flex flex-col gap-space-sm">
          {stretch.modules.map((module, index) => (
            <ModuleRow
              key={module.id}
              module={module}
              position={index + 1}
              isFirst={index === 0}
              isLast={index === stretch.modules.length - 1}
              onMove={(direction) => onMove(index, direction)}
            />
          ))}
        </ol>
      ) : (
        <p className="rounded-xl border-2 border-dashed border-surface-container-high p-space-md text-center text-body-sm text-on-surface-variant">
          Nenhum módulo neste trecho ainda.
        </p>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="mt-auto flex h-11 items-center justify-center gap-space-xs rounded-xl bg-surface-container text-label-md text-primary transition-colors hover:bg-surface-container-high"
      >
        <Icon name="add" className="text-[1.125rem]" />
        Adicionar módulo
      </button>
    </section>
  )
}
