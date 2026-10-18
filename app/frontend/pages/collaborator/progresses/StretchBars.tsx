import type { StretchProgress } from '@/types/collaborator'

function StretchBar({ stretch }: { stretch: StretchProgress }) {
  const percent = stretch.total === 0 ? 0 : Math.round((stretch.completed / stretch.total) * 100)

  return (
    <li className="flex flex-col gap-space-xs">
      <div className="flex items-center justify-between">
        <span className="text-body-lg-bold text-on-surface">{stretch.name}</span>
        <span className="text-body-lg text-on-surface-variant">
          {stretch.completed} de {stretch.total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={stretch.name}
        aria-valuemin={0}
        aria-valuemax={stretch.total}
        aria-valuenow={stretch.completed}
        className="h-4 w-full overflow-hidden rounded-full bg-surface-container-high"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </li>
  )
}

export function StretchBars({ stretches }: { stretches: StretchProgress[] }) {
  return (
    <ul className="flex flex-col gap-space-md">
      {stretches.map((stretch) => (
        <StretchBar key={stretch.name} stretch={stretch} />
      ))}
    </ul>
  )
}
