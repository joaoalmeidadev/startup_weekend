import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResearchShare } from '@/components/ResearchShare'
import { SOURCES, SOURCE_ORDER, SourceBadge } from '@/components/SourceBadge'
import type { ContentSource, LibraryModule } from '@/types/management'

type Filter = ContentSource | 'all'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  ...SOURCE_ORDER.map((source) => ({ value: source, label: SOURCES[source].label })),
]

export function journeysLabel(count: number) {
  if (count === 0) return 'Em nenhuma jornada ainda'
  return count === 1 ? 'Em 1 jornada' : `Em ${count} jornadas`
}

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

function LibraryItem({ module }: { module: LibraryModule }) {
  return (
    <li>
      <Link
        href={`/management/modules/${module.id}`}
        className="flex items-center justify-between gap-space-md rounded-xl p-space-sm transition-colors hover:bg-surface-container-low"
      >
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-label-lg text-on-surface">{module.name}</span>
          <span className="flex flex-wrap items-center gap-x-space-sm gap-y-1 text-body-sm text-on-surface-variant">
            <SourceBadge source={module.source} />
            <span>{module.lessons} lições</span>
            <span aria-hidden="true">·</span>
            <span>{journeysLabel(module.journeys_count)}</span>
            <ResearchShare share={module.research_share} />
          </span>
        </span>
        <Icon name="chevron_right" className="text-[1.25rem] text-outline" />
      </Link>
    </li>
  )
}

function NivelaShelf({ products, onShow }: { products: LibraryModule[]; onShow: () => void }) {
  const lessons = products.reduce((total, module) => total + module.lessons, 0)
  return (
    <section
      aria-labelledby="nivela-shelf-title"
      className="flex flex-col justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-md md:flex-row md:items-center"
    >
      <div className="flex items-start gap-space-sm">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${SOURCES.nivela.className}`}
        >
          <Icon name={SOURCES.nivela.icon} className="text-[1.375rem]" />
        </span>
        <div className="flex flex-col">
          <h3 id="nivela-shelf-title" className="text-label-lg text-on-surface">
            Produtos Nivela
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Prontos para usar, mesmo que sua empresa ainda não tenha material. Feitos para qualquer setor.
          </p>
          <span className="text-label-md text-primary">
            {products.length} módulos · {lessons} lições disponíveis
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onShow}
        className="inline-flex w-fit shrink-0 items-center gap-1 text-label-md text-primary hover:underline"
      >
        Ver os produtos Nivela
        <Icon name="arrow_forward" className="text-[1.125rem]" />
      </button>
    </section>
  )
}

export function ContentLibrary({ library }: { library: LibraryModule[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? library : library.filter((module) => module.source === filter)

  return (
    <section
      aria-labelledby="content-library-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-center">
        <h2 id="content-library-title" className="text-headline-sm text-on-surface">
          Biblioteca de conteúdos
        </h2>
        <FilterBar current={filter} onChange={setFilter} />
      </div>
      <NivelaShelf
        products={library.filter((module) => module.source === 'nivela')}
        onShow={() => setFilter('nivela')}
      />
      <ul className="grid grid-cols-1 gap-x-space-md gap-y-1 md:grid-cols-2">
        {visible.map((module) => (
          <LibraryItem key={module.id} module={module} />
        ))}
      </ul>
    </section>
  )
}
