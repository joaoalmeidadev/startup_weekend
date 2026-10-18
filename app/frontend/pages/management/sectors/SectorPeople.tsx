import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { SectorDetail } from '@/types/management'
import { PersonRow, ROW_COLUMNS } from '../people/PersonRow'
import { Block } from './Block'
import { matches, NO_FILTER, PeopleFilter, PeopleFilters } from './PeopleFilters'

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
    <div className="flex flex-col items-center justify-center rounded-xl p-space-lg text-center">
      <Icon name="search_off" className="mb-space-sm text-[2.5rem] text-outline" />
      <p className="text-label-lg text-on-surface">Ninguém encontrado</p>
      <p className="text-body-sm text-on-surface-variant">Tente outro nome ou outro status.</p>
    </div>
  )
}

function AddPeopleButton({ group }: { group: string }) {
  const notify = useMockNotice()
  return (
    <button
      type="button"
      onClick={() => notify(`Pessoas adicionadas ao grupo ${group} (simulação).`)}
      className="inline-flex shrink-0 items-center gap-space-xs text-label-md text-primary hover:underline"
    >
      <Icon name="person_add" className="text-[1.125rem]" />
      Adicionar pessoas
    </button>
  )
}

// In a group people come from different sectors, so each row also tells their work sector
export function SectorPeople({ sector }: { sector: SectorDetail }) {
  const group = sector.kind === 'group'
  const [filter, setFilter] = useState<PeopleFilter>(NO_FILTER)
  const visible = sector.people.filter((person) => matches(person, filter))

  return (
    <Block
      title="Pessoas"
      hint={group ? 'Gente de setores diferentes que estuda junta.' : 'Quem trabalha neste setor.'}
      action={group && <AddPeopleButton group={sector.name} />}
    >
      {sector.people.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">Ninguém por aqui ainda.</p>
      ) : (
        <div className="flex flex-col gap-space-sm">
          <PeopleFilters people={sector.people} filter={filter} onChange={setFilter} />
          <ColumnHeader />
          {visible.map((person) => (
            <PersonRow
              key={person.id}
              person={person}
              detail={group ? `${person.role} · ${person.sector}` : person.role}
            />
          ))}
          {visible.length === 0 && <NobodyFound />}
        </div>
      )}
    </Block>
  )
}
