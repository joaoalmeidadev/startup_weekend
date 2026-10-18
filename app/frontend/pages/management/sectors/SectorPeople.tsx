import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { SectorDetail, SectorMember } from '@/types/management'
import { PersonAvatar } from '../people/PersonAvatar'
import { PERSON_STATUS } from '../people/personStatus'
import { Block } from './Block'

// In a group people come from different sectors, so each row also tells their work sector
function MemberRow({ person, showSector }: { person: SectorMember; showSector: boolean }) {
  const status = PERSON_STATUS[person.status]
  return (
    <Link
      href={`/management/people/${person.id}`}
      className="flex items-center justify-between gap-space-sm rounded-xl p-space-sm transition-colors hover:bg-surface-container"
    >
      <span className="flex min-w-0 items-center gap-space-sm">
        <PersonAvatar person={person} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-label-lg text-on-surface">{person.name}</span>
          <span className="text-body-sm text-on-surface-variant">
            {showSector ? `${person.role} · ${person.sector}` : person.role}
          </span>
        </span>
      </span>
      <span
        className={`inline-flex shrink-0 items-center gap-space-xs rounded-full px-space-sm py-1 ${status.soft}`}
      >
        <Icon name={status.icon} className="text-[1rem]" />
        <span className="text-label-sm font-bold">{status.label}</span>
      </span>
    </Link>
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

export function SectorPeople({ sector }: { sector: SectorDetail }) {
  const group = sector.kind === 'group'
  return (
    <Block
      title="Pessoas"
      hint={group ? 'Gente de setores diferentes que estuda junta.' : 'Quem trabalha neste setor.'}
      action={group && <AddPeopleButton group={sector.name} />}
    >
      <div className="flex flex-col gap-1">
        {sector.people.map((person) => (
          <MemberRow key={person.id} person={person} showSector={group} />
        ))}
        {sector.people.length === 0 && (
          <p className="text-body-md text-on-surface-variant">Ninguém por aqui ainda.</p>
        )}
      </div>
    </Block>
  )
}
