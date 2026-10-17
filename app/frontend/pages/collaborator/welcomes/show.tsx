import { Head, router, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import { FocusLayout } from '@/layouts/FocusLayout'
import type { Viewer } from '@/types/collaborator'

const STEPS = [
  { icon: 'psychology_alt', text: 'A gente conhece você' },
  { icon: 'timer', text: 'Você aprende 5 minutos por dia' },
  { icon: 'military_tech', text: 'Você ganha seu selo' },
]

export default function WelcomesShow() {
  const { viewer } = usePage<{ viewer: Viewer }>().props

  return (
    <FocusLayout>
      <Head title="Boas-vindas" />
      <div className="flex flex-col gap-space-xs pt-space-lg">
        <h1 className="text-headline-xl text-on-surface">Oi, {viewer.first_name}!</h1>
        <p className="text-body-xl text-on-surface-variant">
          Bem-vinda à {viewer.company}. Sua jornada tem 3 passos simples:
        </p>
      </div>
      <ol className="flex flex-col gap-space-md">
        {STEPS.map((step, index) => (
          <li
            key={step.text}
            className="flex items-center gap-space-md rounded-2xl border-[1.5px] border-slate-200 bg-surface-container-lowest p-space-md"
          >
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary-container">
              <Icon name={step.icon} className="text-[2.25rem]" />
            </span>
            <span className="text-headline-md text-on-surface">
              {index + 1}. {step.text}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-body-lg text-on-surface-variant">
        Primeiro, um teste rápido para montar uma jornada só com o que você precisa.
      </p>
      <PrimaryButton onClick={() => router.visit('/collaborator/diagnostic')}>Começar</PrimaryButton>
    </FocusLayout>
  )
}
