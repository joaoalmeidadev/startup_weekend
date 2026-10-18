import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { StatusPill } from '@/components/StatusPill'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Journey, JourneyBuilderProps, ModuleSummary, StretchKey } from '@/types/management'
import { AudienceModal } from './AudienceModal'
import { CatalogPanel } from './CatalogPanel'
import { JourneyPreview } from './JourneyPreview'
import { ReadyJourneyCard } from './ReadyJourneyCard'
import { ValueSummary } from './ValueSummary'
import { addModule, moduleIds, moveModule, removeModule } from './journeyEditing'
import { journeyValue } from './journeyValue'

function AudienceLine({ journey }: { journey: Journey }) {
  const notify = useMockNotice()
  const [audience, setAudience] = useState(journey.audience)
  const [editing, setEditing] = useState(false)
  const saveAudience = (chips: string[]) => {
    setAudience(chips)
    setEditing(false)
    notify('Quem recebe foi atualizado (simulação).')
  }

  return (
    <div className="flex flex-wrap items-center gap-space-xs text-body-sm text-on-surface-variant">
      <span>Quem recebe:</span>
      {audience.map((chip) => (
        <span key={chip} className="rounded-full bg-surface-container px-space-sm py-0.5 text-label-sm">
          {chip}
        </span>
      ))}
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="font-semibold text-primary hover:underline"
      >
        Alterar
      </button>
      {editing && (
        <AudienceModal current={audience} onSave={saveAudience} onClose={() => setEditing(false)} />
      )}
    </div>
  )
}

function JourneyHeader({ journey }: { journey: Journey }) {
  const notify = useMockNotice()

  return (
    <section className="flex flex-col gap-space-md">
      <Link
        href="/management/journeys"
        className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
      >
        <Icon name="chevron_left" className="text-[1.125rem]" />
        Jornadas
      </Link>
      <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-start">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <h1 className="text-headline-xl tracking-tight text-on-surface">{journey.name}</h1>
            <StatusPill status={journey.status} />
          </div>
          <AudienceLine journey={journey} />
        </div>
        <div className="flex flex-col items-start gap-space-xs lg:items-end">
          <button
            type="button"
            onClick={() => notify('Alterações publicadas para a equipe (simulação).')}
            className="inline-flex h-12 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container"
          >
            <Icon name="publish" className="text-[1.25rem]" />
            Publicar alterações
          </button>
          <Link
            href="/management/sector_goal"
            className="text-body-sm font-semibold text-primary hover:underline"
          >
            Ver a meta desta jornada
          </Link>
        </div>
      </div>
    </section>
  )
}

// Catalog on the left, the collaborator's path on the right; the value on top follows every change
function JourneyBuilder({ journey, catalog, goal, ready_journey, start_ready }: JourneyBuilderProps) {
  const notify = useMockNotice()
  const [stretches, setStretches] = useState(start_ready ? ready_journey : journey.stretches)
  const titleOf = (key: StretchKey) => stretches.find((stretch) => stretch.key === key)?.title

  const add = (module: ModuleSummary, key: StretchKey) => {
    setStretches((current) => addModule(current, key, module))
    notify(`"${module.name}" entrou em ${titleOf(key)}.`)
  }
  const applyReady = () => {
    setStretches(ready_journey)
    notify('Jornada pronta Nivela aplicada. Edite à vontade.')
  }
  const remove = (key: StretchKey, module: ModuleSummary) =>
    setStretches((current) => removeModule(current, key, module.id))
  const move = (key: StretchKey, index: number, direction: -1 | 1) =>
    setStretches((current) => moveModule(current, key, index, direction))

  return (
    <>
      <ValueSummary value={journeyValue(stretches, goal)} />
      <div className="grid grid-cols-1 items-start gap-space-md lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-space-md">
          <ReadyJourneyCard ready={ready_journey} goal={goal} onApply={applyReady} />
          <CatalogPanel catalog={catalog} inJourney={moduleIds(stretches)} onAdd={add} />
        </div>
        <JourneyPreview stretches={stretches} badge={journey.badge} onMove={move} onRemove={remove} />
      </div>
    </>
  )
}

export default function JourneysShow() {
  const props = usePage<JourneyBuilderProps>().props

  return (
    <ManagementLayout>
      <Head title={props.journey.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <JourneyHeader journey={props.journey} />
        <JourneyBuilder {...props} />
      </div>
    </ManagementLayout>
  )
}
