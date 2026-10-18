import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { LearnerJourney, LearnerStep } from '@/types/collaborator'
import { DEMO_LESSON_PATH } from './learnerJourneys'

const MARKER: Record<LearnerStep['status'], { icon: string; tone: string }> = {
  done: { icon: 'check', tone: 'bg-tertiary-container text-on-primary' },
  current: { icon: 'play_arrow', tone: 'bg-primary-container text-on-primary' },
  locked: { icon: 'lock', tone: 'bg-surface-container-highest text-outline' },
}

function StepName({ step }: { step: LearnerStep }) {
  const tone = step.status === 'locked' ? 'text-on-surface-variant' : 'text-on-surface'
  // Finished steps open their module, so she can review the lessons
  if (step.status !== 'done') return <span className={`text-label-lg ${tone}`}>{step.name}</span>
  return (
    <Link
      href={`/collaborator/modules/${step.module_id}`}
      className={`text-label-lg underline-offset-2 hover:underline ${tone}`}
    >
      {step.name}
    </Link>
  )
}

const CONTINUE_BUTTON =
  'mt-space-xs flex h-12 w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container text-label-lg text-on-primary shadow-sm transition hover:brightness-110 active:translate-y-0.5'

// Only the step with a mocked lesson opens it; the others answer with a toast
function ContinueAction({ hasLesson }: { hasLesson: boolean }) {
  const notify = useMockNotice()
  const content = (
    <>
      Continuar
      <Icon name="arrow_forward" className="text-[1.25rem]" />
    </>
  )
  if (hasLesson)
    return (
      <Link href={DEMO_LESSON_PATH} className={CONTINUE_BUTTON}>
        {content}
      </Link>
    )
  return (
    <button
      type="button"
      onClick={() => notify('Esta etapa abre em breve (simulação).')}
      className={CONTINUE_BUTTON}
    >
      {content}
    </button>
  )
}

function StepItem({ step, lessonStepId }: { step: LearnerStep; lessonStepId?: string }) {
  const marker = MARKER[step.status]
  return (
    <li data-status={step.status} className="relative flex gap-space-md pb-space-lg">
      <div className={`z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${marker.tone}`}>
        <Icon name={marker.icon} className="text-[1.25rem]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-space-xs pt-1">
        <div className="flex items-start justify-between gap-space-sm">
          <StepName step={step} />
          <span className="shrink-0 text-label-md text-secondary">+{step.points} pts</span>
        </div>
        <span className="text-body-sm text-on-surface-variant">
          {step.lessons} aulas · {step.hours}h
        </span>
        {step.status === 'current' && <ContinueAction hasLesson={step.module_id === lessonStepId} />}
      </div>
    </li>
  )
}

// The steps of the active journey, top to bottom, ending in the badge she earns
type StepPathProps = { journey: LearnerJourney; lessonStepId?: string }

export function StepPath({ journey, lessonStepId }: StepPathProps) {
  return (
    <div className="relative">
      <div className="absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 bg-surface-container-highest" />
      <ol className="flex flex-col">
        {journey.steps.map((step) => (
          <StepItem key={step.module_id} step={step} lessonStepId={lessonStepId} />
        ))}
      </ol>
      <div className="relative flex items-center gap-space-md">
        <div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon name="military_tech" filled className="text-[1.25rem]" />
        </div>
        <span className="text-label-lg text-on-surface">Selo: {journey.badge}</span>
      </div>
    </div>
  )
}
