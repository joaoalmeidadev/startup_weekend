import { useState } from 'react'
import { CHART } from './colors'

type Row = { name: string; value: number; goal: number }

// One bar per row (team average) with a tick for the goal; the gap is the story
export function BulletBars({ rows, max = 100 }: { rows: Row[]; max?: number }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <ul className="flex flex-col gap-space-md">
      {rows.map((row) => {
        const gap = row.value - row.goal
        return (
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
                <strong className="text-on-surface">{row.value}</strong> / meta {row.goal}
              </span>
            </div>
            <div className="relative h-6">
              <div className="absolute inset-y-0 left-0 w-full border-l border-[#e3e8e9]" />
              <div
                className={`absolute top-1 h-4 rounded-r-[4px] transition-opacity ${active && active !== row.name ? 'opacity-60' : ''}`}
                style={{ width: `${(row.value / max) * 100}%`, backgroundColor: CHART.team }}
              />
              <div
                className="absolute -top-0.5 h-7 w-1 -translate-x-1/2 rounded-full ring-2 ring-white"
                style={{ left: `${(row.goal / max) * 100}%`, backgroundColor: CHART.goal }}
              />
            </div>
            {active === row.name && (
              <div
                role="tooltip"
                className="pointer-events-none absolute top-0 right-0 z-10 -translate-y-full rounded-lg bg-inverse-surface px-space-sm py-1 text-inverse-on-surface shadow-lg"
              >
                <span className="text-label-md font-bold">{gap >= 0 ? `+${gap}` : gap} pts</span>
                <span className="text-label-sm"> {gap >= 0 ? 'acima da meta' : 'abaixo da meta'}</span>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
