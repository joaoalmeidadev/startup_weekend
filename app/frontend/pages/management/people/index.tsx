import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Manager, PeopleProps, Person } from '@/types/management'
import { InviteMenu } from './InviteMenu'
import { Pagination } from './Pagination'
import { PersonCard } from './PersonCard'
import { SummaryStrip } from './SummaryStrip'

const ALL = 'all'

const PILL = 'h-10 rounded-full px-space-md text-label-md transition-all'
const PILL_ACTIVE = 'bg-primary-container text-on-primary shadow-sm'
const PILL_IDLE = 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'

function matches(person: Person, sector: string, query: string) {
  const term = query.trim().toLowerCase()
  const inSector = sector === ALL || person.sector === sector
  return inSector && (person.name.toLowerCase().includes(term) || person.sector.toLowerCase().includes(term))
}

export default function PeopleIndex() {
  const { people, summary, sectors, total, manager, team } = usePage<PeopleProps & { manager: Manager }>()
    .props
  const [sector, setSector] = useState(ALL)
  const [query, setQuery] = useState('')
  // The manager's team list leads with whoever needs attention
  const visible = people
    .filter((person) => matches(person, sector, query))
    .sort((a, b) => (team ? Number(b.status === 'attention') - Number(a.status === 'attention') : 0))
  const pills = [
    { value: ALL, label: `Todos (${total})` },
    ...sectors.map((s) => ({ value: s.name, label: `${s.name} (${s.count})` })),
  ]

  return (
    <ManagementLayout area={team ? 'team' : 'company'}>
      <Head title={team ? 'Minha equipe' : 'Pessoas'} />
      <div className="flex w-full flex-col gap-space-lg">
        <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-center">
          <div className="flex flex-col">
            <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
              {team ? 'Gestor • Atendimento' : `Gestão • ${manager.company}`}
            </span>
            <h1 className="text-headline-xl tracking-tight text-on-surface">
              {team ? 'Minha equipe' : 'Pessoas'}
            </h1>
            <p className="mt-space-xs text-body-md text-on-surface-variant">
              {team
                ? 'Quem precisa de atenção aparece primeiro.'
                : `Acompanhe o momento de cada colaborador na ${manager.company}.`}
            </p>
          </div>
          {!team && <InviteMenu />}
        </section>

        {!team && <SummaryStrip summary={summary} />}

        <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col items-stretch justify-between gap-space-md lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Icon
                name="search"
                className="absolute top-1/2 left-4 -translate-y-1/2 text-[1.25rem] text-outline"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nome ou setor..."
                aria-label="Buscar por nome ou setor"
                className="h-12 w-full rounded-xl border-0 bg-surface-container-low pr-4 pl-12 text-body-md text-on-surface transition-all outline-none placeholder:text-outline focus:bg-surface-container-lowest focus:shadow-md focus:ring-0"
              />
            </div>
            <div className={`flex flex-wrap items-center gap-space-xs ${team ? 'hidden' : ''}`}>
              {pills.map((pill) => (
                <button
                  key={pill.value}
                  type="button"
                  aria-pressed={sector === pill.value}
                  onClick={() => setSector(pill.value)}
                  className={`${PILL} ${sector === pill.value ? PILL_ACTIVE : PILL_IDLE}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-space-md">
          {visible.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </section>

        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-space-xl text-center">
            <Icon name="search_off" className="mb-space-sm text-[3rem] text-outline" />
            <h3 className="text-headline-sm font-semibold text-on-surface">Nenhum colaborador encontrado</h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Tente ajustar o termo pesquisado ou selecione outro setor.
            </p>
          </div>
        )}

        <Pagination shown={visible.length} total={total} />
      </div>
    </ManagementLayout>
  )
}
