import { Fragment } from 'react'
import { Icon } from '@/components/Icon'
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
    hint: 'Matemática, português e comportamento prontos, mantidos pela Nivela.',
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

export function SourceFlows() {
  return (
    <section
      aria-labelledby="source-flows-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id="source-flows-title" className="text-headline-sm text-on-surface">
        Como o conteúdo chega ao colaborador
      </h2>
      <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
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
    </section>
  )
}
