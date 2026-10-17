import { Icon } from '@/components/Icon'
import type { Lesson } from './lessonDraft'

const STEP = 'flex items-start gap-3 rounded-xl border border-border-subtle/80 bg-surface-warm p-3.5'
const NUMBER =
  'mt-0.5 flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white'

// What the collaborator will see on the phone
export function LessonPreview({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg leading-snug font-bold text-ink">{lesson.title}</h3>
        <p className="text-sm leading-relaxed text-ink-muted">{lesson.intro}</p>
      </div>
      <ol className="flex flex-col gap-3 pt-1">
        {lesson.steps.map((step, index) => (
          <li key={index} className={STEP}>
            <div className={NUMBER}>{index + 1}</div>
            <div className="text-xs leading-relaxed text-ink">
              {step.title && (
                <strong className="mb-0.5 block text-sm font-semibold text-ink">{step.title}</strong>
              )}
              {step.body} {step.quote && <em>“{step.quote}”</em>}
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}

export function PreviewTopBar({ minutes, editing }: { minutes: number; editing: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle pb-3">
      <span className="flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-1 text-[0.6875rem] font-bold text-primary-container">
        <Icon name="timer" className="text-[0.875rem]" />
        {minutes} min de leitura
      </span>
      <span className="text-xs font-medium text-ink-muted">
        {editing ? 'Prévia no celular (editando)' : 'Prévia no celular'}
      </span>
    </div>
  )
}
