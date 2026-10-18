import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { SourceBadge } from '@/components/SourceBadge'
import type { ModuleSummary, PointsRule } from '@/types/management'
import type { JourneyStep } from './journeyEditing'
import { stepPoints } from './journeyValue'

type StepValueActions = {
  onHoursChange: (moduleId: string, hours: number) => void
  onManualPointsChange: (moduleId: string, points: number | null) => void
}

type PreviewActions = StepValueActions & {
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (module: ModuleSummary) => void
}

const CONTROL =
  'flex size-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30'

const NUMBER_INPUT =
  'w-16 rounded-md border border-outline-variant bg-surface-container-lowest px-1 py-0.5 text-center text-body-sm text-on-surface'

const hoursFrom = (input: HTMLInputElement) =>
  Number.isNaN(input.valueAsNumber) ? 0 : Math.max(0, input.valueAsNumber)

const pointsFrom = (input: HTMLInputElement) =>
  input.value === '' || Number.isNaN(input.valueAsNumber)
    ? null
    : Math.max(0, Math.round(input.valueAsNumber))

type StepValueEditorProps = StepValueActions & { step: JourneyStep; points: number }

// The hours of training a content replaces and its points; typed points override the rule
function StepValueEditor({ step, points, onHoursChange, onManualPointsChange }: StepValueEditorProps) {
  const { module } = step

  return (
    <div className="flex flex-col items-center gap-1 text-body-sm text-on-surface-variant">
      <div className="flex flex-wrap items-center justify-center gap-x-space-sm gap-y-1">
        <label className="flex items-center gap-1">
          Substitui
          <input
            type="number"
            aria-label={`Horas de treino de ${module.name}`}
            min={0}
            step={0.5}
            value={step.hours}
            onChange={(event) => onHoursChange(module.id, hoursFrom(event.target))}
            className={NUMBER_INPUT}
          />
          h
        </label>
        <span className="text-label-md text-on-surface">{points} pts</span>
        {step.manualPoints !== null && (
          <span className="rounded-full bg-secondary-fixed px-space-xs text-label-sm text-on-secondary-fixed">
            manual
          </span>
        )}
      </div>
      <label className="flex items-center gap-1">
        Pontos manuais (opcional)
        <input
          type="number"
          aria-label={`Pontos manuais de ${module.name}`}
          min={0}
          step={1}
          value={step.manualPoints ?? ''}
          onChange={(event) => onManualPointsChange(module.id, pointsFrom(event.target))}
          className={NUMBER_INPUT}
        />
      </label>
    </div>
  )
}

type PathStopProps = PreviewActions & { step: JourneyStep; rule: PointsRule; index: number; isLast: boolean }

// One content on the path, as in Minha jornada: a numbered circle with its card below
function PathStop({ step, rule, index, isLast, onMove, onRemove, ...valueActions }: PathStopProps) {
  const { module } = step

  return (
    <li className="flex w-full max-w-xs flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary-container text-headline-sm text-on-primary shadow-md">
        {index + 1}
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
        <StepValueEditor step={step} points={stepPoints(step, rule)} {...valueActions} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Subir ${module.name}`}
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className={CONTROL}
          >
            <Icon name="keyboard_arrow_up" className="text-[1.25rem]" />
          </button>
          <button
            type="button"
            aria-label={`Descer ${module.name}`}
            disabled={isLast}
            onClick={() => onMove(index, 1)}
            className={CONTROL}
          >
            <Icon name="keyboard_arrow_down" className="text-[1.25rem]" />
          </button>
          <button
            type="button"
            aria-label={`Remover ${module.name}`}
            onClick={() => onRemove(module)}
            className={`${CONTROL} hover:text-error`}
          >
            <Icon name="close" className="text-[1.25rem]" />
          </button>
        </div>
      </div>
    </li>
  )
}

function BadgeStop({ badge }: { badge: string }) {
  return (
    <div className="z-10 flex w-full max-w-xs flex-col items-center rounded-xl bg-secondary-fixed p-space-md text-center shadow-md">
      <span className="mb-space-xs flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed shadow-md">
        <Icon name="military_tech" filled className="text-[2rem]" />
      </span>
      <span className="text-headline-sm text-on-secondary-container">Selo</span>
      <span className="text-body-sm text-on-secondary-fixed">{badge}</span>
    </div>
  )
}

type JourneyPreviewProps = PreviewActions & { steps: JourneyStep[]; rule: PointsRule; badge: string }

export function JourneyPreview({ steps, rule, badge, ...actions }: JourneyPreviewProps) {
  return (
    <section
      aria-labelledby="preview-title"
      className="flex flex-col gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col">
        <h2 id="preview-title" className="text-headline-sm text-on-surface">
          Como o participante vê
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Um conteúdo de cada vez, nesta ordem. Quem já domina um assunto pula o conteúdo.
        </p>
      </div>
      <div className="relative flex flex-col items-center gap-space-md">
        <div className="absolute top-4 bottom-16 left-1/2 z-0 w-1.5 -translate-x-1/2 bg-surface-container-highest" />
        {steps.length > 0 ? (
          <ol aria-label="Paradas da jornada" className="z-10 flex w-full flex-col items-center gap-space-md">
            {steps.map((step, index) => (
              <PathStop
                key={step.module.id}
                step={step}
                rule={rule}
                index={index}
                isLast={index === steps.length - 1}
                {...actions}
              />
            ))}
          </ol>
        ) : (
          <p className="z-10 w-full max-w-xs rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-lowest p-space-md text-center text-body-sm text-on-surface-variant">
            Nenhum conteúdo ainda. Adicione da Biblioteca.
          </p>
        )}
        <BadgeStop badge={badge} />
      </div>
    </section>
  )
}
