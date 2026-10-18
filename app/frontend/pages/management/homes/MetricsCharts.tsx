import { ChartCard, LegendKey } from '@/components/charts/ChartCard'
import { CHART } from '@/components/charts/colors'
import { DumbbellBars } from '@/components/charts/DumbbellBars'
import { LineChart } from '@/components/charts/LineChart'
import type { TeamDashboard } from '@/types/management'

export function LevelingOverTime({ dashboard }: { dashboard: TeamDashboard }) {
  const { leveled, company_target: target } = dashboard
  const points = dashboard.leveled_over_time
  const percent = Math.round((leveled.count / leveled.total) * 100)

  return (
    <ChartCard
      title="Nivelamento ao longo do tempo"
      subtitle={`${percent}% da equipe nivelada · +${leveled.change} p.p. ${leveled.change_label}`}
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

export function BeforeAfter({ dashboard }: { dashboard: TeamDashboard }) {
  const competencies = dashboard.competencies

  return (
    <ChartCard
      title="Antes × depois por competência"
      subtitle="Nota média da equipe (0–100) no diagnóstico e hoje"
      legend={
        <>
          <LegendKey color={CHART.axis} label="Diagnóstico" shape="ring" />
          <LegendKey color={CHART.team} label="Hoje" shape="dot" />
          <LegendKey color={CHART.goal} label="Meta" shape="tick" />
        </>
      }
      table={{
        headers: ['Competência', 'Antes', 'Hoje', 'Meta'],
        rows: competencies.map((c) => [c.name, c.before, c.now, c.goal]),
      }}
    >
      <DumbbellBars rows={competencies} />
    </ChartCard>
  )
}
