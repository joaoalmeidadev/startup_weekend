import { Icon } from '@/components/Icon'
import type { Badge } from '@/types/collaborator'

function BadgeItem({ badge }: { badge: Badge }) {
  const tone = badge.earned
    ? 'bg-secondary-container text-on-secondary-container'
    : 'bg-surface-container-highest text-outline'
  return (
    <li data-earned={badge.earned} className="flex flex-col items-center gap-space-xs text-center">
      <div className={`flex size-14 items-center justify-center rounded-full ${tone}`}>
        <Icon name={badge.earned ? badge.icon : 'lock'} filled={badge.earned} className="text-[1.75rem]" />
      </div>
      <span className={`text-label-md ${badge.earned ? 'text-on-surface' : 'text-on-surface-variant'}`}>
        {badge.title}
      </span>
    </li>
  )
}

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((badge) => badge.earned).length
  return (
    <section
      aria-labelledby="badges-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 id="badges-title" className="text-headline-sm text-on-surface">
          Meus selos
        </h2>
        <span className="rounded-full bg-primary-fixed/40 px-space-sm py-0.5 text-label-md text-primary">
          {earned} de {badges.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-space-md sm:grid-cols-4">
        {badges.map((badge) => (
          <BadgeItem key={badge.title} badge={badge} />
        ))}
      </ul>
    </section>
  )
}
