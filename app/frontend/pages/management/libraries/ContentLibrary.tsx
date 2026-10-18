import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { SOURCES, SOURCE_ORDER, SourceBadge } from '@/components/SourceBadge'
import { formatSummary } from '@/lib/lessonFormats'
import type { ContentSource, ModuleSummary } from '@/types/management'
import { SourceGuideModal } from './SourceGuideModal'

type Filter = ContentSource | 'all'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  ...SOURCE_ORDER.map((source) => ({ value: source, label: SOURCES[source].label })),
]

function FilterBar({ current, onChange }: { current: Filter; onChange: (filter: Filter) => void }) {
  return (
    <div className="flex flex-wrap gap-space-xs" role="group" aria-label="Filtrar por origem">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          aria-pressed={current === filter.value}
          onClick={() => onChange(filter.value)}
          className="rounded-full px-space-md py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container aria-pressed:bg-primary aria-pressed:text-on-primary"
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

function SourceGuideButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-label-md text-primary hover:underline"
      >
        <Icon name="info" className="text-[1rem]" />
        Entenda as origens
      </button>
      {open && <SourceGuideModal onClose={() => setOpen(false)} />}
    </>
  )
}

function LibraryItem({ module }: { module: ModuleSummary }) {
  return (
    <li>
      <Link
        href={`/management/modules/${module.id}`}
        className="flex items-center justify-between gap-space-md rounded-xl p-space-sm transition-colors hover:bg-surface-container-low"
      >
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-label-lg text-on-surface">{module.name}</span>
          <span className="truncate text-body-sm text-on-surface-variant">
            {formatSummary(module.formats)}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-space-xs">
          <SourceBadge source={module.source} />
          <Icon name="chevron_right" className="text-[1.25rem] text-outline" />
        </span>
      </Link>
    </li>
  )
}

export function ContentLibrary({ library }: { library: ModuleSummary[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? library : library.filter((module) => module.source === filter)

  return (
    <section
      aria-label="Módulos"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-center">
        <FilterBar current={filter} onChange={setFilter} />
        <SourceGuideButton />
      </div>
      <ul className="grid grid-cols-1 gap-x-space-md gap-y-1 md:grid-cols-2">
        {visible.map((module) => (
          <LibraryItem key={module.id} module={module} />
        ))}
      </ul>
    </section>
  )
}
