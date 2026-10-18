import { useState } from 'react'
import { Icon } from '@/components/Icon'
import type { SectorCandidate } from '@/types/management'
import { PersonAvatar } from '../people/PersonAvatar'

type PeoplePickerProps = {
  people: SectorCandidate[]
  selected: string[]
  onToggle: (id: string) => void
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

function selectedText(count: number) {
  if (count === 0) return 'Nenhuma pessoa selecionada'
  return count === 1 ? '1 pessoa selecionada' : `${count} pessoas selecionadas`
}

export function PeoplePicker({ people, selected, onToggle }: PeoplePickerProps) {
  const [query, setQuery] = useState('')
  const visible = people.filter((person) => normalize(person.name).includes(normalize(query.trim())))

  return (
    <div className="flex flex-col gap-space-sm">
      <div className="relative">
        <Icon
          name="search"
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[1.25rem] text-outline"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nome..."
          aria-label="Buscar pessoas"
          className="h-11 w-full rounded-xl border-0 bg-surface-container-low pr-4 pl-12 text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary-container"
        />
      </div>
      <p className="text-label-md text-on-surface-variant">{selectedText(selected.length)}</p>
      <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
        {visible.map((person) => (
          <li key={person.id}>
            <label className="flex cursor-pointer items-center gap-space-sm rounded-xl p-space-sm transition-colors hover:bg-surface-container">
              <input
                type="checkbox"
                checked={selected.includes(person.id)}
                onChange={() => onToggle(person.id)}
                className="size-5 rounded text-primary focus:ring-primary-container"
              />
              <PersonAvatar person={person} />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-label-lg text-on-surface">{person.name}</span>
                <span className="text-body-sm text-on-surface-variant">{person.sector}</span>
              </span>
            </label>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="text-body-md text-on-surface-variant">Ninguém encontrado.</li>
        )}
      </ul>
    </div>
  )
}
