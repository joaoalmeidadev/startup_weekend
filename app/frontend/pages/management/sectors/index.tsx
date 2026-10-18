import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Manager, SectorSummary } from '@/types/management'
import { PersonAvatar } from '../people/PersonAvatar'
import { peopleCount } from './peopleCount'
import { SectorKindTag } from './SectorKindTag'

function goalText(level: SectorSummary['level']) {
  return level ? `Meta ${level.label} · ${level.target} pts` : 'Sem meta ainda'
}

function Faces({ people }: { people: SectorSummary['people'] }) {
  return (
    <div className="flex -space-x-3">
      {people.map((person) => (
        <span key={person.id} className="rounded-full ring-2 ring-surface-container-lowest">
          <PersonAvatar person={person} />
        </span>
      ))}
    </div>
  )
}

function SectorCard({ sector }: { sector: SectorSummary }) {
  return (
    <Link
      href={`/management/sectors/${sector.slug}`}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary-fixed-dim"
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-space-xs">
            <span className="text-headline-sm text-on-surface">{sector.name}</span>
            {sector.kind === 'group' && <SectorKindTag kind="group" />}
          </span>
          <span className="text-body-sm text-on-surface-variant">{peopleCount(sector.people_count)}</span>
        </div>
        <Icon name="chevron_right" className="text-[1.25rem] text-outline" />
      </div>
      <span
        className={`flex items-center gap-space-xs text-label-md ${sector.level ? 'text-primary' : 'text-on-surface-variant'}`}
      >
        <Icon name="flag" className="text-[1.125rem]" />
        {goalText(sector.level)}
      </span>
      <Faces people={sector.people} />
    </Link>
  )
}

export default function SectorsIndex() {
  const { sectors, manager } = usePage<{ sectors: SectorSummary[]; manager: Manager }>().props

  return (
    <ManagementLayout>
      <Head title="Setores" />
      <div className="flex w-full flex-col gap-space-lg">
        <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="flex flex-col">
            <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
              Gestão • {manager.company}
            </span>
            <h1 className="text-headline-xl tracking-tight text-on-surface">Setores</h1>
            <p className="mt-space-xs text-body-md text-on-surface-variant">
              Quem trabalha em cada setor e a meta de cada um.
            </p>
          </div>
          <Link
            href="/management/sectors/new"
            className="inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container"
          >
            <span>+ Novo setor</span>
          </Link>
        </section>
        <section
          aria-label="Lista de setores"
          className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3"
        >
          {sectors.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </section>
      </div>
    </ManagementLayout>
  )
}
