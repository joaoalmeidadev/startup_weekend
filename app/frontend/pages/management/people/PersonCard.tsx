import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { Person, PersonStatus } from '@/types/management'

export const PERSON_STATUS: Record<
  PersonStatus,
  { label: string; icon: string; badge: string; stripe: string }
> = {
  attention: {
    label: 'Precisa de atenção',
    icon: 'warning',
    badge: 'bg-secondary-fixed text-on-secondary-container',
    stripe: 'bg-secondary-container',
  },
  learning: {
    label: 'Aprendendo',
    icon: 'trending_up',
    badge: 'bg-surface-container-high text-primary',
    stripe: 'bg-primary-fixed-dim',
  },
  leveled: {
    label: 'Nivelado',
    icon: 'check_circle',
    badge: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    stripe: 'bg-tertiary-fixed-dim',
  },
}

function PersonDetail({ person }: { person: Person }) {
  if (person.alert) {
    return (
      <div className="mt-1 flex items-center gap-space-xs text-secondary">
        <Icon name={person.alert.icon} className="text-[1.125rem]" />
        <span className="text-body-sm font-semibold">{person.alert.text}</span>
      </div>
    )
  }
  if (person.achievement) {
    return (
      <div className="mt-1 flex items-center gap-space-xs text-tertiary">
        <Icon name="workspace_premium" className="text-[1.125rem] text-tertiary-container" />
        <span className="text-body-sm font-semibold">{person.achievement}</span>
      </div>
    )
  }
  if (!person.progress) return null
  return (
    <div className="mt-1 flex flex-col gap-space-xs sm:flex-row sm:items-center sm:gap-space-sm">
      <span className="text-body-sm text-on-surface-variant">{person.progress.step}</span>
      <span className="hidden size-1 rounded-full bg-outline-variant sm:inline-block" />
      <div className="flex items-center gap-space-xs">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-full rounded-full bg-primary-container"
            style={{ width: `${person.progress.percent}%` }}
          />
        </div>
        <span className="text-label-sm font-bold text-primary">{person.progress.label}</span>
      </div>
    </div>
  )
}

export function PersonCard({ person }: { person: Person }) {
  const status = PERSON_STATUS[person.status]

  return (
    <article className="relative flex flex-col items-stretch justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md lg:flex-row lg:items-center">
      <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-xl ${status.stripe}`} />
      <div className="flex items-center gap-space-md pl-space-xs">
        <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-full bg-surface-container shadow-inner">
          <img src={person.avatar_url} alt="" className="size-full object-cover" />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-space-xs">
            <h2 className="truncate text-headline-sm font-bold text-on-surface">{person.name}</h2>
            <span className="inline-block size-1.5 rounded-full bg-outline-variant" />
            <span className="text-label-md text-on-surface-variant">{person.sector}</span>
          </div>
          <PersonDetail person={person} />
        </div>
      </div>
      <div className="flex flex-col items-start gap-space-md self-end sm:flex-row sm:items-center lg:self-center">
        <div
          className={`inline-flex items-center gap-space-xs rounded-full px-space-md py-1.5 ${status.badge}`}
        >
          <Icon name={status.icon} className="text-[1.125rem]" />
          <span className="text-label-md font-bold">{status.label}</span>
        </div>
        <Link
          href={`/management/people/${person.id}`}
          className="flex h-12 items-center gap-space-xs rounded-xl bg-surface-container px-space-md text-label-lg text-primary transition-colors hover:bg-surface-container-high"
        >
          <span>Ver detalhes</span>
          <Icon name="chevron_right" className="text-[1.125rem]" />
        </Link>
      </div>
    </article>
  )
}
