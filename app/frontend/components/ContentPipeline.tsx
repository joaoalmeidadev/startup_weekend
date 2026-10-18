import { Link } from '@inertiajs/react'
import { Fragment } from 'react'
import { Icon } from '@/components/Icon'

type Step = 'library' | 'journeys'

const STEPS: { key: Step; label: string; href: string }[] = [
  { key: 'library', label: 'Biblioteca', href: '/management/library' },
  { key: 'journeys', label: 'Jornadas', href: '/management/journeys' },
]

const STEP = 'rounded-full px-space-sm py-1 text-label-md transition-colors'
const CURRENT = 'bg-primary-fixed font-semibold text-primary'
const OTHER = 'text-on-surface-variant hover:text-primary'

// Informative strip: the Biblioteca feeds the Jornadas, which reach the collaborator
export function ContentPipeline({ current }: { current: Step }) {
  return (
    <nav aria-label="Caminho do conteúdo" className="flex flex-wrap items-center gap-x-1 gap-y-space-xs">
      {STEPS.map((step) => (
        <Fragment key={step.key}>
          <Link
            href={step.href}
            aria-current={step.key === current ? 'step' : undefined}
            className={`${STEP} ${step.key === current ? CURRENT : OTHER}`}
          >
            {step.label}
          </Link>
          <Icon name="arrow_forward" className="text-[0.875rem] text-outline" />
        </Fragment>
      ))}
      <span className="px-space-sm py-1 text-label-md text-on-surface-variant">Colaborador</span>
    </nav>
  )
}
