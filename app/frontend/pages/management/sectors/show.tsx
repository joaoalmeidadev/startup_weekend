import { Head, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { InviteSector, SectorDetail } from '@/types/management'
import { InviteMenu } from '../people/InviteMenu'
import { BackToSectors } from './Block'
import { peopleCount } from './peopleCount'
import { SectorGoal } from './SectorGoal'
import { SectorKindTag } from './SectorKindTag'
import { SectorPeople } from './SectorPeople'

type SectorsShowProps = { sector: SectorDetail; invite_sectors: InviteSector[] }

// Work sectors invite straight into themselves; a group still needs each person's work sector
function SectorInvite({ sector, sectors }: { sector: SectorDetail; sectors: InviteSector[] }) {
  if (sector.kind === 'group') return <InviteMenu sectors={sectors} />
  return <InviteMenu sectors={sectors} sector={sector.name} label="+ Convidar para este setor" />
}

export default function SectorsShow() {
  const { sector, invite_sectors: inviteSectors } = usePage<SectorsShowProps>().props

  return (
    <ManagementLayout>
      <Head title={sector.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <BackToSectors />
        <section className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm md:flex-row md:items-center">
          <div className="flex items-center gap-space-md">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary">
              <Icon name={sector.kind === 'group' ? 'diversity_3' : 'groups'} className="text-[1.5rem]" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-headline-lg text-on-surface">{sector.name}</h1>
              <span className="flex flex-wrap items-center gap-space-xs text-body-md text-on-surface-variant">
                <SectorKindTag kind={sector.kind} />
                {peopleCount(sector.people.length)}
              </span>
            </div>
          </div>
          <SectorInvite sector={sector} sectors={inviteSectors} />
        </section>
        <SectorPeople sector={sector} />
        <SectorGoal key={sector.slug} sector={sector} />
      </div>
    </ManagementLayout>
  )
}
