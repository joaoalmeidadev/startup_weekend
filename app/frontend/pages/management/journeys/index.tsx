import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { AudienceOption, JourneyKind, JourneySummary } from '@/types/management'
import { JourneyCard } from './JourneyCard'
import { JOURNEY_KINDS } from './journeyKinds'

// Plain legend of the three kinds, each with its color; it is not interactive
function KindLegend() {
  return (
    <ul aria-label="Tipos de jornada" className="flex flex-wrap gap-x-space-lg gap-y-space-xs">
      {JOURNEY_KINDS.map((kind) => (
        <li key={kind.key} className="flex items-center gap-1 text-body-sm text-on-surface-variant">
          <span aria-hidden="true" className={`size-2.5 rounded-full ${kind.stripe}`} />
          <span className="font-semibold text-on-surface">{kind.title}:</span>
          <span>{kind.hint}</span>
        </li>
      ))}
    </ul>
  )
}

type KindFilterValue = JourneyKind | 'all'

const PILL = 'inline-flex h-9 items-center gap-space-xs rounded-full px-space-md text-label-md transition-all'

function KindFilter({
  journeys,
  value,
  onChange,
}: {
  journeys: JourneySummary[]
  value: KindFilterValue
  onChange: (value: KindFilterValue) => void
}) {
  const count = (kind: JourneyKind) => journeys.filter((journey) => journey.kind === kind).length
  const options = [
    { key: 'all' as const, label: `Todas (${journeys.length})`, dot: null },
    ...JOURNEY_KINDS.map((kind) => ({
      key: kind.key,
      label: `${kind.title} (${count(kind.key)})`,
      dot: kind.stripe,
    })),
  ]
  return (
    <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-space-xs">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className={`${PILL} ${value === option.key ? 'bg-primary-container text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
        >
          {option.dot && <span aria-hidden="true" className={`size-2.5 rounded-full ${option.dot}`} />}
          {option.label}
        </button>
      ))}
    </div>
  )
}

function JourneysHeader() {
  return (
    <section className="flex flex-col gap-space-xs">
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <h1 className="text-headline-xl tracking-tight text-on-surface">Jornadas</h1>
        <Link
          href="/management/journeys/new"
          className="inline-flex h-12 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container"
        >
          <Icon name="add" className="text-[1.25rem]" />
          Nova jornada
        </Link>
      </div>
      <p className="text-body-md text-on-surface-variant">
        Como o conteúdo chega às pessoas. Cada pessoa pode receber várias jornadas.
      </p>
      <KindLegend />
    </section>
  )
}

function LibraryHint() {
  return (
    <p className="flex flex-wrap items-center gap-x-space-xs text-body-sm text-on-surface-variant">
      <Icon name="library_books" className="text-[1rem]" />
      Os conteúdos vêm da Biblioteca — adicione dentro de cada jornada.
      <Link href="/management/library" className="text-label-md text-primary hover:underline">
        Ver a Biblioteca
      </Link>
    </p>
  )
}

export default function JourneysIndex() {
  const { journeys, audience_options } = usePage<{
    journeys: JourneySummary[]
    audience_options: AudienceOption[]
  }>().props
  const [kind, setKind] = useState<KindFilterValue>('all')
  const visible = kind === 'all' ? journeys : journeys.filter((journey) => journey.kind === kind)

  return (
    <ManagementLayout>
      <Head title="Jornadas" />
      <div className="flex w-full flex-col gap-space-lg">
        <JourneysHeader />
        <KindFilter journeys={journeys} value={kind} onChange={setKind} />
        <section
          aria-label="Jornadas"
          className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3"
        >
          {visible.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} audienceOptions={audience_options} />
          ))}
        </section>
        <LibraryHint />
      </div>
    </ManagementLayout>
  )
}
