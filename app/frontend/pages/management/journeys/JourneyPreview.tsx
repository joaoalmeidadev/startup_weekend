import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { SourceBadge } from '@/components/SourceBadge'
import type { ModuleSummary, Stretch, StretchKey } from '@/types/management'

type PreviewActions = {
  onMove: (key: StretchKey, index: number, direction: -1 | 1) => void
  onRemove: (key: StretchKey, module: ModuleSummary) => void
}

const CONTROL =
  'flex size-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30'

type PathStopProps = PreviewActions & {
  module: ModuleSummary
  stretchKey: StretchKey
  index: number
  number: number
  isLast: boolean
}

// One module on the path, as in Minha jornada: a numbered circle with its card below
function PathStop({ module, stretchKey, index, number, isLast, onMove, onRemove }: PathStopProps) {
  return (
    <li className="flex w-full max-w-xs flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary-container text-headline-sm text-on-primary shadow-md">
        {number}
      </span>
      <div className="mt-space-sm flex w-full flex-col items-center gap-1 rounded-xl bg-surface-container-low p-space-sm">
        <Link
          href={`/management/modules/${module.id}`}
          className="text-label-lg text-on-surface hover:underline"
        >
          {module.name}
        </Link>
        <span className="flex flex-wrap items-center justify-center gap-space-xs text-body-sm text-on-surface-variant">
          <SourceBadge source={module.source} />
          {module.lessons} lições
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Subir ${module.name}`}
            disabled={index === 0}
            onClick={() => onMove(stretchKey, index, -1)}
            className={CONTROL}
          >
            <Icon name="keyboard_arrow_up" className="text-[1.25rem]" />
          </button>
          <button
            type="button"
            aria-label={`Descer ${module.name}`}
            disabled={isLast}
            onClick={() => onMove(stretchKey, index, 1)}
            className={CONTROL}
          >
            <Icon name="keyboard_arrow_down" className="text-[1.25rem]" />
          </button>
          <button
            type="button"
            aria-label={`Remover ${module.name}`}
            onClick={() => onRemove(stretchKey, module)}
            className={`${CONTROL} hover:text-error`}
          >
            <Icon name="close" className="text-[1.25rem]" />
          </button>
        </div>
      </div>
    </li>
  )
}

type StretchStopsProps = PreviewActions & { stretch: Stretch; number: number; firstPosition: number }

function StretchStops({ stretch, number, firstPosition, ...actions }: StretchStopsProps) {
  return (
    <section
      aria-label={`Trecho ${stretch.title}`}
      className="z-10 flex w-full flex-col items-center gap-space-md"
    >
      <h3 className="rounded-full bg-surface-container px-space-md py-space-xs text-label-lg text-on-surface shadow-sm">
        {number}. {stretch.title}
      </h3>
      {stretch.modules.length > 0 ? (
        <ol className="flex w-full flex-col items-center gap-space-md">
          {stretch.modules.map((module, index) => (
            <PathStop
              key={module.id}
              module={module}
              stretchKey={stretch.key}
              index={index}
              number={firstPosition + index}
              isLast={index === stretch.modules.length - 1}
              {...actions}
            />
          ))}
        </ol>
      ) : (
        <p className="w-full max-w-xs rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-lowest p-space-md text-center text-body-sm text-on-surface-variant">
          Nenhum módulo neste trecho ainda.
        </p>
      )}
    </section>
  )
}

const startPositions = (stretches: Stretch[]) =>
  stretches.map((_, index) => 1 + stretches.slice(0, index).reduce((n, s) => n + s.modules.length, 0))

type JourneyPreviewProps = PreviewActions & { stretches: Stretch[]; badge: string }

export function JourneyPreview({ stretches, badge, ...actions }: JourneyPreviewProps) {
  const starts = startPositions(stretches)

  return (
    <section
      aria-labelledby="preview-title"
      className="flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col">
        <h2 id="preview-title" className="text-headline-sm text-on-surface">
          Como o colaborador vai ver
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Um módulo de cada vez, nesta ordem. Quem já domina um assunto pula o módulo.
        </p>
      </div>
      <div className="relative flex flex-col items-center gap-space-xl">
        <div className="absolute top-4 bottom-16 left-1/2 z-0 w-1.5 -translate-x-1/2 bg-surface-container-highest" />
        {stretches.map((stretch, index) => (
          <StretchStops
            key={stretch.key}
            stretch={stretch}
            number={index + 1}
            firstPosition={starts[index]}
            {...actions}
          />
        ))}
        <div className="z-10 flex w-full max-w-xs flex-col items-center rounded-xl bg-secondary-fixed p-space-md text-center shadow-md">
          <span className="mb-space-xs flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed shadow-md">
            <Icon name="military_tech" filled className="text-[2rem]" />
          </span>
          <span className="text-headline-sm text-on-secondary-container">Nivelado</span>
          <span className="text-body-sm text-on-secondary-fixed">{badge}</span>
        </div>
      </div>
    </section>
  )
}
