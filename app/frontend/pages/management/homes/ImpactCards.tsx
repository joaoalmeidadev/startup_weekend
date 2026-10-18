import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { TeamDashboard } from '@/types/management'

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

function ImpactCard({
  title,
  icon,
  note,
  children,
}: {
  title: string
  icon: string
  note: string
  children: ReactNode
}) {
  const id = `impact-${icon}`
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col">
        <h2 id={id} className="flex items-center gap-space-xs text-headline-sm text-on-surface">
          <Icon name={icon} className="text-[1.375rem] text-primary" />
          {title}
        </h2>
        <span className="text-body-sm text-on-surface-variant">{note}</span>
      </div>
      <ul className="flex flex-col gap-space-sm">{children}</ul>
    </section>
  )
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <li className="flex items-baseline gap-space-sm">
      <span className="min-w-[5.5rem] text-headline-md font-bold text-on-surface tabular-nums">{value}</span>
      <span className="text-body-md text-on-surface-variant">{label}</span>
    </li>
  )
}

export function Retention({ dashboard }: { dashboard: TeamDashboard }) {
  const { retention } = dashboard
  return (
    <ImpactCard title="O que aprendem fica" icon="psychology" note="Revisões espaçadas e uso da plataforma">
      <Fact value={`${retention.review_accuracy}%`} label="de acerto nas revisões 30 dias depois" />
      <Fact value={retention.active_weekly} label="estudaram esta semana" />
      <Fact value={`${retention.minutes_per_day} min`} label="por dia, em média" />
    </ImpactCard>
  )
}

const change = (before: number, now: number) => Math.round(((now - before) / before) * 100)

export function OnTheJob({ dashboard }: { dashboard: TeamDashboard }) {
  const { on_the_job: onTheJob } = dashboard
  return (
    <ImpactCard title="Na prática" icon="engineering" note={onTheJob.source}>
      {onTheJob.items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-space-sm">
          <span className="flex flex-col">
            <span className="text-label-lg text-on-surface">{item.label}</span>
            <span className="text-body-sm text-on-surface-variant tabular-nums">
              {decimal.format(item.before)} → {decimal.format(item.now)} {item.unit}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-fixed px-space-sm py-0.5 text-label-md text-on-tertiary-fixed-variant">
            <Icon name="trending_down" className="text-[1rem]" />
            {`−${Math.abs(change(item.before, item.now))}%`}
          </span>
        </li>
      ))}
    </ImpactCard>
  )
}
