import { Head, Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { PersonDetail } from '@/types/management'
import { MiniJourney } from './MiniJourney'
import { PERSON_STATUS } from './PersonCard'

function Card({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <h2 className="flex items-center gap-space-xs text-headline-sm text-on-surface">
        <Icon name={icon} className="text-[1.375rem] text-primary" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <p className="text-body-sm text-outline">{empty}</p>
  return (
    <ul className="flex flex-col gap-space-xs">
      {items.map((item) => (
        <li key={item} className="text-body-md text-on-surface">
          • {item}
        </li>
      ))}
    </ul>
  )
}

export default function PeopleShow() {
  const { person } = usePage<{ person: PersonDetail }>().props
  const status = PERSON_STATUS[person.status]
  const note = person.alert?.text ?? person.achievement

  return (
    <ManagementLayout>
      <Head title={person.name} />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <Link
          href="/management/people"
          className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
        >
          <Icon name="chevron_left" className="text-[1.125rem]" />
          Pessoas
        </Link>
        <section className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:flex-row lg:items-center">
          <div className="flex items-center gap-space-md">
            <img src={person.avatar_url} alt="" className="size-20 rounded-full object-cover" />
            <div className="flex flex-col gap-1">
              <h1 className="text-headline-lg text-on-surface">{person.name}</h1>
              <span className="text-body-md text-on-surface-variant">
                {person.role} · {person.sector} · {person.tenure}
              </span>
              <div className="flex flex-wrap items-center gap-space-sm">
                <span
                  className={`inline-flex items-center gap-space-xs rounded-full px-space-md py-1 ${status.badge}`}
                >
                  <Icon name={status.icon} className="text-[1rem]" />
                  <span className="text-label-md font-bold">{status.label}</span>
                </span>
                {note && <span className="text-body-sm font-semibold text-on-surface-variant">{note}</span>}
              </div>
            </div>
          </div>
        </section>

        <Card title={`Jornada: ${person.journey.name}`} icon="route">
          <MiniJourney journey={person.journey} />
        </Card>

        <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
          <Card title="Já sabe" icon="check_circle">
            <BulletList items={person.knows} empty="Ainda não concluiu nenhum módulo." />
          </Card>
          <Card title="Está aprendendo" icon="school">
            <BulletList items={person.learning} empty="Concluiu toda a jornada." />
          </Card>
          <Card title="O que os colegas dizem" icon="forum">
            <BulletList items={person.feedback} empty="Sem avaliações ainda." />
          </Card>
        </div>
      </div>
    </ManagementLayout>
  )
}
