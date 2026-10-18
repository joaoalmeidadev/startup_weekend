import { Link } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { Person } from '@/types/management'
import { PersonAvatar } from './PersonAvatar'
import { Forecast, JourneyProgress, ScoreVsGoal } from './PersonFigures'

export const ROW_COLUMNS =
  'lg:grid-cols-[minmax(0,2fr)_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_1.5rem]'

// On small screens each figure carries its own caption; on large screens the header row does
function Cell({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-label-sm text-outline lg:hidden">{caption}</span>
      {children}
    </div>
  )
}

export function PersonRow({ person }: { person: Person }) {
  return (
    <Link
      href={`/management/people/${person.id}`}
      className={`grid grid-cols-2 items-center gap-x-space-md gap-y-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary-fixed-dim ${ROW_COLUMNS}`}
    >
      <div className="col-span-2 flex min-w-0 items-center gap-space-sm lg:col-span-1">
        <PersonAvatar person={person} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-label-lg text-on-surface">{person.name}</span>
          <span className="text-body-sm text-on-surface-variant">{person.sector}</span>
        </div>
      </div>
      <Cell caption="Progresso">
        <JourneyProgress progress={person.progress} />
      </Cell>
      <Cell caption="Nota × meta">
        <ScoreVsGoal score={person.score} goal={person.goal} />
      </Cell>
      <Cell caption="Atividade">
        <span className="text-body-sm text-on-surface">{person.activity}</span>
      </Cell>
      <Cell caption="Previsão">
        <Forecast status={person.status} forecast={person.forecast} />
      </Cell>
      <Icon name="chevron_right" className="hidden text-[1.25rem] text-outline lg:block" />
    </Link>
  )
}
