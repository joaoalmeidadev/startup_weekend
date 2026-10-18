import { Head, Link, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import { slugify } from '@/lib/text'
import type { PersonDetail } from '@/types/management'
import { MiniJourney } from './MiniJourney'
import { BadgeCard, Card, RewardsCard, StudyCard } from './PersonCards'
import { PersonAvatar } from './PersonAvatar'
import { PersonHighlights } from './PersonHighlights'
import { SalaryField } from './SalaryField'
import { PERSON_STATUS } from './personStatus'

export default function PeopleShow() {
  const { person } = usePage<{ person: PersonDetail }>().props
  const status = PERSON_STATUS[person.status]

  return (
    <ManagementLayout>
      <Head title={person.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <Link
          href={`/management/sectors/${slugify(person.sector)}`}
          aria-label={`Voltar para ${person.sector}`}
          className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
        >
          <Icon name="chevron_left" className="text-[1.125rem]" />
          {person.sector}
        </Link>
        <section className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:flex-row lg:items-center">
          <div className="flex items-center gap-space-md">
            <PersonAvatar person={person} size="lg" />
            <div className="flex flex-col gap-1">
              <h1 className="text-headline-lg text-on-surface">{person.name}</h1>
              <span className="text-body-md text-on-surface-variant">
                {person.role} · {person.sector} · {person.tenure}
              </span>
              <SalaryField name={person.name} salary={person.salary} />
              <span
                className={`inline-flex w-fit items-center gap-space-xs rounded-full px-space-md py-1 ${status.soft}`}
              >
                <Icon name={status.icon} className="text-[1rem]" />
                <span className="text-label-md font-bold">{status.label}</span>
              </span>
            </div>
          </div>
        </section>

        <PersonHighlights person={person} />

        <Card title="Trilha" icon="route">
          <MiniJourney path={person.path} />
        </Card>

        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-[3fr_2fr]">
          <StudyCard person={person} />
          <div className="flex flex-col gap-space-md">
            <BadgeCard person={person} />
            <RewardsCard person={person} />
          </div>
        </div>
      </div>
    </ManagementLayout>
  )
}
