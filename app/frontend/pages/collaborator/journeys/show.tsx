import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { Journey, Viewer } from '@/types/collaborator'
import { CURRENT_LESSON_ID } from './CurrentLessonCard'
import { EmptyJourney } from './EmptyJourney'
import { JourneyPath } from './JourneyPath'

type JourneyPageProps = { journey: Journey; viewer: Viewer }

const CARD = 'rounded-xl bg-surface-container-lowest p-space-lg shadow-md'

export default function JourneysShow() {
  const { journey, viewer } = usePage<JourneyPageProps>().props

  if (journey.sections.length === 0) {
    return (
      <CollaboratorLayout>
        <Head title="Minha jornada" />
        <div className="mx-auto w-full max-w-2xl py-space-lg">
          <EmptyJourney company={viewer.company} />
        </div>
      </CollaboratorLayout>
    )
  }

  return (
    <CollaboratorLayout>
      <Head title="Minha jornada" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-space-xl py-space-lg">
        <section className={`${CARD} flex flex-col gap-space-md`}>
          <div className="flex flex-col gap-space-xs">
            <span className="text-label-md font-bold tracking-wide text-primary uppercase">
              Sua Atividade de Hoje
            </span>
            <h1 className="text-headline-lg text-on-surface">
              Olá, {viewer.first_name}! Pronta para continuar?
            </h1>
            <p className="text-body-xl text-on-surface-variant">
              Falta apenas uma etapa rápida de <strong>{journey.today.minutes} minutos</strong> no módulo da{' '}
              {journey.today.owner}.
            </p>
          </div>
          <a
            href={`#${CURRENT_LESSON_ID}`}
            className="flex h-16 w-full items-center justify-center gap-space-sm rounded-xl bg-primary-container text-label-lg text-on-primary shadow-lg sm:text-headline-md transition-transform hover:brightness-110 active:translate-y-1"
          >
            <span>Continuar de onde parei</span>
            <Icon name="arrow_forward" className="text-[2rem]" />
          </a>
        </section>

        {journey.extra_task && (
          <Link
            href={journey.extra_task.href}
            className="flex items-center gap-space-md rounded-xl border-[1.5px] border-slate-200 bg-surface-container-lowest p-space-md hover:bg-surface-container-low"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary-container">
              <Icon name="groups" className="text-[1.75rem]" />
            </span>
            <span className="flex-1 text-body-lg-bold text-on-surface">{journey.extra_task.text}</span>
            <Icon name="chevron_right" className="text-[1.75rem] text-on-surface-variant" />
          </Link>
        )}

        <section className={`${CARD} flex flex-col gap-space-xl`}>
          <div className="flex items-center justify-between pb-space-sm">
            <h2 className="flex items-center gap-space-xs text-headline-md text-on-surface">
              <Icon name="route" className="text-[2rem] text-primary" />
              <span>Sua Trilha de Aprendizado</span>
            </h2>
            <span className="rounded-full bg-surface-container-high px-space-md py-space-xs text-body-lg-bold text-primary">
              Passo {journey.step.current} de {journey.step.total}
            </span>
          </div>
          <JourneyPath sections={journey.sections} badge={journey.badge} />
        </section>

        <section className={`${CARD} flex items-center justify-between gap-space-md`}>
          <div className="flex items-center gap-space-md">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-tertiary-container text-on-primary">
              <Icon name="verified" filled className="text-[2.25rem]" />
            </div>
            <div className="flex flex-col">
              <span className="text-headline-md text-on-surface">
                {journey.summary.completed} aulas já concluídas
              </span>
              <span className="text-body-xl text-on-surface-variant">
                Você já completou metade da sua jornada inicial!
              </span>
            </div>
          </div>
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-headline-lg text-primary">{journey.summary.percent}%</span>
            <span className="text-label-md text-on-surface-variant">Progresso total</span>
          </div>
        </section>
      </div>
    </CollaboratorLayout>
  )
}
