import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { RoleChange } from '@/types/management'

type Role = RoleChange['roles'][number]

const BUTTON =
  'inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50'

function PickRole({
  roles,
  picked,
  onPick,
  onNext,
}: {
  roles: Role[]
  picked: Role | null
  onPick: (role: Role) => void
  onNext: () => void
}) {
  return (
    <>
      <h2 className="text-headline-sm text-on-surface">1. Para qual cargo?</h2>
      <div role="radiogroup" aria-label="Novo cargo" className="grid grid-cols-1 gap-space-sm md:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.title}
            type="button"
            role="radio"
            aria-checked={picked?.title === role.title}
            onClick={() => onPick(role)}
            className={`flex flex-col gap-1 rounded-xl p-space-md text-left ${picked?.title === role.title ? 'border-2 border-primary-container bg-surface-container-low' : 'border border-surface-container-high bg-surface-container-lowest'}`}
          >
            <span className="text-label-lg text-on-surface">{role.title}</span>
            <span className="text-body-sm text-on-surface-variant">
              {role.missing.length} {role.missing.length === 1 ? 'competência' : 'competências'} para aprender
            </span>
          </button>
        ))}
      </div>
      <button type="button" disabled={!picked} onClick={onNext} className={BUTTON}>
        Ver o que falta
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </button>
    </>
  )
}

function Gaps({ role, onNext }: { role: Role; onNext: () => void }) {
  return (
    <>
      <h2 className="text-headline-sm text-on-surface">2. O que falta aprender para {role.title}</h2>
      {role.missing.length === 0 ? (
        <p className="text-body-md text-on-surface">Já domina tudo o que o cargo pede.</p>
      ) : (
        <ul className="flex flex-col gap-space-xs">
          {role.missing.map((competency) => (
            <li
              key={competency}
              className="flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-sm text-body-md text-on-surface"
            >
              <Icon name="school" className="text-[1.25rem] text-primary" />
              {competency}
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={onNext} className={BUTTON}>
        Criar nova jornada
        <Icon name="route" className="text-[1.25rem]" />
      </button>
    </>
  )
}

function Done({ person, role }: { person: RoleChange['person']; role: Role }) {
  return (
    <div role="status" className="flex flex-col items-center gap-space-md p-space-lg text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <Icon name="task_alt" className="text-[2.25rem]" />
      </div>
      <span className="text-headline-md text-on-surface">Jornada de transição criada (simulação)</span>
      <span className="text-body-md text-on-surface-variant">
        {person.name} vai seguir para {role.title}. Prazo sugerido: {role.weeks} semana(s).
      </span>
      <Link href={`/management/people/${person.id}`} className={BUTTON}>
        Voltar para {person.name.split(' ')[0]}
      </Link>
    </div>
  )
}

export default function RoleChangesShow() {
  const { role_change: change } = usePage<{ role_change: RoleChange }>().props
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<Role | null>(null)

  return (
    <ManagementLayout>
      <Head title="Mudar de função" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg pt-space-md">
        <Link
          href={`/management/people/${change.person.id}`}
          className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
        >
          <Icon name="chevron_left" className="text-[1.125rem]" />
          {change.person.name}
        </Link>
        <div className="flex flex-col gap-space-xs">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Mudar de função</h1>
          <p className="text-body-md text-on-surface-variant">
            Hoje: {change.person.role} · {change.person.sector}
          </p>
        </div>
        <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
          {step === 0 && (
            <PickRole roles={change.roles} picked={picked} onPick={setPicked} onNext={() => setStep(1)} />
          )}
          {step === 1 && picked && <Gaps role={picked} onNext={() => setStep(2)} />}
          {step === 2 && picked && <Done person={change.person} role={picked} />}
        </section>
      </div>
    </ManagementLayout>
  )
}
