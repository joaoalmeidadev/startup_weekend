import { Head, Link, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { PrimaryButton } from '@/components/PrimaryButton'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { ContributionForm } from '@/types/collaborator'
import { ProposalFields } from './ProposalFields'
import { ProposalLessonFields } from './ProposalLessonFields'
import {
  emptyProposal,
  emptyProposalLesson,
  estimatedPoints,
  missingItems,
  type ProposalLesson,
} from './proposalDraft'

const BACK_TO_LIST_DELAY_MS = 1200

function PointsEstimate({ points }: { points: number }) {
  return (
    <div className="flex items-start gap-space-sm rounded-xl bg-success-bg p-space-md">
      <Icon name="stars" className="text-[1.5rem] text-tertiary-container" />
      <p className="flex flex-col">
        <span className="text-label-lg text-on-surface">{`Se aprovada, você pode ganhar cerca de ${points} pts`}</span>
        <span className="text-body-sm text-on-surface-variant">
          É uma estimativa: o RH decide os pontos na aprovação.
        </span>
      </p>
    </div>
  )
}

function MissingList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-secondary-fixed/50 p-space-md">
      <span className="text-label-md text-on-surface">Falta pouco para enviar:</span>
      <ul className="list-disc pl-space-lg text-body-md text-on-surface">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function ProposalForm({ sectors, points_per_hour }: ContributionForm) {
  const notify = useMockNotice()
  const [draft, setDraft] = useState(emptyProposal)
  const missing = missingItems(draft)

  const setLessons = (lessons: ProposalLesson[]) => setDraft({ ...draft, lessons })
  const updateLesson = (index: number, lesson: ProposalLesson) =>
    setLessons(draft.lessons.map((current, i) => (i === index ? lesson : current)))
  const removeLesson = (index: number) => setLessons(draft.lessons.filter((_, i) => i !== index))

  const submit = () => {
    notify('Enviada! O RH vai analisar (simulação).')
    setTimeout(() => router.visit('/collaborator/contributions'), BACK_TO_LIST_DELAY_MS)
  }

  return (
    <>
      <ProposalFields draft={draft} sectors={sectors} onChange={setDraft} />
      <PointsEstimate points={estimatedPoints(draft.hours, points_per_hour)} />
      <section className="flex flex-col gap-space-sm">
        <h2 className="text-headline-sm text-on-surface">Lições</h2>
        <ol className="flex flex-col gap-space-sm">
          {draft.lessons.map((lesson, index) => (
            <ProposalLessonFields
              key={index}
              lesson={lesson}
              number={index + 1}
              onChange={(changed) => updateLesson(index, changed)}
              onRemove={draft.lessons.length > 1 ? () => removeLesson(index) : undefined}
            />
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setLessons([...draft.lessons, emptyProposalLesson()])}
          className="inline-flex h-11 w-fit items-center gap-space-xs rounded-xl bg-surface-container px-space-md text-label-md text-primary hover:bg-surface-container-high"
        >
          <Icon name="add" className="text-[1.125rem]" />
          Adicionar lição
        </button>
      </section>
      {missing.length > 0 && <MissingList items={missing} />}
      <PrimaryButton icon="send" disabled={missing.length > 0} onClick={submit}>
        Enviar para aprovação
      </PrimaryButton>
    </>
  )
}

export default function ContributionsNew() {
  const { sectors, points_per_hour } = usePage<ContributionForm>().props

  return (
    <CollaboratorLayout>
      <Head title="Propor uma jornada" />
      <div className="mx-auto flex w-full max-w-[35rem] flex-col gap-space-lg py-space-lg">
        <Link
          href="/collaborator/contributions"
          className="inline-flex w-fit items-center gap-space-xs text-label-lg text-primary hover:underline"
        >
          <Icon name="arrow_back" className="text-[1.25rem]" />
          Voltar
        </Link>
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-sm text-on-surface">Propor uma jornada</h1>
          <p className="text-body-md text-on-surface-variant">
            Conte o que você sabe em lições curtas. Cada lição termina com uma pergunta para o colega.
          </p>
        </div>
        <ProposalForm sectors={sectors} points_per_hour={points_per_hour} />
      </div>
    </CollaboratorLayout>
  )
}
