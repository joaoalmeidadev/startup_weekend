import { Icon } from '@/components/Icon'
import type { PersonDetail } from '@/types/management'

type PathGroup = PersonDetail['path'][number]
type ModuleStep = PathGroup['modules'][number]

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

const groupLabel = (group: PathGroup, index: number) =>
  [`${index + 1}. ${group.title}`, ...(group.journeys.length > 0 ? [group.journeys.join(', ')] : [])].join(
    ' · ',
  )

// Same path the collaborator sees, shrunk to fit the manager's screen: every journey they receive, by kind
export function MiniJourney({ path }: { path: PersonDetail['path'] }) {
  return (
    <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
      {path.map((group, index) => (
        <div
          key={group.title}
          className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md"
        >
          <span className="text-label-md text-on-surface-variant">{groupLabel(group, index)}</span>
          {group.journeys.length === 0 && (
            <span className="text-body-sm text-outline">Nenhuma jornada de {group.title}</span>
          )}
          <ol className="flex flex-col gap-space-xs">
            {group.modules.map((module) => (
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
