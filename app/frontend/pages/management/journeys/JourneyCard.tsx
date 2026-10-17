import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { StatusPill } from '@/components/StatusPill'
import type { JourneySummary } from '@/types/management'
import { STRETCHES } from './stretches'

export function JourneyCard({ journey }: { journey: JourneySummary }) {
  const active = journey.status === 'active'

  return (
    <Link
      href={`/management/journeys/${journey.id}`}
      className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md"
    >
      <div
        className={`absolute top-0 bottom-0 left-0 w-1.5 ${active ? 'bg-primary-container' : 'bg-outline-variant'}`}
      />
      <div className="flex items-start justify-between gap-space-sm">
        <h2 className="text-headline-sm font-bold text-on-surface">{journey.name}</h2>
        <StatusPill status={journey.status} />
      </div>
      <div className="flex flex-wrap gap-space-xs">
        {journey.audience.map((audience) => (
          <span
            key={audience}
            className="inline-flex items-center gap-1 rounded-full bg-surface-container px-space-sm py-1 text-label-sm text-on-surface-variant"
          >
            <Icon name="group" className="text-[0.875rem]" />
            {audience}
          </span>
        ))}
      </div>
      <ol className="flex items-center gap-space-xs" aria-label="Módulos por trecho">
        {STRETCHES.map((stretch, index) => (
          <li key={stretch.key} className="flex items-center gap-space-xs">
            {index > 0 && <Icon name="arrow_forward" className="text-[0.875rem] text-outline" />}
            <span className="flex items-center gap-1 rounded-lg bg-surface-container-low px-space-sm py-1 text-label-md text-on-surface">
              <Icon name={stretch.icon} className="text-[1rem] text-primary" />
              {stretch.title} · {journey.modules_per_stretch[stretch.key]}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-auto flex items-center justify-between border-t border-surface-container pt-space-sm text-body-sm text-on-surface-variant">
        <span>
          {journey.people_in_progress > 0
            ? `${journey.people_in_progress} pessoas em andamento`
            : 'Ninguém começou ainda'}
        </span>
        <span className="flex items-center gap-1 font-semibold text-primary">
          Abrir jornada
          <Icon name="chevron_right" className="text-[1.125rem]" />
        </span>
      </div>
    </Link>
  )
}
