import { Icon } from '@/components/Icon'
import type { JourneyGoal, ModuleSummary } from '@/types/management'
import { formatReais, journeyValue } from './journeyValue'

type ReadyJourneyCardProps = { ready: ModuleSummary[]; goal: JourneyGoal; onApply: () => void }

// One-click start with the Nivela base products only, editable afterwards
export function ReadyJourneyCard({ ready, goal, onApply }: ReadyJourneyCardProps) {
  const value = journeyValue(ready, goal)

  return (
    <section
      aria-labelledby="ready-journey-title"
      className="flex flex-col gap-space-sm rounded-xl bg-primary-fixed p-space-md text-on-primary-fixed"
    >
      <div className="flex items-start gap-space-sm">
        <Icon name="bolt" className="text-[1.5rem]" />
        <div className="flex flex-col">
          <h2 id="ready-journey-title" className="text-label-lg">
            Usar a Base Nivela pronta
          </h2>
          <p className="text-body-sm">
            Sem material ainda? Comece só com produtos Nivela e ajuste depois. {value.modules} módulos · ~
            {value.hours}h de repasse ({formatReais(value.cost)}) já resolvidos.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onApply}
        className="inline-flex h-11 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-md text-label-md text-on-primary hover:bg-primary-container"
      >
        <Icon name="playlist_add_check" className="text-[1.25rem]" />
        Usar a Base Nivela pronta
      </button>
    </section>
  )
}
