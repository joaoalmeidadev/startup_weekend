import { Icon } from '@/components/Icon'

const STEPS = [
  { icon: 'psychology', label: 'Base' },
  { icon: 'apartment', label: 'Empresa' },
  { icon: 'support_agent', label: 'Setor' },
]

// Miniature of the journey path so people recognise where they are going
export function JourneyPreview() {
  return (
    <ol className="flex items-start justify-between" aria-label="Sua jornada">
      {STEPS.map((step) => (
        <li key={step.label} className="flex flex-1 flex-col items-center gap-space-xs">
          <span className="flex size-12 items-center justify-center rounded-full bg-surface-container text-primary-container">
            <Icon name={step.icon} />
          </span>
          <span className="text-label-md text-on-surface-variant">{step.label}</span>
        </li>
      ))}
      <li className="flex flex-1 flex-col items-center gap-space-xs">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed">
          <Icon name="military_tech" />
        </span>
        <span className="text-label-md text-on-surface-variant">Selo</span>
      </li>
    </ol>
  )
}
