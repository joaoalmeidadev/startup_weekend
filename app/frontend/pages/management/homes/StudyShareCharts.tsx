import { ChartCard, LegendKey } from '@/components/charts/ChartCard'
import { DonutChart, sharePercent, sliceColor } from '@/components/charts/DonutChart'
import type { StudyShareSlice, TeamDashboard } from '@/types/management'

type StudyShareCardProps = { title: string; subtitle: string; column: string; slices: StudyShareSlice[] }

// Hours of in-person training the completed contents replaced: a snapshot of today, whatever the period
function StudyShareCard({ title, subtitle, column, slices }: StudyShareCardProps) {
  const total = slices.reduce((sum, slice) => sum + slice.hours, 0)

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      legend={slices.map((slice, index) => (
        <LegendKey key={slice.label} color={sliceColor(slice.label, index)} label={slice.label} />
      ))}
      table={{
        headers: [column, 'Horas', '%'],
        rows: slices.map((slice) => [
          slice.label,
          `${slice.hours} h`,
          `${sharePercent(slice.hours, total)}%`,
        ]),
      }}
    >
      <DonutChart
        label={title}
        slices={slices.map((slice) => ({ label: slice.label, value: slice.hours }))}
        unit="h"
      />
    </ChartCard>
  )
}

export function StudyShare({ dashboard }: { dashboard: TeamDashboard }) {
  const { by_sector: bySector, by_person: byPerson } = dashboard.study_share

  return (
    <div className="grid grid-cols-1 gap-space-md xl:grid-cols-2">
      <StudyShareCard
        title="Estudo por setor"
        subtitle="Horas de treinamento presencial substituídas, hoje"
        column="Setor"
        slices={bySector}
      />
      <StudyShareCard
        title="Quem mais estuda"
        subtitle="As 4 pessoas com mais horas substituídas, hoje"
        column="Pessoa"
        slices={byPerson}
      />
    </div>
  )
}
