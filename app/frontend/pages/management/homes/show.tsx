import { Head, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { Manager, TeamDashboard } from '@/types/management'
import { OnTheJob, Retention } from './ImpactCards'
import { BeforeAfter, LevelingOverTime } from './MetricsCharts'
import { PeriodFilter } from './MetricsSummary'
import { ProofFigures } from './ProofFigures'
import { StudyShare } from './StudyShareCharts'

// Real download: the people report is generated as CSV by the server
function ExportButton() {
  return (
    <a
      href="/management/people.csv"
      download
      className="inline-flex items-center gap-space-xs text-label-md text-primary hover:underline"
    >
      <Icon name="download" className="text-[1.125rem]" />
      Exportar relatório
    </a>
  )
}

function PageHeader({ company }: { company: string }) {
  return (
    <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
      <div className="flex flex-col">
        <span className="text-label-sm font-bold tracking-wider text-primary uppercase">
          Gestão • {company}
        </span>
        <h1 className="text-headline-xl tracking-tight text-on-surface">Dashboard</h1>
        <p className="mt-space-xs text-body-md text-on-surface-variant">
          Como a Nivela está fazendo a equipe aprender.
        </p>
      </div>
      <ExportButton />
    </div>
  )
}

export default function HomesShow() {
  const { dashboard, manager } = usePage<{ dashboard: TeamDashboard; manager: Manager }>().props

  return (
    <ManagementLayout>
      <Head title="Dashboard" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <PageHeader company={manager.company} />
        <PeriodFilter dashboard={dashboard} />
        <ProofFigures dashboard={dashboard} />
        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-2">
          <BeforeAfter dashboard={dashboard} />
          <LevelingOverTime dashboard={dashboard} />
        </div>
        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-2">
          <Retention dashboard={dashboard} />
          <OnTheJob dashboard={dashboard} />
        </div>
        <StudyShare dashboard={dashboard} />
      </div>
    </ManagementLayout>
  )
}
