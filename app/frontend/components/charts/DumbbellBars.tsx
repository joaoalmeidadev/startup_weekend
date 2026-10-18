import { useState } from 'react'
import { CHART } from './colors'

type Row = { name: string; before: number; now: number; goal: number }

// One track per row: hollow ring = diagnostic, filled dot = today, tick = goal; the growth is the story.
// "Before" is told apart by shape and the direct label, not by color alone.
export function DumbbellBars({ rows, max = 100 }: { rows: Row[]; max?: number }) {
  const [active, setActive] = useState<string | null>(null)
  const at = (value: number) => `${(value / max) * 100}%`

  return (
    <ul className="flex flex-col gap-space-md">
      {rows.map((row) => (
        <li
          key={row.name}
          tabIndex={0}
          onPointerEnter={() => setActive(row.name)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(row.name)}
          onBlur={() => setActive(null)}
          className="relative flex flex-col gap-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          <div className="flex items-baseline justify-between gap-space-sm">
            <span className="text-label-md text-on-surface">{row.name}</span>
            <span className="text-body-sm text-on-surface-variant tabular-nums">
              {row.before} → <strong className="text-on-surface">{row.now}</strong>
            </span>
          </div>
          <div className="relative h-6">
            <div className="absolute top-1/2 h-px w-full" style={{ backgroundColor: CHART.grid }} />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
              style={{
                left: at(row.before),
                width: at(row.now - row.before),
                backgroundColor: CHART.team,
                opacity: 0.35,
              }}
            />
            <div
              className="absolute -top-0.5 h-7 w-1 -translate-x-1/2 rounded-full ring-2 ring-white"
              style={{ left: at(row.goal), backgroundColor: CHART.goal }}
            />
            <div
              className="absolute top-1/2 size-3 -translate-1/2 rounded-full border-2 bg-white"
              style={{ left: at(row.before), borderColor: CHART.axis }}
            />
            <div
              className="absolute top-1/2 size-3.5 -translate-1/2 rounded-full ring-2 ring-white"
              style={{ left: at(row.now), backgroundColor: CHART.team }}
            />
          </div>
          {active === row.name && (
            <div
              role="tooltip"
              className="pointer-events-none absolute top-0 right-0 z-10 -translate-y-full rounded-lg bg-inverse-surface px-space-sm py-1 text-inverse-on-surface shadow-lg"
            >
              <span className="text-label-md font-bold">+{row.now - row.before} pts</span>
              <span className="text-label-sm"> desde o diagnóstico</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
