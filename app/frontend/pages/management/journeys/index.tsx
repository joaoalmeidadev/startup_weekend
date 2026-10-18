import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { JourneySummary, LibraryModule, Manager } from '@/types/management'
import { ContentLibrary } from './ContentLibrary'
import { JourneyCard } from './JourneyCard'
import { SourceFlows } from './SourceFlows'
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

type JourneysScreenProps = { journeys: JourneySummary[]; library: LibraryModule[]; company: string }

function JourneysSection({ journeys }: { journeys: JourneySummary[] }) {
  return (
    <section aria-labelledby="journeys-title" className="flex flex-col gap-space-md">
      <h2 id="journeys-title" className="text-headline-sm text-on-surface">
        Jornadas
      </h2>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
        {journeys.map((journey) => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </div>
    </section>
  )
}

function JourneysScreen({ journeys, library, company }: JourneysScreenProps) {
  return (
    <div className="flex w-full flex-col gap-space-lg">
      <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
        <div className="flex flex-col">
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
            Gestão • {company}
          </span>
          <h1 className="text-headline-xl tracking-tight text-on-surface">Conteúdos</h1>
          <p className="mt-space-xs text-body-md text-on-surface-variant">
            Envie o treinamento uma vez e ele chega a cada pessoa no caminho até o selo.
          </p>
          <StretchGuide />
        </div>
        <Link
          href="/management/modules/new"
          className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container"
        >
          <Icon name="add" className="text-[1.25rem]" />
          <span>Novo conteúdo</span>
        </Link>
      </section>
      <SourceFlows />
      <ContentLibrary library={library} />
      <JourneysSection journeys={journeys} />
    </div>
  )
}

export default function JourneysIndex() {
  const { journeys, library, manager } = usePage<{
    journeys: JourneySummary[]
    library: LibraryModule[]
    manager: Manager
  }>().props

  return (
    <ManagementLayout>
      <Head title="Conteúdos" />
      <JourneysScreen journeys={journeys} library={library} company={manager.company} />
    </ManagementLayout>
  )
}
