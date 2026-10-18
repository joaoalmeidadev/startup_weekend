import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { AudienceOptions } from '@/components/AudienceOptions'
import { Icon } from '@/components/Icon'
import { WizardSteps } from '@/components/WizardSteps'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Publication } from '@/types/management'
import { JourneyOutline } from './JourneyOutline'

const PUBLISH_STEP = 3
const PRIMARY =
  'inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50'

function AudienceStep({ publication, onPublish }: { publication: Publication; onPublish: () => void }) {
  const [selected, setSelected] = useState(publication.default_audiences)
  const toggle = (value: string) =>
    setSelected((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]))

  return (
    <div className="flex flex-col gap-space-md">
      <fieldset className="flex flex-col gap-space-sm">
        <legend className="mb-space-sm text-headline-sm text-on-surface">Quem recebe este conteúdo?</legend>
        <AudienceOptions selected={selected} onToggle={toggle} sectorLabel={`Setor ${publication.sector}`} />
      </fieldset>
      <button type="button" disabled={selected.length === 0} onClick={onPublish} className={PRIMARY}>
        <Icon name="rocket_launch" className="text-[1.25rem]" />
        Publicar
      </button>
    </div>
  )
}

// Publishing is local until modules are persisted
function PublishedStep({ publication }: { publication: Publication }) {
  return (
    <div className="flex flex-col items-center gap-space-md text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <Icon name="celebration" className="text-[2.25rem]" />
      </div>
      <h2 className="text-headline-lg text-on-surface">Publicado!</h2>
      <p className="text-body-md text-on-surface-variant">
        <strong className="text-on-surface">{publication.audience_count} pessoas</strong> já podem fazer este
        conteúdo.
      </p>
      <JourneyOutline items={publication.journey_outline} />
      <Link href={publication.done_path} className={PRIMARY}>
        Voltar para a Biblioteca
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </Link>
    </div>
  )
}

export default function LearningModulesPublish() {
  const { publication } = usePage<{ publication: Publication }>().props
  const [published, setPublished] = useState(false)

  return (
    <ManagementLayout>
      <Head title="Publicar conteúdo" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md">
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Publicar conteúdo</h1>
          <p className="text-body-md text-on-surface-variant">
            {publication.module_name} · {publication.lessons} lições aprovadas
          </p>
        </div>
        <WizardSteps current={published ? PUBLISH_STEP + 1 : PUBLISH_STEP} />
        <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          {published ? (
            <PublishedStep publication={publication} />
          ) : (
            <AudienceStep publication={publication} onPublish={() => setPublished(true)} />
          )}
        </section>
      </div>
    </ManagementLayout>
  )
}
