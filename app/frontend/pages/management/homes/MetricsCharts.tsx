import { BulletBars } from '@/components/charts/BulletBars'
import { ChartCard, LegendKey } from '@/components/charts/ChartCard'
import { CHART } from '@/components/charts/colors'
import { FunnelBars } from '@/components/charts/FunnelBars'
import { LineChart } from '@/components/charts/LineChart'
import type { Dashboard } from '@/types/management'

export function LevelingOverTime({ dashboard }: { dashboard: Dashboard }) {
  const points = dashboard.leveled_over_time
  const step = dashboard.period === '30d' ? 'semana a semana' : 'mês a mês'
  const target = dashboard.company_target

  return (
    <ChartCard
      title="Nivelamento ao longo do tempo"
      subtitle={`% da equipe com o selo, ${step}`}
      legend={
        <>
          <LegendKey color={CHART.team} label="Equipe" shape="line" />
          <LegendKey color={CHART.goal} label={`Meta da empresa (${target}%)`} shape="line" />
        </>
      }
      table={{ headers: ['Período', '% nivelados'], rows: points.map((p) => [p.label, `${p.percent}%`]) }}
    >
      <LineChart
        points={points.map((p) => ({ label: p.label, value: p.percent }))}
        target={{ value: target, label: `Meta ${target}%` }}
      />
    </ChartCard>
  )
}

export function CompetencyGoals({ dashboard }: { dashboard: Dashboard }) {
  const competencies = dashboard.competencies

  return (
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
        rows: competencies.map((c) => [c.name, c.team_average, c.goal, c.team_average - c.goal]),
      }}
    >
      <BulletBars rows={competencies.map((c) => ({ name: c.name, value: c.team_average, goal: c.goal }))} />
    </ChartCard>
  )
}

export function JourneyFunnel({ dashboard }: { dashboard: Dashboard }) {
  const funnel = dashboard.funnel
  const share = (count: number) => `${Math.round((count / funnel[0].count) * 100)}%`

  return (
    <ChartCard
      title="Funil da jornada"
      subtitle="Quantas pessoas chegaram a cada etapa"
      table={{
        headers: ['Etapa', 'Pessoas', '% do início'],
        rows: funnel.map((f) => [f.stage, f.count, share(f.count)]),
      }}
    >
      <FunnelBars stages={funnel} />
    </ChartCard>
  )
}
