import { Icon } from '@/components/Icon'
import type { SubmissionStatus } from '@/types/management'

const STYLES: Record<SubmissionStatus, { label: string; icon: string; className: string }> = {
  pending: {
    label: 'Aguardando',
    icon: 'schedule',
    className: 'bg-secondary-fixed text-on-secondary-container',
  },
  changes_requested: {
    label: 'Ajuste pedido',
    icon: 'edit_note',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
  approved: {
    label: 'Aprovada',
    icon: 'check_circle',
    className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  },
}

// Where a proposal stands; an approved one also tells the points the author earned
export function SubmissionStatusChip({
  status,
  points,
}: {
  status: SubmissionStatus
  points: number | null
}) {
  const style = STYLES[status]
  const label = status === 'approved' ? `${style.label} · +${points ?? 0} pts` : style.label
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-space-sm py-0.5 text-label-sm font-bold ${style.className}`}
    >
      <Icon name={style.icon} className="text-[0.875rem]" />
      {label}
    </span>
  )
}
