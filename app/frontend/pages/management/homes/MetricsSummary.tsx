import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { TeamDashboard } from '@/types/management'

// One row above everything it scopes; every number below follows the chosen period
export function PeriodFilter({ dashboard }: { dashboard: TeamDashboard }) {
  return (
    <nav aria-label="Período" className="flex flex-wrap items-center gap-space-xs">
      <Icon name="calendar_month" className="text-[1.25rem] text-on-surface-variant" />
      {dashboard.periods.map((period) => {
        const active = period.key === dashboard.period
        return (
          <Link
            key={period.key}
            href={`/management?period=${period.key}`}
            preserveScroll
            aria-current={active ? 'page' : undefined}
            className={`h-9 rounded-full px-space-md text-label-md leading-9 transition-colors ${active ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            {period.label}
          </Link>
        )
      })}
    </nav>
  )
}
