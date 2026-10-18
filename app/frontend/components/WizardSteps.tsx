import { Icon } from '@/components/Icon'

// The "Novo conteúdo" assistant: upload, AI, review and publish share this indicator
export const WIZARD_STEPS = ['Enviar o material', 'A IA cria as lições', 'Revisar', 'Publicar'] as const

type StepState = 'done' | 'current' | 'next'

const BULLET: Record<StepState, string> = {
  done: 'bg-tertiary-container text-on-primary',
  current: 'bg-primary text-on-primary',
  next: 'bg-surface-container-high text-on-surface-variant',
}

function stepState(index: number, current: number): StepState {
  if (index < current) return 'done'
  return index === current ? 'current' : 'next'
}

export function WizardSteps({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-space-sm" aria-label="Etapas">
      {WIZARD_STEPS.map((label, index) => {
        const state = stepState(index, current)
        return (
          <li
            key={label}
            aria-current={state === 'current' ? 'step' : undefined}
            className="flex items-center gap-space-xs"
          >
            <span
              className={`flex size-8 items-center justify-center rounded-full text-label-md ${BULLET[state]}`}
            >
              {state === 'done' ? <Icon name="check" className="text-[1.125rem]" /> : index + 1}
            </span>
            <span
              className={`text-label-md ${state === 'next' ? 'text-on-surface-variant' : 'text-on-surface'}`}
            >
              {label}
            </span>
            {index < WIZARD_STEPS.length - 1 && (
              <Icon name="chevron_right" className="text-[1.25rem] text-outline" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
