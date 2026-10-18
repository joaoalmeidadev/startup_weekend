import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { Dashboard } from '@/types/management'

export function HeroFigure({ dashboard }: { dashboard: Dashboard }) {
  const percent = Math.round((dashboard.leveled.count / dashboard.leveled.total) * 100)
  return (
    <section className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <span className="text-label-md text-on-surface-variant">Equipe nivelada</span>
      <span className="text-[3.5rem] leading-none font-bold text-on-surface">{percent}%</span>
      <span className="text-body-sm text-on-surface-variant">
        {dashboard.leveled.count} de {dashboard.leveled.total} pessoas com o selo
      </span>
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-tertiary-fixed px-space-sm py-0.5 text-label-sm text-on-tertiary-fixed-variant">
        <Icon name="trending_up" className="text-[1rem]" />+{dashboard.leveled.change} p.p.{' '}
        {dashboard.leveled.change_label}
      </span>
    </section>
  )
}

// One row above everything it scopes; every number below follows the chosen period
export function PeriodFilter({ dashboard }: { dashboard: Dashboard }) {
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

function StatTile({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <span className="flex items-center gap-space-xs text-label-md text-on-surface-variant">
        <Icon name={icon} className="text-[1.125rem] text-primary" />
        {label}
      </span>
      <span className="text-headline-lg font-bold text-on-surface">{value}</span>
    </div>
  )
}

const ENGAGEMENT_ICONS = ['person_check', 'timer', 'local_fire_department', 'task_alt']

export function Engagement({ dashboard }: { dashboard: Dashboard }) {
  return (
    <section className="grid grid-cols-2 gap-space-md lg:col-span-2 xl:grid-cols-3">
      {dashboard.engagement.map((tile, index) => (
        <StatTile
          key={tile.label}
          label={tile.label}
          value={tile.value}
          icon={ENGAGEMENT_ICONS[index] ?? 'insights'}
        />
      ))}
      <StatTile
        label="Tempo médio até nivelar"
        value={`${dashboard.days_to_level} dias`}
        icon="hourglass_bottom"
      />
    </section>
  )
}
