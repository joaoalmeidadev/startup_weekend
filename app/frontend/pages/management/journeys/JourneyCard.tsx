import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { StatusPill } from '@/components/StatusPill'
import type { AudienceOption, JourneySummary } from '@/types/management'
import { KindTag } from './KindTag'
import { audienceChips } from './audience'
import { kindOf } from './journeyKinds'

const contentsCount = (count: number) => `${count} ${count === 1 ? 'conteúdo' : 'conteúdos'}`

type JourneyCardProps = { journey: JourneySummary; audienceOptions: AudienceOption[] }

export function JourneyCard({ journey, audienceOptions }: JourneyCardProps) {
  const active = journey.status === 'active'

  return (
    <Link
      href={`/management/journeys/${journey.id}`}
      className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md"
    >
      <div
        className={`absolute top-0 bottom-0 left-0 w-1.5 ${active ? kindOf(journey.kind).stripe : 'bg-outline-variant'}`}
      />
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col gap-space-xs">
          <KindTag kind={journey.kind} />
          <h2 className="text-headline-sm font-bold text-on-surface">{journey.name}</h2>
        </div>
        <StatusPill status={journey.status} />
      </div>
      <div className="flex flex-wrap gap-space-xs">
        {audienceChips(journey.audience, audienceOptions).map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full bg-surface-container px-space-sm py-1 text-label-sm text-on-surface-variant"
          >
            <Icon name="group" className="text-[0.875rem]" />
            {chip}
          </span>
        ))}
      </div>
      <span className="flex items-center gap-1 text-label-md text-on-surface">
        <Icon name="library_books" className="text-[1rem] text-primary" />
        {contentsCount(journey.modules_count)}
      </span>
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
