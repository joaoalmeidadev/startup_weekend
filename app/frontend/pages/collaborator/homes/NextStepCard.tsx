import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { NextStep } from '@/types/collaborator'
import { DEMO_LESSON_PATH } from '../journeys/learnerJourneys'

export function NextStepCard({ step }: { step: NextStep }) {
  return (
    <section
      aria-labelledby="next-step-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id="next-step-title" className="text-label-lg text-on-surface-variant">
        Sua próxima etapa
      </h2>
      <div className="flex items-start justify-between gap-space-md">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-label-md text-primary">{step.journey}</span>
          <span className="text-headline-sm text-on-surface">{step.name}</span>
        </div>
        <span className="shrink-0 rounded-full bg-secondary-fixed px-space-sm py-1 text-label-md text-on-secondary-container">
          +{step.points} pts
        </span>
      </div>
      <Link
        href={DEMO_LESSON_PATH}
        className="flex h-12 w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container text-label-lg text-on-primary shadow-sm transition hover:brightness-110 active:translate-y-0.5"
      >
        Continuar
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </Link>
    </section>
  )
}
