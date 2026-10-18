import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { JourneyAudience, JourneyKind, NewJourneyProps } from '@/types/management'
import { AudiencePicker } from './AudiencePicker'
import { JOURNEY_KINDS } from './journeyKinds'

// Simulation: the new journey opens the builder of an existing journey of the same kind
const SAMPLE_JOURNEY: Record<JourneyKind, string> = {
  base: 'base-nivela',
  company: 'promocao-para-lider',
  sector: 'atendimento-na-pratica',
}

const SECTION = 'flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm'
const TITLE = 'text-headline-sm text-on-surface'

function KindCards({
  selected,
  onSelect,
}: {
  selected: JourneyKind | null
  onSelect: (kind: JourneyKind) => void
}) {
  return (
    <fieldset className={SECTION}>
      <legend className={`${TITLE} mb-space-sm`}>Tipo</legend>
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-3">
        {JOURNEY_KINDS.map((kind) => (
          <label
            key={kind.key}
            className={`flex cursor-pointer flex-col gap-space-xs rounded-xl border-2 p-space-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-container ${selected === kind.key ? 'border-primary-container bg-primary-fixed' : 'border-surface-container bg-surface-container-low'}`}
          >
            <input
              type="radio"
              name="journey-kind"
              aria-label={kind.title}
              aria-describedby={`kind-${kind.key}`}
              checked={selected === kind.key}
              onChange={() => onSelect(kind.key)}
              className="sr-only"
            />
            <Icon name={kind.icon} className="text-[1.5rem] text-primary" />
            <span className="text-label-lg text-on-surface">{kind.title}</span>
            <span id={`kind-${kind.key}`} className="text-body-sm text-on-surface-variant">
              {kind.hint}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function NewJourneyForm({ audience_options, people }: NewJourneyProps) {
  const notify = useMockNotice()
  const [name, setName] = useState('')
  const [kind, setKind] = useState<JourneyKind | null>(null)
  const [audience, setAudience] = useState<JourneyAudience>({ type: 'sectors', names: [] })
  const ready = name.trim() !== '' && kind !== null && audience.names.length > 0

  const create = () => {
    if (!kind) return
    notify(`Jornada "${name.trim()}" criada (simulação).`)
    router.visit(`/management/journeys/${SAMPLE_JOURNEY[kind]}`)
  }

  return (
    <div className="flex flex-col gap-space-md">
      <label className={SECTION}>
        <span className={TITLE}>Nome da jornada</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Comercial na prática"
          className="h-12 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
        />
      </label>
      <KindCards selected={kind} onSelect={setKind} />
      <section aria-labelledby="audience-title" className={SECTION}>
        <h2 id="audience-title" className={TITLE}>
          Quem recebe
        </h2>
        <AudiencePicker options={audience_options} people={people} value={audience} onChange={setAudience} />
      </section>
      <button
        type="button"
        disabled={!ready}
        onClick={create}
        className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container disabled:opacity-50"
      >
        <Icon name="arrow_forward" className="text-[1.25rem]" />
        Criar e escolher conteúdos
      </button>
    </div>
  )
}

export default function JourneysNew() {
  const props = usePage<NewJourneyProps>().props

  return (
    <ManagementLayout>
      <Head title="Nova jornada" />
      <div className="flex w-full max-w-4xl flex-col gap-space-lg pt-space-md">
        <Link
          href="/management/journeys"
          className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
        >
          <Icon name="chevron_left" className="text-[1.125rem]" />
          Jornadas
        </Link>
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Nova jornada</h1>
          <p className="text-body-md text-on-surface-variant">
            Dê um nome, escolha o tipo e quem recebe. Depois você escolhe os conteúdos da Biblioteca.
          </p>
        </div>
        <NewJourneyForm {...props} />
      </div>
    </ManagementLayout>
  )
}
