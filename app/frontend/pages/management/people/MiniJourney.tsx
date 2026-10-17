import { Icon } from '@/components/Icon'
import type { PersonDetail } from '@/types/management'

type ModuleStep = PersonDetail['journey']['stretches'][number]['modules'][number]

function StepDot({ status }: { status: ModuleStep['status'] }) {
  if (status === 'done') {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-primary">
        <Icon name="check" className="text-[1rem]" />
      </span>
    )
  }
  if (status === 'current') {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary ring-4 ring-primary-container/20">
        <Icon name="play_arrow" className="text-[1rem]" />
      </span>
    )
  }
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-outline">
      <Icon name="lock" className="text-[0.875rem]" />
    </span>
  )
}

// Same path the collaborator sees, shrunk to fit the manager's screen
export function MiniJourney({ journey }: { journey: PersonDetail['journey'] }) {
  return (
    <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
      {journey.stretches.map((stretch, index) => (
        <div
          key={stretch.title}
          className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md"
        >
          <span className="text-label-md text-on-surface-variant">
            {index + 1}. {stretch.title}
          </span>
          {stretch.modules.length === 0 && <span className="text-body-sm text-outline">Sem módulos</span>}
          <ol className="flex flex-col gap-space-xs">
            {stretch.modules.map((module) => (
              <li key={module.name} className="flex items-center gap-space-sm">
                <StepDot status={module.status} />
                <span
                  className={`text-body-sm ${module.status === 'locked' ? 'text-outline' : 'text-on-surface'} ${module.status === 'current' ? 'font-bold' : ''}`}
                >
                  {module.name}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
