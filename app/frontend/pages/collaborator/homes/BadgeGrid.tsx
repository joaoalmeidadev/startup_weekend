import { Icon } from '@/components/Icon'
import type { Badge } from '@/types/collaborator'

function BadgeItem({ badge }: { badge: Badge }) {
  return (
    <li className="flex flex-col items-center gap-space-xs text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name={badge.icon} filled className="text-[1.75rem]" />
      </div>
      <span className="text-label-md text-on-surface">{badge.title}</span>
    </li>
  )
}

// Badges only pile up: there is no total to reach, so locked ones stay out of sight
export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((badge) => badge.earned)
  return (
    <section
      aria-labelledby="badges-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id="badges-title" className="text-headline-sm text-on-surface">
        Meus selos conquistados
      </h2>
      {earned.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant">
          Conclua uma etapa para ganhar o seu primeiro selo.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-space-md sm:grid-cols-4">
          {earned.map((badge) => (
            <BadgeItem key={badge.title} badge={badge} />
          ))}
        </ul>
      )}
    </section>
  )
}
