import { Head, Link, usePage } from '@inertiajs/react'
import { BulletBars } from '@/components/charts/BulletBars'
import { ChartCard, LegendKey } from '@/components/charts/ChartCard'
import { CHART } from '@/components/charts/colors'
import { FunnelBars } from '@/components/charts/FunnelBars'
import { LineChart } from '@/components/charts/LineChart'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { TeamDashboard } from '@/types/management'

function HeroFigure({ dashboard }: { dashboard: TeamDashboard }) {
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
function PeriodFilter({ dashboard }: { dashboard: TeamDashboard }) {
  return (
    <nav aria-label="Período" className="flex flex-wrap items-center gap-space-xs">
      <Icon name="calendar_month" className="text-[1.25rem] text-on-surface-variant" />
      {dashboard.periods.map((period) => {
        const active = period.key === dashboard.period
        return (
          <Link
            key={period.key}
            href={`/management/team?period=${period.key}`}
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

function Engagement({ dashboard }: { dashboard: TeamDashboard }) {
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

export default function TeamsShow() {
  const { dashboard } = usePage<{ dashboard: TeamDashboard }>().props
  const points = dashboard.leveled_over_time
  const step = dashboard.period === '30d' ? 'semana a semana' : 'mês a mês'

  return (
    <ManagementLayout area="team">
      <Head title="Dashboard da equipe" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <div className="flex flex-col">
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
            Gestor • {dashboard.sector}
          </span>
          <h1 className="text-headline-xl tracking-tight text-on-surface">Dashboard da equipe</h1>
          <p className="mt-space-xs text-body-md text-on-surface-variant">
            Como o seu time está evoluindo até o selo Nivelado.
          </p>
        </div>

        <PeriodFilter dashboard={dashboard} />

        <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
          <HeroFigure dashboard={dashboard} />
          <Engagement dashboard={dashboard} />
        </div>

        <ChartCard
          title="Nivelamento ao longo do tempo"
          subtitle={`% da equipe com o selo, ${step}`}
          legend={
            <>
              <LegendKey color={CHART.team} label="Equipe" shape="line" />
              <LegendKey
                color={CHART.goal}
                label={`Meta da empresa (${dashboard.company_target}%)`}
                shape="line"
              />
            </>
          }
          table={{ headers: ['Período', '% nivelados'], rows: points.map((p) => [p.label, `${p.percent}%`]) }}
        >
          <LineChart
            points={points.map((p) => ({ label: p.label, value: p.percent }))}
            target={{ value: dashboard.company_target, label: `Meta ${dashboard.company_target}%` }}
          />
        </ChartCard>

        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-2">
          <ChartCard
            title="Equipe x meta por competência"
            subtitle="Média da equipe (0–100) comparada à meta dos experientes"
            legend={
              <>
                <LegendKey color={CHART.team} label="Média da equipe" />
                <LegendKey color={CHART.goal} label="Meta" shape="tick" />
              </>
            }
            table={{
              headers: ['Competência', 'Equipe', 'Meta', 'Diferença'],
              rows: dashboard.competencies.map((c) => [
                c.name,
                c.team_average,
                c.goal,
                c.team_average - c.goal,
              ]),
            }}
          >
            <BulletBars
              rows={dashboard.competencies.map((c) => ({
                name: c.name,
                value: c.team_average,
                goal: c.goal,
              }))}
            />
          </ChartCard>

          <ChartCard
            title="Funil da jornada"
            subtitle="Quantas pessoas chegaram a cada etapa"
            table={{
              headers: ['Etapa', 'Pessoas', '% do início'],
              rows: dashboard.funnel.map((f) => [
                f.stage,
                f.count,
                `${Math.round((f.count / dashboard.funnel[0].count) * 100)}%`,
              ]),
            }}
          >
            <FunnelBars stages={dashboard.funnel} />
          </ChartCard>
        </div>
      </div>
    </ManagementLayout>
  )
}
