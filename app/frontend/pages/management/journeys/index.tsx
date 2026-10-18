import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { JourneySummary, Manager } from '@/types/management'
import { JourneyCard } from './JourneyCard'
import { STRETCHES } from './stretches'

function StretchGuide() {
  return (
    <section className="grid grid-cols-1 gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm md:grid-cols-3">
      {STRETCHES.map((stretch, index) => (
        <div key={stretch.key} className="flex items-center gap-space-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
            <Icon name={stretch.icon} className="text-[1.375rem]" />
          </div>
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface">
              {index + 1}. {stretch.title}
            </span>
            <span className="text-body-sm text-on-surface-variant">{stretch.hint}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

function SectorGoalCard() {
  return (
    <Link
      href="/management/sector_goal"
      className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:bg-surface-container-low"
    >
      <span className="flex items-center gap-space-sm">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-container">
          <Icon name="tune" className="text-[1.375rem]" />
        </span>
        <span className="flex flex-col">
          <span className="text-label-lg text-on-surface">Meta do setor</span>
          <span className="text-body-sm text-on-surface-variant">
            A régua vem dos seus colaboradores mais experientes
          </span>
        </span>
      </span>
      <Icon name="arrow_forward" className="text-[1.5rem] text-primary" />
    </Link>
  )
}

function JourneysScreen({ journeys, company }: { journeys: JourneySummary[]; company: string }) {
  return (
    <div className="flex w-full flex-col gap-space-lg">
      <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
        <div className="flex flex-col">
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
            Gestão • {company}
          </span>
          <h1 className="text-headline-xl tracking-tight text-on-surface">Conteúdos</h1>
          <p className="mt-space-xs text-body-md text-on-surface-variant">
            Envie o treinamento uma vez e ele chega a cada pessoa no caminho até o selo. Toda jornada tem três
            trechos:
          </p>
        </div>
        <Link
          href="/management/modules/new"
          className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container"
        >
          <Icon name="add" className="text-[1.25rem]" />
          <span>Novo conteúdo</span>
        </Link>
      </section>
      <StretchGuide />
      <SectorGoalCard />
      <section className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
        {journeys.map((journey) => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </section>
    </div>
  )
}

export default function JourneysIndex() {
  const { journeys, manager } = usePage<{ journeys: JourneySummary[]; manager: Manager }>().props

  return (
    <ManagementLayout>
      <Head title="Conteúdos" />
      <JourneysScreen journeys={journeys} company={manager.company} />
    </ManagementLayout>
  )
}
