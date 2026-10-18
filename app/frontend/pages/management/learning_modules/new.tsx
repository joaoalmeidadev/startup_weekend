import { Head, Link, router, usePage } from '@inertiajs/react'
import { useCallback, useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { NewModuleProps } from '@/types/management'
import { GeneratingLessons, LessonsCreated } from './AiGeneration'
import { ContentBlock } from './ContentBlock'
import { OriginBlock } from './OriginBlock'
import { SubmitArea } from './SubmitArea'
import { TrainingBlock } from './TrainingBlock'
import { emptyDraft } from './contentDraft'

const LIBRARY_PATH = '/management/library'
const SAVE_DELAY_MS = 900

type Phase = 'form' | 'generating' | 'generated'

function BackLink({ journey }: Pick<NewModuleProps, 'journey'>) {
  const label = journey ? journey.name : 'Biblioteca'
  return (
    <Link
      href={journey ? `/management/journeys/${journey.id}` : LIBRARY_PATH}
      aria-label={`Voltar para ${label}`}
      className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
    >
      <Icon name="chevron_left" className="text-[1.125rem]" />
      {label}
    </Link>
  )
}

// The library keeps what exists; who receives it is decided in the journeys
function NewContentForm({
  journey,
  generated,
  competency_groups: competencyGroups,
  company_rule: companyRule,
}: NewModuleProps) {
  const notify = useMockNotice()
  const [draft, setDraft] = useState(() => emptyDraft(companyRule.teacher_salary))
  const [phase, setPhase] = useState<Phase>('form')
  const finishGeneration = useCallback(() => setPhase('generated'), [])

  const submit = () => {
    if (draft.origin === 'ai') return setPhase('generating')
    notify('Conteúdo salvo na Biblioteca (simulação).')
    const backPath = journey ? `/management/journeys/${journey.id}` : LIBRARY_PATH
    setTimeout(() => router.visit(backPath), SAVE_DELAY_MS)
  }

  if (phase !== 'form') {
    return (
      <section className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        {phase === 'generating' ? (
          <GeneratingLessons lessons={generated.lessons} onDone={finishGeneration} />
        ) : (
          <LessonsCreated generated={generated} />
        )}
      </section>
    )
  }

  return (
    <>
      <ContentBlock draft={draft} onChange={setDraft} />
      <OriginBlock draft={draft} competencyGroups={competencyGroups} onChange={setDraft} />
      <TrainingBlock draft={draft} companyRule={companyRule} onChange={setDraft} />
      <SubmitArea draft={draft} onSubmit={submit} />
    </>
  )
}

export default function LearningModulesNew() {
  const props = usePage<NewModuleProps>().props

  return (
    <ManagementLayout>
      <Head title="Novo conteúdo" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md pb-space-xl">
        <BackLink journey={props.journey} />
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Novo conteúdo</h1>
          <p className="text-body-md text-on-surface-variant">
            Cadastre o conteúdo uma vez; ele fica na Biblioteca e as jornadas decidem quem recebe.
          </p>
        </div>
        <NewContentForm {...props} />
      </div>
    </ManagementLayout>
  )
}
