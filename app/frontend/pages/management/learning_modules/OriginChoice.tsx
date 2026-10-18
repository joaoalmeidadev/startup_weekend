import { Link } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { SOURCES } from '@/components/SourceBadge'
import type { ContentSource } from '@/types/management'

export type PickedOrigin = Exclude<ContentSource, 'company'>

const CARD =
  'flex h-full w-full flex-col items-start gap-space-sm rounded-xl border-2 p-space-lg text-left transition-colors'

function CardBody({
  source,
  title,
  hint,
  extra,
}: {
  source: ContentSource
  title: string
  hint: string
  extra?: ReactNode
}) {
  return (
    <>
      <span className={`flex size-12 items-center justify-center rounded-xl ${SOURCES[source].className}`}>
        <Icon name={SOURCES[source].icon} className="text-[1.75rem]" />
      </span>
      <span className="text-headline-sm text-on-surface">{title}</span>
      <span className="text-body-sm text-on-surface-variant">{hint}</span>
      {extra}
    </>
  )
}

type OriginChoiceProps = { manualPath: string; readyPath: string; onPick: (origin: PickedOrigin) => void }

// First step of "Novo conteúdo": one big card per origin, the AI one recommended
export function OriginChoice({ manualPath, readyPath, onPick }: OriginChoiceProps) {
  return (
    <div className="flex flex-col gap-space-md">
      <h2 className="text-headline-sm text-on-surface">De onde vem este conteúdo?</h2>
      <ul className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        <li>
          <button
            type="button"
            onClick={() => onPick('ai')}
            className={`${CARD} border-primary bg-surface-container-low hover:bg-surface-container`}
          >
            <CardBody
              source="ai"
              title="Enviar material → a IA cria as lições"
              hint="Manual, PDF ou apresentação. Você revisa antes de publicar."
              extra={
                <span className="rounded-full bg-primary px-space-sm py-0.5 text-label-sm text-on-primary">
                  Recomendado
                </span>
              }
            />
          </button>
        </li>
        <li>
          <Link
            href={manualPath}
            className={`${CARD} border-surface-container-high hover:bg-surface-container-low`}
          >
            <CardBody
              source="company"
              title="Escrever do meu jeito"
              hint="Escreva as lições e a avaliação final."
            />
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onPick('nivela')}
            className={`${CARD} border-surface-container-high hover:bg-surface-container-low`}
          >
            <CardBody
              source="nivela"
              title="Usar um produto Nivela"
              hint="Comunicação, raciocínio, atendimento e mais. Prontos para qualquer setor."
            />
          </button>
        </li>
      </ul>
      <Link
        href={readyPath}
        className="flex flex-col justify-between gap-space-sm rounded-xl bg-primary-fixed p-space-md text-on-primary-fixed hover:brightness-95 md:flex-row md:items-center"
      >
        <span className="flex items-center gap-space-sm">
          <Icon name="bolt" className="text-[1.5rem]" />
          <span className="flex flex-col">
            <span className="text-label-lg">Começar com a jornada pronta</span>
            <span className="text-body-sm">
              Ainda sem material? Uma jornada só com produtos Nivela, montada em um clique e editável depois.
            </span>
          </span>
        </span>
        <Icon name="arrow_forward" className="text-[1.5rem]" />
      </Link>
    </div>
  )
}
