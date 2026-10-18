import { Head, router, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import { FocusLayout } from '@/layouts/FocusLayout'
import type { DiagnosticResult } from '@/types/collaborator'

function ResultBlock({
  title,
  icon,
  items,
  tone,
}: {
  title: string
  icon: string
  items: string[]
  tone: 'known' | 'learn'
}) {
  const color =
    tone === 'known' ? 'bg-tertiary-container text-on-primary' : 'bg-primary-container text-on-primary'
  return (
    <section className="flex flex-col gap-space-sm rounded-2xl border-[1.5px] border-slate-200 bg-surface-container-lowest p-space-lg">
      <h2 className="flex items-center gap-space-sm text-headline-md text-on-surface">
        <span className={`flex size-10 items-center justify-center rounded-full ${color}`}>
          <Icon name={icon} className="text-[1.5rem]" />
        </span>
        {title}
      </h2>
      <ul className="flex flex-col gap-space-xs pl-space-xs">
        {items.map((item) => (
          <li key={item} className="text-body-lg text-on-surface">
            • {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function DiagnosticsResult() {
  const { result } = usePage<{ result: DiagnosticResult }>().props

  return (
    <FocusLayout progress={1}>
      <Head title="Seu resultado" />
      <div className="flex flex-col gap-space-xs pt-space-md">
        <h1 className="text-headline-xl text-on-surface">Pronto! Já conhecemos você.</h1>
        <p className="text-body-xl text-on-surface-variant">
          Montamos sua jornada: <strong>{result.modules} módulos</strong>, uns {result.minutes_per_day}{' '}
          minutos por dia.
        </p>
      </div>
      <ResultBlock title="Você já sabe" icon="check" items={result.known} tone="known" />
      <ResultBlock title="Vamos aprender" icon="arrow_forward" items={result.to_learn} tone="learn" />
      <PrimaryButton onClick={() => router.visit('/collaborator/journeys')}>Ver minha jornada</PrimaryButton>
    </FocusLayout>
  )
}
