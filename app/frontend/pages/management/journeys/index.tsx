import { Head, Link, usePage } from '@inertiajs/react'
import { ContentPipeline } from '@/components/ContentPipeline'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { JourneySummary } from '@/types/management'
import { JourneyCard } from './JourneyCard'
import { STRETCHES } from './stretches'

// Plain explanation of the fixed order; it is not interactive
function StretchGuide() {
  return (
    <p className="flex flex-wrap items-center gap-x-space-xs text-body-md text-on-surface-variant">
      Toda jornada segue 3 trechos:{' '}
      {STRETCHES.map((stretch, index) => (
        <span key={stretch.key} className="inline-flex items-center gap-1">
          {index > 0 && <span aria-hidden="true">→</span>}
          <Icon name={stretch.icon} className="text-[1rem] text-primary" />
          <span className="font-semibold text-on-surface">{stretch.title}</span>
        </span>
      ))}
    </p>
  )
}

function JourneysHeader() {
  return (
    <section className="flex flex-col gap-space-xs">
      <ContentPipeline current="journeys" />
      <h1 className="text-headline-xl tracking-tight text-on-surface">Jornadas</h1>
      <p className="text-body-md text-on-surface-variant">
        O caminho que cada colaborador percorre até o selo.
      </p>
      <StretchGuide />
    </section>
  )
}

function LibraryHint() {
  return (
    <p className="flex flex-wrap items-center gap-x-space-xs text-body-sm text-on-surface-variant">
      <Icon name="library_books" className="text-[1rem]" />
      Os módulos vêm da Biblioteca — adicione dentro de cada jornada.
      <Link href="/management/library" className="text-label-md text-primary hover:underline">
        Ver a Biblioteca
      </Link>
    </p>
  )
}

export default function JourneysIndex() {
  const { journeys } = usePage<{ journeys: JourneySummary[] }>().props

  return (
    <ManagementLayout>
      <Head title="Jornadas" />
      <div className="flex w-full flex-col gap-space-lg">
        <JourneysHeader />
        <section
          aria-label="Jornadas"
          className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3"
        >
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </section>
        <LibraryHint />
      </div>
    </ManagementLayout>
  )
}
