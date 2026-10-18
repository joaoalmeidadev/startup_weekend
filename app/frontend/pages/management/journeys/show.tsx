import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { JourneyBuilderProps, ModuleSummary } from '@/types/management'
import { CatalogPanel } from './CatalogPanel'
import { JourneyCalculator } from './JourneyCalculator'
import { JourneyHeader } from './JourneyHeader'
import { JourneyPreview } from './JourneyPreview'
import { ReadyJourneyCard } from './ReadyJourneyCard'
import {
  addStep,
  changeHours,
  changeManualPoints,
  moveStep,
  removeStep,
  stepModuleIds,
  toSteps,
} from './journeyEditing'
import { journeyValue } from './journeyValue'

// The Biblioteca on the left, the participant's path on the right; the calculator on top follows every change
function JourneyBuilder(props: JourneyBuilderProps) {
  const { journey, catalog, goal, ready_journey, start_ready, points_rule, points_rule_source } = props
  const notify = useMockNotice()
  const [steps, setSteps] = useState(() =>
    toSteps(start_ready && ready_journey ? ready_journey : journey.modules),
  )
  const value = journeyValue(steps, goal, points_rule)

  const add = (module: ModuleSummary) => {
    setSteps((current) => addStep(current, module))
    notify(`"${module.name}" entrou na jornada.`)
  }
  const applyReady = (ready: ModuleSummary[]) => {
    setSteps(toSteps(ready))
    notify('Base Nivela pronta aplicada. Edite à vontade.')
  }

  return (
    <>
      <JourneyHeader
        journey={journey}
        goal={goal}
        points={value.points}
        options={props.audience_options}
        people={props.people}
      />
      <JourneyCalculator value={value} steps={steps} rule={points_rule} source={points_rule_source} />
      <div className="grid grid-cols-1 items-start gap-space-md lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-space-md">
          {ready_journey && (
            <ReadyJourneyCard
              ready={ready_journey}
              goal={goal}
              rule={points_rule}
              onApply={() => applyReady(ready_journey)}
            />
          )}
          <CatalogPanel catalog={catalog} inJourney={stepModuleIds(steps)} onAdd={add} />
        </div>
        <JourneyPreview
          steps={steps}
          rule={points_rule}
          badge={journey.badge}
          onMove={(index, direction) => setSteps((current) => moveStep(current, index, direction))}
          onRemove={(module) => setSteps((current) => removeStep(current, module.id))}
          onHoursChange={(id, hours) => setSteps((current) => changeHours(current, id, hours))}
          onManualPointsChange={(id, points) =>
            setSteps((current) => changeManualPoints(current, id, points))
          }
        />
      </div>
    </>
  )
}

export default function JourneysShow() {
  const props = usePage<JourneyBuilderProps>().props

  return (
    <ManagementLayout>
      <Head title={props.journey.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <JourneyBuilder {...props} />
      </div>
    </ManagementLayout>
  )
}
