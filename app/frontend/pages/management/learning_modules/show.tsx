import { Head, Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { StatusPill } from '@/components/StatusPill'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { LearningModule } from '@/types/management'
import { LessonList } from './LessonList'

function Fact({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-space-sm">
      <Icon name={icon} className="mt-0.5 text-[1.25rem] text-primary" />
      <div className="flex flex-col">
        <span className="text-label-sm tracking-wider text-on-surface-variant uppercase">{label}</span>
        <span className="text-body-md text-on-surface">{children}</span>
      </div>
    </div>
  )
}

function ModuleFacts({ module }: { module: LearningModule }) {
  return (
    <section className="grid grid-cols-1 gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm md:grid-cols-3">
      <Fact icon="flag" label="Competência treinada">
        {module.competency}
      </Fact>
      <Fact icon="description" label="Origem">
        {module.source}
      </Fact>
      <Fact icon="route" label="Usado nas jornadas">
        {module.used_in.map((journey, index) => (
          <span key={journey.id}>
            {index > 0 && ', '}
            <Link
              href={`/management/journeys/${journey.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {journey.name}
            </Link>
          </span>
        ))}
      </Fact>
    </section>
  )
}

function ReviewCall({ module }: { module: LearningModule }) {
  if (module.review_from === null) return null
  const pending = module.lessons.filter((lesson) => lesson.status === 'pending').length
  return (
    <section className="flex flex-col items-start justify-between gap-space-md rounded-xl bg-secondary-fixed p-space-lg md:flex-row md:items-center">
      <div className="flex items-center gap-space-sm">
        <Icon name="rate_review" className="text-[1.75rem] text-on-secondary-container" />
        <div className="flex flex-col">
          <span className="text-label-lg text-on-surface">{pending} lições esperando sua revisão</span>
          <span className="text-body-sm text-on-surface-variant">
            Nada vai para os colaboradores até você aprovar todas.
          </span>
        </div>
      </div>
      <Link
        href={`/management/lesson_reviews/${module.review_from}`}
        className="inline-flex h-12 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container"
      >
        Revisar lições
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </Link>
    </section>
  )
}

export default function LearningModulesShow() {
  const { learning_module: module } = usePage<{ learning_module: LearningModule }>().props
  const backTo = module.used_in[0]

  return (
    <ManagementLayout>
      <Head title={module.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        {backTo && (
          <Link
            href={`/management/journeys/${backTo.id}`}
            className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
          >
            <Icon name="chevron_left" className="text-[1.125rem]" />
            {backTo.name}
          </Link>
        )}
        <div className="flex flex-col gap-space-xs">
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
            Módulo · Trecho {module.stretch}
          </span>
          <div className="flex items-center gap-space-sm">
            <h1 className="text-headline-xl tracking-tight text-on-surface">{module.name}</h1>
            <StatusPill status={module.status} />
          </div>
        </div>
        <ModuleFacts module={module} />
        <ReviewCall module={module} />
        <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
          <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-2">
            <h2 className="text-headline-sm text-on-surface">Lições ({module.lessons.length})</h2>
            <LessonList module={module} />
          </section>
          <section className="flex h-fit flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex items-center gap-space-sm">
              <Icon name="quiz" className="text-[1.5rem] text-primary" />
              <h2 className="text-headline-sm text-on-surface">Avaliação final</h2>
            </div>
            <p className="text-body-md text-on-surface">
              {module.assessment.questions} perguntas no fim do módulo.
            </p>
            <p className="text-body-sm text-on-surface-variant">
              A nota vira a pontuação de <strong>{module.competency}</strong> e é comparada com a meta da
              jornada para liberar o selo.
            </p>
          </section>
        </div>
      </div>
    </ManagementLayout>
  )
}
