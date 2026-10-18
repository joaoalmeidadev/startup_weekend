import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { JourneyBuilderProps, ModuleSummary } from '@/types/management'
import { CatalogPanel } from './CatalogPanel'
import { JourneyHeader } from './JourneyHeader'
import { JourneyPreview } from './JourneyPreview'
import { ReadyJourneyCard } from './ReadyJourneyCard'
import { ValueSummary } from './ValueSummary'
import { addModule, moduleIds, moveModule, removeModule } from './journeyEditing'
import { journeyValue } from './journeyValue'

// The Biblioteca on the left, the participant's path on the right; the value on top follows every change
function JourneyBuilder({ journey, catalog, goal, ready_journey, start_ready }: JourneyBuilderProps) {
  const notify = useMockNotice()
  const [modules, setModules] = useState(start_ready && ready_journey ? ready_journey : journey.modules)

  const add = (module: ModuleSummary) => {
    setModules((current) => addModule(current, module))
    notify(`"${module.name}" entrou na jornada.`)
  }
  const applyReady = (ready: ModuleSummary[]) => {
    setModules(ready)
    notify('Base Nivela pronta aplicada. Edite à vontade.')
  }
  const remove = (module: ModuleSummary) => setModules((current) => removeModule(current, module.id))
  const move = (index: number, direction: -1 | 1) =>
    setModules((current) => moveModule(current, index, direction))

  return (
    <>
      <ValueSummary value={journeyValue(modules, goal)} />
      <div className="grid grid-cols-1 items-start gap-space-md lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-space-md">
          {ready_journey && (
            <ReadyJourneyCard ready={ready_journey} goal={goal} onApply={() => applyReady(ready_journey)} />
          )}
          <CatalogPanel catalog={catalog} inJourney={moduleIds(modules)} onAdd={add} />
        </div>
        <JourneyPreview modules={modules} badge={journey.badge} onMove={move} onRemove={remove} />
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
        <JourneyHeader
          journey={props.journey}
          goal={props.goal}
          options={props.audience_options}
          people={props.people}
        />
        <JourneyBuilder {...props} />
      </div>
    </ManagementLayout>
  )
}
