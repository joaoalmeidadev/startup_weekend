import { Icon } from '@/components/Icon'
import type { LessonDraft } from './lessonDraft'

type LessonEditorProps = {
  draft: LessonDraft
  onChange: (draft: LessonDraft) => void
  onCancel: () => void
  onSave: () => void
}

const FIELD =
  'w-full rounded-xl bg-white text-ink shadow-2xs ring-2 ring-primary-container/20 transition-all focus:outline-none'
const LABEL = 'flex items-center justify-between text-xs font-bold text-ink'

export function EditingBanner() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-primary-container/20 bg-primary-container/10 px-3.5 py-2.5 text-xs text-primary-container">
      <div className="flex items-center gap-2 font-semibold">
        <Icon name="edit_note" className="text-[1.125rem]" />
        <span>Modo de edição ativado: faça os ajustes diretamente no texto abaixo</span>
      </div>
      <span className="rounded bg-white px-2 py-0.5 text-[0.6875rem] font-medium text-ink-muted">
        Edição manual
      </span>
    </div>
  )
}

export function LessonEditor({ draft, onChange, onCancel, onSave }: LessonEditorProps) {
  const setStep = (index: number, text: string) =>
    onChange({ ...draft, steps: draft.steps.map((step, i) => (i === index ? text : step)) })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lesson-title" className={LABEL}>
          <span>Título da lição</span>
          <span className="text-[0.6875rem] font-normal text-ink-muted">Visível ao colaborador</span>
        </label>
        <input
          id="lesson-title"
          type="text"
          value={draft.title}
          onChange={(event) => onChange({ ...draft, title: event.target.value })}
          className={`${FIELD} border-2 border-primary-container px-3.5 py-2.5 text-base font-bold`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lesson-intro" className={LABEL}>
          <span>Texto explicativo inicial</span>
          <span className="text-[0.6875rem] font-normal text-ink-muted">2 a 3 linhas</span>
        </label>
        <textarea
          id="lesson-intro"
          rows={3}
          value={draft.intro}
          onChange={(event) => onChange({ ...draft, intro: event.target.value })}
          className={`${FIELD} border border-border-subtle p-3 text-sm leading-relaxed focus:border-primary-container`}
        />
      </div>
      <span className="text-xs font-bold text-ink">Passo a passo prático</span>
      {draft.steps.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-xl border border-border-subtle/80 bg-surface-warm p-3"
        >
          <div className="mt-2 flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-white">
            {index + 1}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor={`lesson-step-${index}`} className="text-[0.6875rem] font-semibold text-ink-muted">
              Passo {index + 1}
            </label>
            <input
              id={`lesson-step-${index}`}
              type="text"
              value={step}
              onChange={(event) => setStep(index, event.target.value)}
              className={`${FIELD} rounded-lg border border-border-subtle px-3 py-2 text-xs font-medium focus:border-primary-container`}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 border-t border-border-subtle pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface-muted"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-xl bg-primary-container px-5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-dark"
        >
          <Icon name="save" className="text-[1rem]" />
          <span>Salvar correção</span>
        </button>
      </div>
    </div>
  )
}
