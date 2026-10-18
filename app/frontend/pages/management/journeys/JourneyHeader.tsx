import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import { useMockNotice } from '@/components/MockNotice'
import { StatusPill } from '@/components/StatusPill'
import type { AudienceOption, Journey, JourneyAudience, JourneyGoal } from '@/types/management'
import { AudiencePicker } from './AudiencePicker'
import { KindTag } from './KindTag'
import { audienceChips } from './audience'

type AudienceChoices = { options: AudienceOption[]; people: string[] }

type AudienceModalProps = AudienceChoices & {
  current: JourneyAudience
  onSave: (audience: JourneyAudience) => void
  onClose: () => void
}

function AudienceModal({ current, onSave, onClose, ...choices }: AudienceModalProps) {
  const [audience, setAudience] = useState(current)

  return (
    <Modal icon="group" title="Quem recebe esta jornada" onClose={onClose}>
      <AudiencePicker value={audience} onChange={setAudience} {...choices} />
      <button
        type="button"
        disabled={audience.names.length === 0}
        onClick={() => onSave(audience)}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        Salvar
      </button>
    </Modal>
  )
}

function AudienceLine({ journey, ...choices }: AudienceChoices & { journey: Journey }) {
  const notify = useMockNotice()
  const [audience, setAudience] = useState(journey.audience)
  const [editing, setEditing] = useState(false)
  const save = (chosen: JourneyAudience) => {
    setAudience(chosen)
    setEditing(false)
    notify('Quem recebe foi atualizado (simulação).')
  }

  return (
    <div
      role="group"
      aria-label="Quem recebe"
      className="flex flex-wrap items-center gap-space-xs text-body-sm text-on-surface-variant"
    >
      <span>Quem recebe:</span>
      {audienceChips(audience, choices.options).map((chip) => (
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
        <AudienceModal current={audience} onSave={save} onClose={() => setEditing(false)} {...choices} />
      )}
    </div>
  )
}

type JourneyHeaderProps = AudienceChoices & { journey: Journey; goal: JourneyGoal }

export function JourneyHeader({ journey, goal, ...choices }: JourneyHeaderProps) {
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
          <div className="flex flex-wrap items-center gap-space-sm">
            <h1 className="text-headline-xl tracking-tight text-on-surface">{journey.name}</h1>
            <StatusPill status={journey.status} />
            <KindTag kind={journey.kind} />
          </div>
          <AudienceLine journey={journey} {...choices} />
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
          {goal.slug && (
            <Link
              href={`/management/sectors/${goal.slug}`}
              className="text-body-sm font-semibold text-primary hover:underline"
            >
              Ver a meta de {goal.sector}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
