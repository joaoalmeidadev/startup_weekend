import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Manager, PeopleProps, Person, PersonStatus } from '@/types/management'
import { InviteMenu } from './InviteMenu'
import { PersonRow, ROW_COLUMNS } from './PersonRow'
import { PERSON_STATUS, STATUS_ORDER } from './personStatus'
import { StatusSummary } from './StatusSummary'

const ALL = 'all'

type Filters = { sector: string; status: PersonStatus | typeof ALL; query: string }

const PILL = 'h-9 rounded-full px-space-md text-label-md transition-all'
const PILL_ACTIVE = 'bg-primary-container text-on-primary shadow-sm'
const PILL_IDLE = 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'

function matches(person: Person, { sector, status, query }: Filters) {
  return (
    (sector === ALL || person.sector === sector) &&
    (status === ALL || person.status === status) &&
    person.name.toLowerCase().includes(query.trim().toLowerCase())
  )
}

function Pills<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-space-xs">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`${PILL} ${value === option.value ? PILL_ACTIVE : PILL_IDLE}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function FilterBar({
  props,
  filters,
  onChange,
}: {
  props: PeopleProps
  filters: Filters
  onChange: (f: Filters) => void
}) {
  const sectorOptions = [
    { value: ALL, label: `Todos (${props.people.length})` },
    ...props.sectors.map((s) => ({ value: s.name, label: `${s.name} (${s.count})` })),
  ]
  const statusOptions: { value: Filters['status']; label: string }[] = [
    { value: ALL, label: 'Todos' },
    ...STATUS_ORDER.map((status) => ({ value: status, label: PERSON_STATUS[status].plural })),
  ]

  return (
    <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="relative">
        <Icon
          name="search"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[1.25rem] text-outline"
        />
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Buscar por nome..."
          aria-label="Buscar por nome"
          className="h-11 w-full rounded-xl border-0 bg-surface-container-low pr-4 pl-12 text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary-container"
        />
      </div>
      <div className="flex flex-col gap-space-sm lg:flex-row lg:items-center lg:justify-between">
        <Pills
          label="Setor"
          options={sectorOptions}
          value={filters.sector}
          onChange={(sector) => onChange({ ...filters, sector })}
        />
        <Pills
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(status) => onChange({ ...filters, status })}
        />
      </div>
    </section>
  )
}

function ColumnHeader() {
  return (
    <div
      aria-hidden="true"
      className={`hidden gap-x-space-md px-space-md text-label-sm text-outline uppercase lg:grid ${ROW_COLUMNS}`}
    >
      <span>Pessoa</span>
      <span>Progresso</span>
      <span>Nota × meta</span>
      <span>Atividade</span>
      <span>Previsão</span>
    </div>
  )
}

function NobodyFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-space-xl text-center">
      <Icon name="search_off" className="mb-space-sm text-[3rem] text-outline" />
      <h3 className="text-headline-sm font-semibold text-on-surface">Ninguém encontrado</h3>
      <p className="mt-1 text-body-sm text-on-surface-variant">Tente outro nome ou limpe os filtros.</p>
    </div>
  )
}

export default function PeopleIndex() {
  const { manager, ...props } = usePage<PeopleProps & { manager: Manager }>().props
  const [filters, setFilters] = useState<Filters>({ sector: ALL, status: ALL, query: '' })
  const visible = props.people.filter((person) => matches(person, filters))

  return (
    <ManagementLayout>
      <Head title="Pessoas" />
      <div className="flex w-full flex-col gap-space-lg">
        <section className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="flex flex-col">
            <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
              Gestão • {manager.company}
            </span>
            <h1 className="text-headline-xl tracking-tight text-on-surface">Pessoas</h1>
            <p className="mt-space-xs text-body-md text-on-surface-variant">
              Quem já está nivelado, quem está no ritmo e quem precisa de ajuda.
            </p>
          </div>
          <div className="flex items-center gap-space-md">
            <a
              href="/management/people.csv"
              download
              className="inline-flex items-center gap-space-xs text-label-md text-primary hover:underline"
            >
              <Icon name="download" className="text-[1.125rem]" />
              Exportar CSV
            </a>
            <InviteMenu sectors={props.sectors} />
          </div>
        </section>

        <StatusSummary summary={props.summary} />
        <FilterBar props={props} filters={filters} onChange={setFilters} />

        <section aria-label="Lista de pessoas" className="flex flex-col gap-space-xs">
          <ColumnHeader />
          {visible.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
          {visible.length === 0 && <NobodyFound />}
        </section>

        <p className="text-body-sm text-on-surface-variant">
          Mostrando <strong className="text-on-surface">{visible.length}</strong> de{' '}
          <strong className="text-on-surface">{props.people.length}</strong> pessoas
        </p>
      </div>
    </ManagementLayout>
  )
}
