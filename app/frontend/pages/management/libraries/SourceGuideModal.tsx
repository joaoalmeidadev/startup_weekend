import { Fragment } from 'react'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import { SOURCES, SOURCE_ORDER } from '@/components/SourceBadge'
import type { ContentSource } from '@/types/management'

// The path each origin takes until the collaborator; only AI content goes through the HR review
const FLOWS: Record<ContentSource, { steps: string[]; hint: string }> = {
  ai: {
    steps: ['Material', 'IA cria', 'Você revisa', 'Jornada', 'Colaborador'],
    hint: 'Envie um manual ou PDF; nada chega à equipe sem a sua aprovação.',
  },
  nivela: {
    steps: ['Biblioteca Nivela', 'Jornada', 'Colaborador'],
    hint: 'Base e habilidades gerais de qualquer setor, prontas e mantidas pela Nivela.',
  },
  company: {
    steps: ['Você escreve', 'Jornada', 'Colaborador'],
    hint: 'Lições escritas pela própria empresa, do seu jeito.',
  },
}

function FlowSteps({ source }: { source: ContentSource }) {
  const { label } = SOURCES[source]
  return (
    <ol aria-label={`Caminho: ${label}`} className="flex flex-wrap items-center gap-x-1 gap-y-space-xs">
      {FLOWS[source].steps.map((step, index) => (
        <Fragment key={step}>
          {index > 0 && <Icon name="arrow_forward" className="text-[0.875rem] text-outline" />}
          <li className="text-label-md text-on-surface">{step}</li>
        </Fragment>
      ))}
    </ol>
  )
}

export function SourceGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal icon="info" title="De onde vem cada conteúdo" onClose={onClose}>
      <div className="flex flex-col gap-space-md">
        {SOURCE_ORDER.map((source) => (
          <div key={source} className="flex gap-space-sm">
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${SOURCES[source].className}`}
            >
              <Icon name={SOURCES[source].icon} className="text-[1.25rem]" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-label-lg text-on-surface">{SOURCES[source].label}</span>
              <FlowSteps source={source} />
              <span className="text-body-sm text-on-surface-variant">{FLOWS[source].hint}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="h-11 rounded-xl bg-primary text-label-lg text-on-primary transition-colors hover:bg-primary-container"
      >
        Entendi
      </button>
    </Modal>
  )
}
