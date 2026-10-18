import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { NewSectorProps, SectorKind } from '@/types/management'
import { BackToSectors, Block } from './Block'
import { GoalFields } from './GoalFields'
import { PeoplePicker } from './PeoplePicker'
import { useGoalLevels } from './useGoalLevels'

const CREATE_DELAY_MS = 900
// The mock has no new page to land on, so it shows an existing group as the example
const EXAMPLE_PATH = '/management/sectors/staff'

const KINDS: { kind: SectorKind; label: string; hint: string }[] = [
  { kind: 'sector', label: 'Setor de trabalho', hint: 'Cada pessoa trabalha em um só setor.' },
  { kind: 'group', label: 'Grupo', hint: 'Junta pessoas de setores diferentes, como o Staff.' },
]

const PEOPLE_HINTS: Record<SectorKind, string> = {
  sector: 'Opcional: quem você marcar passa a trabalhar neste setor.',
  group: 'Escolha ao menos uma pessoa. Ela continua no setor de trabalho dela.',
}

type Draft = { name: string; kind: SectorKind; people: string[] }

function KindChoice({ kind, onChange }: { kind: SectorKind; onChange: (kind: SectorKind) => void }) {
  return (
    <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
      {KINDS.map((option) => (
        <label
          key={option.kind}
          className={`flex cursor-pointer items-start gap-space-sm rounded-xl p-space-md ${kind === option.kind ? 'ring-2 ring-primary' : 'ring-1 ring-outline-variant/40'}`}
        >
          <input
            type="radio"
            name="kind"
            checked={kind === option.kind}
            onChange={() => onChange(option.kind)}
            className="mt-1 text-primary focus:ring-primary-container"
          />
          <span className="flex flex-col">
            <span className="text-label-lg text-on-surface">{option.label}</span>
            <span className="text-body-sm text-on-surface-variant">{option.hint}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

function missingStep(draft: Draft, hasLevel: boolean) {
  if (!draft.name.trim()) return 'Dê um nome ao setor.'
  if (draft.kind === 'group' && draft.people.length === 0) return 'Escolha ao menos uma pessoa para o grupo.'
  if (!hasLevel) return 'Escolha o nível da meta.'
  return null
}

function CreateBar({ draft, missing }: { draft: Draft; missing: string | null }) {
  const notify = useMockNotice()
  const what = draft.kind === 'group' ? 'Grupo' : 'Setor'

  const create = () => {
    notify(`${what} ${draft.name.trim()} criado (simulação).`)
    setTimeout(() => router.visit(EXAMPLE_PATH), CREATE_DELAY_MS)
  }

  return (
    <div className="flex flex-col items-center justify-end gap-space-md sm:flex-row">
      {missing && <p className="text-body-md text-on-surface-variant">{missing}</p>}
      <button
        type="button"
        disabled={missing !== null}
        onClick={create}
        className="inline-flex min-h-[3rem] w-full items-center justify-center gap-space-xs rounded-xl bg-primary px-space-xl text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:opacity-50 sm:w-auto"
      >
        <Icon name="check" className="text-[1.25rem]" />
        <span>Criar {what.toLowerCase()}</span>
      </button>
    </div>
  )
}

export default function SectorsNew() {
  const props = usePage<NewSectorProps>().props
  const goal = useGoalLevels({ ...props, level: null })
  const [draft, setDraft] = useState<Draft>({ name: '', kind: 'sector', people: [] })
  const missing = missingStep(draft, goal.level !== null)

  const togglePerson = (id: string) =>
    setDraft((current) => ({
      ...current,
      people: current.people.includes(id) ? current.people.filter((p) => p !== id) : [...current.people, id],
    }))

  return (
    <ManagementLayout>
      <Head title="Novo setor" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <BackToSectors />
        <div className="flex flex-col">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Novo setor</h1>
          <p className="mt-space-xs text-body-md text-on-surface-variant">
            Dê um nome, escolha quem participa e defina a meta.
          </p>
        </div>
        <Block title="1. Nome">
          <label className="flex flex-col gap-space-xs">
            <span className="text-label-md text-on-surface">Nome</span>
            <input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="Ex.: Financeiro"
              className="h-11 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
            />
          </label>
          <KindChoice kind={draft.kind} onChange={(kind) => setDraft({ ...draft, kind })} />
        </Block>
        <Block title="2. Pessoas" hint={PEOPLE_HINTS[draft.kind]}>
          <PeoplePicker people={props.people} selected={draft.people} onToggle={togglePerson} />
        </Block>
        <Block title="3. Meta" hint="Comece pelas competências da Base. Você ajusta cada uma depois.">
          <GoalFields levels={props.levels} competencies={props.competencies} goal={goal} />
        </Block>
        <CreateBar draft={draft} missing={missing} />
      </div>
    </ManagementLayout>
  )
}
