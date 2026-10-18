import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { LearnerPoints } from '@/types/collaborator'

export function PointsCard({ points, streakDays }: { points: LearnerPoints; streakDays: number }) {
  return (
    <section
      aria-labelledby="points-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex items-start justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <h2 id="points-title" className="text-label-lg text-on-surface-variant">
            Seus pontos
          </h2>
          <span className="text-headline-lg text-primary">{points.total} pts</span>
          <span className="text-body-sm text-on-surface-variant">
            {points.balance} pts para usar em prêmios
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary-fixed px-space-sm py-1 text-label-md text-on-secondary-container">
          <Icon name="local_fire_department" filled className="text-[1.125rem]" />
          {streakDays} dias seguidos
        </span>
      </div>
      <Link
        href="/collaborator/rewards"
        className="inline-flex w-fit items-center gap-1 text-label-lg text-primary"
      >
        Ver prêmios
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </Link>
    </section>
  )
}
