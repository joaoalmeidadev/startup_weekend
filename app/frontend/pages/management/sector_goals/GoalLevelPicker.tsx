import { Icon } from '@/components/Icon'
import type { GoalLevel, GoalLevelKey } from '@/types/management'

const LEVEL_ICONS: Record<GoalLevelKey, string> = {
  easy: 'signal_cellular_alt_1_bar',
  medium: 'signal_cellular_alt_2_bar',
  hard: 'signal_cellular_alt',
}

type GoalLevelPickerProps = {
  levels: GoalLevel[]
  selected: GoalLevelKey | null
  adjusted: boolean
  onPick: (level: GoalLevel) => void
}

// Market reference levels as big radio cards; picking one again resets the rulers to its target
export function GoalLevelPicker({ levels, selected, adjusted, onPick }: GoalLevelPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Nível da meta"
      className="grid grid-cols-1 gap-space-md md:grid-cols-3"
    >
      {levels.map((level) => {
        const checked = level.key === selected
        return (
          <button
            key={level.key}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onPick(level)}
            className={`flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg text-left shadow-sm transition-all hover:shadow-md ${checked ? 'ring-2 ring-primary' : 'ring-1 ring-outline-variant/40'}`}
          >
            <div className="flex items-center justify-between gap-space-sm">
              <span className="flex items-center gap-space-xs text-headline-sm text-on-surface">
                <Icon name={LEVEL_ICONS[level.key]} className="text-[1.25rem] text-primary" />
                {level.label}
                {checked && adjusted && (
                  <span className="rounded-full bg-secondary-fixed px-2 py-0.5 text-label-sm text-on-secondary-container">
                    ajustado
                  </span>
                )}
              </span>
              <Icon
                name={checked ? 'radio_button_checked' : 'radio_button_unchecked'}
                className={`text-[1.375rem] ${checked ? 'text-primary' : 'text-outline'}`}
              />
            </div>
            <span className="text-headline-lg font-bold text-primary">
              {level.target} <span className="text-label-md text-on-surface-variant">pts</span>
            </span>
            <span className="text-body-sm text-on-surface-variant">{level.hint}</span>
          </button>
        )
      })}
    </div>
  )
}
