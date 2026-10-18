import { Icon } from '@/components/Icon'
import { normalize } from '@/lib/text'
import type { Person, PersonStatus } from '@/types/management'
import { PERSON_STATUS, STATUS_ORDER } from '../people/personStatus'

const ALL = 'all'

export type PeopleFilter = { status: PersonStatus | typeof ALL; query: string }

export const NO_FILTER: PeopleFilter = { status: ALL, query: '' }

const PILL = 'h-9 rounded-full px-space-md text-label-md transition-all'
const PILL_ACTIVE = 'bg-primary-container text-on-primary shadow-sm'
const PILL_IDLE = 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'

export function matches(person: Person, { status, query }: PeopleFilter) {
  return (
    (status === ALL || person.status === status) && normalize(person.name).includes(normalize(query.trim()))
  )
}

function statusOptions(people: Person[]) {
  const count = (status: PersonStatus) => people.filter((person) => person.status === status).length
  return [
    { value: ALL, label: `Todos (${people.length})` },
    ...STATUS_ORDER.map((status) => ({
      value: status,
      label: `${PERSON_STATUS[status].plural} (${count(status)})`,
    })),
  ] as { value: PeopleFilter['status']; label: string }[]
}

type PeopleFiltersProps = { people: Person[]; filter: PeopleFilter; onChange: (filter: PeopleFilter) => void }

export function PeopleFilters({ people, filter, onChange }: PeopleFiltersProps) {
  return (
    <div className="flex flex-col gap-space-sm lg:flex-row lg:items-center lg:justify-between">
      <div role="group" aria-label="Status" className="flex flex-wrap items-center gap-space-xs">
        {statusOptions(people).map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter.status === option.value}
            onClick={() => onChange({ ...filter, status: option.value })}
            className={`${PILL} ${filter.status === option.value ? PILL_ACTIVE : PILL_IDLE}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="relative lg:w-72">
        <Icon
          name="search"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[1.25rem] text-outline"
        />
        <input
          type="search"
          value={filter.query}
          onChange={(event) => onChange({ ...filter, query: event.target.value })}
          placeholder="Buscar por nome..."
          aria-label="Buscar por nome"
          className="h-10 w-full rounded-xl border-0 bg-surface-container-low pr-4 pl-12 text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary-container"
        />
      </div>
    </div>
  )
}
