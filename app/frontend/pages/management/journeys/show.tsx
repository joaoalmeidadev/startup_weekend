import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { StatusPill } from '@/components/StatusPill'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Journey, ModuleSummary, StretchKey } from '@/types/management'
import { AddModuleModal } from './AddModuleModal'
import { AudienceModal } from './AudienceModal'
import { StretchColumn } from './StretchColumn'
import { addModule, moveModule } from './journeyEditing'

type JourneyPageProps = { journey: Journey; library: ModuleSummary[] }

function JourneyHeader({ journey }: { journey: Journey }) {
  const notify = useMockNotice()
  const [audience, setAudience] = useState(journey.audience)
  const [editing, setEditing] = useState(false)
  const saveAudience = (chips: string[]) => {
    setAudience(chips)
    setEditing(false)
    notify('Quem recebe foi atualizado (simulação).')
  }

  return (
    <section className="flex flex-col gap-space-md">
      <Link
        href="/management/journeys"
        className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
      >
        <Icon name="chevron_left" className="text-[1.125rem]" />
        Conteúdos
      </Link>
      <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-start">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <h1 className="text-headline-xl tracking-tight text-on-surface">{journey.name}</h1>
            <StatusPill status={journey.status} />
          </div>
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
          </div>
        </div>
        <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">
            <Icon name="military_tech" className="text-[1.375rem]" />
          </div>
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface">Selo: {journey.badge}</span>
            <Link
              href="/management/sector_goal"
              className="text-body-sm font-semibold text-primary hover:underline"
            >
              Ver a meta desta jornada
            </Link>
          </div>
        </div>
      </div>
      {editing && (
        <AudienceModal current={audience} onSave={saveAudience} onClose={() => setEditing(false)} />
      )}
    </section>
  )
}

function JourneyEditor({ journey, library: initialLibrary }: JourneyPageProps) {
  const notify = useMockNotice()
  const [stretches, setStretches] = useState(journey.stretches)
  const [library, setLibrary] = useState(initialLibrary)
  const [adding, setAdding] = useState<StretchKey | null>(null)
  const addingStretch = stretches.find((stretch) => stretch.key === adding)

  const pick = (module: ModuleSummary) => {
    setStretches((current) => addModule(current, 'base', module))
    setLibrary((current) => current.filter((m) => m.id !== module.id))
    setAdding(null)
    notify(`"${module.name}" entrou na Base (simulação).`)
  }
  const create = (how: 'manual' | 'ai') => {
    setAdding(null)
    const mode = how === 'manual' ? '&mode=manual' : ''
    router.visit(`/management/modules/new?journey=${journey.id}${mode}`)
  }

  return (
    <>
      <p className="text-body-md text-on-surface-variant">
        O colaborador segue os módulos nesta ordem, um de cada vez. Quem já domina um assunto (pelo
        diagnóstico) pula o módulo.
      </p>
      <div className="grid grid-cols-1 gap-space-md xl:grid-cols-3">
        {stretches.map((stretch, index) => (
          <StretchColumn
            key={stretch.key}
            stretch={stretch}
            number={index + 1}
            onMove={(moduleIndex, direction) =>
              setStretches((current) => moveModule(current, stretch.key, moduleIndex, direction))
            }
            onAdd={() => setAdding(stretch.key)}
          />
        ))}
      </div>
      {addingStretch && (
        <AddModuleModal
          stretch={addingStretch}
          library={library}
          onPick={pick}
          onCreate={create}
          onClose={() => setAdding(null)}
        />
      )}
    </>
  )
}

export default function JourneysShow() {
  const { journey, library } = usePage<JourneyPageProps>().props

  return (
    <ManagementLayout>
      <Head title={journey.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <JourneyHeader journey={journey} />
        <JourneyEditor journey={journey} library={library} />
      </div>
    </ManagementLayout>
  )
}
