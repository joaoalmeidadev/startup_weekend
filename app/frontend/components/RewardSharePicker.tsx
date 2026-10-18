import { useState } from 'react'

const PRESETS = [
  { share: 0.2, title: 'Econômico' },
  { share: 0.4, title: 'Equilibrado' },
  { share: 0.6, title: 'Generoso' },
]

const OPTION =
  'flex cursor-pointer items-center gap-space-xs rounded-xl border-2 px-space-md py-space-sm text-label-md'
const percentOf = (share: number) => Math.round(share * 100)

type Props = { value: number; onChange: (share: number) => void }

// How much of the training saved becomes rewards, as three plain options plus a custom percentage
export function RewardSharePicker({ value, onChange }: Props) {
  const isPreset = PRESETS.some((preset) => preset.share === value)
  const [custom, setCustom] = useState(!isPreset)

  const option = (checked: boolean, label: string, onPick: () => void) => (
    <label
      key={label}
      className={`${OPTION} ${checked ? 'border-primary bg-surface-container-low text-on-surface' : 'border-surface-container-high text-on-surface-variant'}`}
    >
      <input
        type="radio"
        name="reward-share"
        checked={checked}
        onChange={onPick}
        className="text-primary-container"
      />
      {label}
    </label>
  )

  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="mb-space-xs text-label-md text-on-surface">Quanto da economia vira prêmio</legend>
      <div className="flex flex-wrap gap-space-xs">
        {PRESETS.map((preset) =>
          option(!custom && value === preset.share, `${preset.title} · ${percentOf(preset.share)}%`, () => {
            setCustom(false)
            onChange(preset.share)
          }),
        )}
        {option(custom, 'Personalizar', () => setCustom(true))}
      </div>
      {custom && (
        <label className="flex items-center gap-space-sm text-label-md text-on-surface">
          Porcentagem que vira prêmio (%)
          <input
            type="number"
            min={0}
            max={100}
            value={percentOf(value)}
            onChange={(event) => onChange(Number(event.target.value || 0) / 100)}
            className="h-10 w-24 rounded-xl border-0 bg-surface-container-low px-space-sm text-body-md focus:ring-2 focus:ring-primary-container"
          />
        </label>
      )}
      <p className="text-body-sm text-on-surface-variant">
        {`A cada R$ 100 economizados, R$ ${percentOf(value)} viram prêmio.`}
      </p>
    </fieldset>
  )
}
