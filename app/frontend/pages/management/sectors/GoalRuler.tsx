import { Icon } from '@/components/Icon'

type GoalRulerProps = {
  label: string
  goal: number
  expertsAverage: number | null
  onChange: (goal: number) => void
}

// 0–100 track: filled up to the goal, grey pin on the veterans reference (when there is one), invisible range input on top
export function GoalRuler({ label, goal, expertsAverage, onChange }: GoalRulerProps) {
  return (
    <div className="flex flex-col gap-space-sm py-space-md">
      <div className="relative flex h-12 w-full items-center">
        <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full rounded-full bg-primary-container transition-all duration-150"
            style={{ width: `${goal}%` }}
          />
        </div>
        {expertsAverage !== null && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-10 flex flex-col items-center"
            style={{ left: `${expertsAverage}%`, transform: 'translateX(-50%)' }}
          >
            <div className="flex h-full w-0.5 flex-col items-center justify-between bg-outline">
              <span className="size-2.5 rounded-full bg-outline" />
              <span className="size-2.5 rounded-full bg-outline" />
            </div>
            <div className="absolute -top-7 rounded bg-surface-container-highest px-2 py-0.5 text-label-sm whitespace-nowrap text-on-surface-variant shadow-sm">
              Veteranos ({expertsAverage})
            </div>
          </div>
        )}
        <input
          type="range"
          min={0}
          max={100}
          value={goal}
          aria-label={`Meta de ${label}`}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 z-20 w-full cursor-ew-resize opacity-0"
        />
        <div
          className="pointer-events-none absolute top-1/2 z-10 flex flex-col items-center"
          style={{ left: `${goal}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="flex size-7 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-primary text-on-primary shadow-md">
            <Icon name="unfold_more" className="text-[0.875rem]" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 text-label-sm text-on-surface-variant">
        <span>0 pts</span>
        <span>50 pts</span>
        <span>100 pts</span>
      </div>
    </div>
  )
}
