import { Icon } from '@/components/Icon'
import type { Badge } from '@/types/collaborator'

function EarnedBadge({ badge }: { badge: Badge }) {
  return (
    <li className="flex flex-col items-center rounded-xl bg-secondary-container/20 p-space-md text-center shadow-sm">
      <div className="mb-space-sm flex size-20 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-sm">
        <Icon name={badge.icon} className="text-[2.75rem]" />
      </div>
      <span className="text-headline-md text-on-surface">{badge.title}</span>
      <span className="mt-1 flex items-center gap-1 text-label-md text-secondary">
        <Icon name="check_circle" className="text-[1.25rem]" />
        Conquistado
      </span>
    </li>
  )
}

function LockedBadge({ badge }: { badge: Badge }) {
  return (
    <li className="flex flex-col items-center rounded-xl bg-surface-container-high/40 p-space-md text-center opacity-70">
      <div className="mb-space-sm flex size-20 items-center justify-center rounded-full bg-surface-container-highest text-outline shadow-sm">
        <Icon name="lock" className="text-[2.5rem]" />
      </div>
      <span className="text-headline-md text-on-surface-variant">{badge.title}</span>
      <span className="mt-1 flex items-center gap-1 text-label-md text-outline">
        <Icon name="hourglass_empty" className="text-[1.125rem]" />
        Em breve
      </span>
    </li>
  )
}

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  return (
    <ul className="grid grid-cols-2 gap-space-md pt-space-xs">
      {badges.map((badge) =>
        badge.earned ? (
          <EarnedBadge key={badge.title} badge={badge} />
        ) : (
          <LockedBadge key={badge.title} badge={badge} />
        ),
      )}
    </ul>
  )
}
