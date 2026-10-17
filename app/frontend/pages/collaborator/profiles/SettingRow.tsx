import { Icon } from '@/components/Icon'

type SettingRowProps = {
  icon: string
  title: string
  value: string
  actionIcon: string
  actionLabel: string
  actionAriaLabel: string
  onAction: () => void
}

export function SettingRow({
  icon,
  title,
  value,
  actionIcon,
  actionLabel,
  actionAriaLabel,
  onAction,
}: SettingRowProps) {
  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low">
            <Icon name={icon} className="text-[1.75rem] text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-body-lg-bold text-on-surface">{title}</span>
            <span className="text-body-lg text-on-surface-variant">{value}</span>
          </div>
        </div>
        <button
          type="button"
          aria-label={actionAriaLabel}
          onClick={onAction}
          className="flex min-h-[3.5rem] shrink-0 items-center justify-center gap-space-xs rounded-xl bg-surface-container px-space-md transition-all hover:bg-surface-container-high active:scale-[0.98]"
        >
          <Icon name={actionIcon} className="text-[1.375rem] text-on-surface" />
          <span className="text-label-lg text-on-surface">{actionLabel}</span>
        </button>
      </div>
    </div>
  )
}
