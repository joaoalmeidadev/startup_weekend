import { useState } from 'react'
import { CHART } from './colors'

type Stage = { stage: string; count: number }

// Ordered stages, one hue; each bar is measured against the first stage
export function FunnelBars({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState<string | null>(null)
  const start = stages[0]?.count || 1

  return (
    <ol className="flex flex-col gap-space-sm">
      {stages.map((stage) => {
        const share = Math.round((stage.count / start) * 100)
        return (
          <li
            key={stage.stage}
            tabIndex={0}
            onPointerEnter={() => setActive(stage.stage)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(stage.stage)}
            onBlur={() => setActive(null)}
            className="grid grid-cols-[minmax(8rem,11rem)_1fr_4.5rem] items-center gap-space-sm rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <span className="text-label-md text-on-surface">{stage.stage}</span>
            <div className="h-5">
              <div
                className={`h-full rounded-r-[4px] transition-opacity ${active && active !== stage.stage ? 'opacity-60' : ''}`}
                style={{ width: `${share}%`, backgroundColor: CHART.team }}
              />
            </div>
            <span className="text-body-sm text-on-surface-variant tabular-nums">
              <strong className="text-on-surface">{stage.count}</strong> · {share}%
            </span>
          </li>
        )
      })}
    </ol>
  )
}
