import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { Person } from '@/types/management'
import { Forecast, JourneyProgress, ScoreVsGoal } from './PersonFigures'

function Block({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <span className="flex items-center gap-space-xs text-label-md text-on-surface-variant">
        <Icon name={icon} className="text-[1.125rem] text-primary" />
        {title}
      </span>
      {children}
    </div>
  )
}

// The same four figures of the people list, big enough to read at a glance
export function PersonHighlights({ person }: { person: Person }) {
  return (
    <section
      aria-label="Resumo da pessoa"
      className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4"
    >
      <Block title="Nota × meta" icon="flag">
        <ScoreVsGoal score={person.score} goal={person.goal} large />
      </Block>
      <Block title="Previsão" icon="event">
        <Forecast status={person.status} forecast={person.forecast} />
      </Block>
      <Block title="Progresso na jornada" icon="route">
        <JourneyProgress progress={person.progress} />
      </Block>
      <Block title="Atividade" icon="schedule">
        <span className="text-body-md text-on-surface">{person.activity}</span>
      </Block>
    </section>
  )
}
