import { Icon } from '@/components/Icon'
import type { Contribution, ContributionStatus } from '@/types/collaborator'

const STATUS: Record<ContributionStatus, { label: string; icon: string; className: string }> = {
  pending: {
    label: 'Em análise',
    icon: 'schedule',
    className: 'bg-secondary-fixed text-on-secondary-container',
  },
  approved: {
    label: 'Aprovada',
    icon: 'check_circle',
    className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  },
  changes_requested: {
    label: 'Ajuste pedido',
    icon: 'edit_note',
    className: 'bg-error-container text-on-error-container',
  },
}

const hoursText = (hours: number) => `${hours.toLocaleString('pt-BR')} h`

function StatusChip({ contribution }: { contribution: Contribution }) {
  const style = STATUS[contribution.status]
  const approvedPoints =
    contribution.status === 'approved' ? ` · +${contribution.awarded_points ?? 0} pts` : ''
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-space-sm py-0.5 text-label-sm font-bold ${style.className}`}
    >
      <Icon name={style.icon} className="text-[0.875rem]" />
      {`${style.label}${approvedPoints}`}
    </span>
  )
}

export function ContributionCard({ contribution }: { contribution: Contribution }) {
  const id = `contribution-${contribution.id}`
  return (
    <article
      aria-labelledby={id}
      className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
    >
      <h3 id={id} className="text-label-lg text-on-surface">
        {contribution.title}
      </h3>
      <span className="text-body-sm text-on-surface-variant">
        {`${contribution.sector} · ${hoursText(contribution.hours)} · enviada em ${contribution.sent_on}`}
      </span>
      <StatusChip contribution={contribution} />
    </article>
  )
}
