import { Icon } from '@/components/Icon'
import type { JourneyStatus, ModuleStatus } from '@/types/management'

type Status = JourneyStatus | ModuleStatus

const STYLES: Record<Status, { label: string; icon: string; className: string }> = {
  active: {
    label: 'Ativa',
    icon: 'check_circle',
    className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  },
  published: {
    label: 'Publicado',
    icon: 'check_circle',
    className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  },
  in_review: {
    label: 'Em revisão',
    icon: 'rate_review',
    className: 'bg-secondary-fixed text-on-secondary-container',
  },
  draft: {
    label: 'Rascunho',
    icon: 'edit_note',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
}

export function StatusPill({ status }: { status: Status }) {
  const style = STYLES[status]
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-space-sm py-0.5 text-label-sm font-bold ${style.className}`}
    >
      <Icon name={style.icon} className="text-[0.875rem]" />
      {style.label}
    </span>
  )
}
