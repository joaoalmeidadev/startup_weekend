import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { LessonReview } from '@/types/management'

type QuestionPreviewProps = { question: LessonReview['question']; others: number; locked: boolean }

export function QuestionPreview({ question, others, locked }: QuestionPreviewProps) {
  const [open, setOpen] = useState(true)
  const notify = useMockNotice()

  if (locked) {
    return (
      <div className="mt-1 flex items-center justify-between border-t border-border-subtle pt-4 opacity-90">
        <div className="flex items-center gap-2">
          <Icon name="quiz" className="text-[1.125rem] text-primary-container" />
          <span className="text-xs font-bold text-ink">Pergunta que o colaborador vai responder</span>
        </div>
        <span className="text-[0.6875rem] font-medium text-ink-muted">Mantida</span>
      </div>
    )
  }

  return (
    <div className="mt-2 flex flex-col gap-3 border-t border-border-subtle pt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="group flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Icon name="quiz" className="text-[1.125rem] text-primary-container" />
          <span className="text-xs font-bold text-ink transition-colors group-hover:text-primary-container">
            Pergunta que o colaborador vai responder
          </span>
        </div>
        <Icon
          name="expand_more"
          className={`text-[1.25rem] text-ink-muted transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-surface-muted/50 p-3.5">
          <p className="text-xs font-semibold text-ink">{question.prompt}</p>
          <ul className="space-y-2 text-xs">
            {question.options.map((option) =>
              option.correct ? (
                <li
                  key={option.text}
                  className="flex items-center justify-between rounded-lg border border-success-green/30 bg-success-bg p-2.5 font-medium text-ink"
                >
                  <span className="font-semibold text-success-green">{option.text}</span>
                  <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[0.6875rem] font-bold text-success-green">
                    <Icon name="check" className="text-[0.875rem]" /> Correta
                  </span>
                </li>
              ) : (
                <li
                  key={option.text}
                  className="flex items-center justify-between rounded-lg border border-border-subtle bg-white p-2.5 text-ink-muted"
                >
                  <span>{option.text}</span>
                </li>
              ),
            )}
          </ul>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => notify('As outras perguntas aparecem aqui em breve.')}
              className="text-[0.6875rem] font-semibold text-primary-container hover:underline"
            >
              Ver a outra pergunta ({others})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
