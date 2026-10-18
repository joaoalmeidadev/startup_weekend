import { useState } from 'react'
import type { AudienceOption, JourneyAudience } from '@/types/management'
import { peopleCount } from './audience'
import { normalize } from '@/lib/text'

type AudiencePickerProps = {
  options: AudienceOption[]
  people: string[]
  value: JourneyAudience
  onChange: (audience: JourneyAudience) => void
}

const TYPES: { type: JourneyAudience['type']; label: string }[] = [
  { type: 'sectors', label: 'Setores e grupos' },
  { type: 'people', label: 'Pessoas específicas' },
]

const ROW = 'flex cursor-pointer items-center gap-space-sm rounded-xl bg-surface-container-low p-space-sm'
const CHECKBOX = 'size-5 rounded border-outline text-primary-container focus:ring-primary-container'

function toggle(names: string[], name: string) {
  return names.includes(name) ? names.filter((n) => n !== name) : [...names, name]
}

type ListProps = { selected: string[]; onToggle: (name: string) => void }

function SectorList({ options, selected, onToggle }: ListProps & { options: AudienceOption[] }) {
  return (
    <ul className="flex flex-col gap-space-xs">
      {options.map((option) => (
        <li key={option.name}>
          <label className={ROW}>
            <input
              type="checkbox"
              checked={selected.includes(option.name)}
              onChange={() => onToggle(option.name)}
              className={CHECKBOX}
            />
            <span className="text-label-md text-on-surface">{option.name}</span>
            {option.kind === 'group' && (
              <span className="rounded-full bg-secondary-fixed px-space-sm py-0.5 text-label-sm text-on-secondary-container">
                Grupo
              </span>
            )}
            <span className="ml-auto text-body-sm text-on-surface-variant">
              {peopleCount(option.people_count)}
            </span>
          </label>
        </li>
      ))}
    </ul>
  )
}

function PeopleList({ people, selected, onToggle }: ListProps & { people: string[] }) {
  const [query, setQuery] = useState('')
  const found = people.filter((name) => normalize(name).includes(normalize(query.trim())))

  return (
    <div className="flex flex-col gap-space-xs">
      <input
        type="search"
        aria-label="Buscar pessoa"
        placeholder="Buscar pessoa"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-11 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
      />
      {found.length === 0 && <p className="text-body-sm text-on-surface-variant">Ninguém com esse nome.</p>}
      <ul className="flex max-h-64 flex-col gap-space-xs overflow-y-auto">
        {found.map((name) => (
          <li key={name}>
            <label className={ROW}>
              <input
                type="checkbox"
                checked={selected.includes(name)}
                onChange={() => onToggle(name)}
                className={CHECKBOX}
              />
              <span className="text-label-md text-on-surface">{name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Who receives a journey: whole sectors and groups, or people picked one by one
export function AudiencePicker({ options, people, value, onChange }: AudiencePickerProps) {
  const pick = (name: string) => onChange({ ...value, names: toggle(value.names, name) })

  return (
    <div className="flex flex-col gap-space-sm">
      <div role="radiogroup" aria-label="Como escolher quem recebe" className="flex flex-wrap gap-space-md">
        {TYPES.map(({ type, label }) => (
          <label
            key={type}
            className="flex cursor-pointer items-center gap-space-xs text-label-md text-on-surface"
          >
            <input
              type="radio"
              name="audience-type"
              checked={value.type === type}
              onChange={() => onChange({ type, names: [] })}
              className="size-5 border-outline text-primary-container focus:ring-primary-container"
            />
            {label}
          </label>
        ))}
      </div>
      {value.type === 'sectors' ? (
        <SectorList options={options} selected={value.names} onToggle={pick} />
      ) : (
        <PeopleList people={people} selected={value.names} onToggle={pick} />
      )}
    </div>
  )
}
