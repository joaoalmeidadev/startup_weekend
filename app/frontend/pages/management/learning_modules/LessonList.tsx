import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { LESSON_FORMATS } from '@/lib/lessonFormats'
import type { LearningModule, LessonStatus } from '@/types/management'
import { LessonPreview } from './LessonPreview'

const STATUS: Record<LessonStatus, { label: string; icon: string; className: string }> = {
  approved: { label: 'Aprovada', icon: 'check_circle', className: 'text-tertiary-container' },
  pending: { label: 'Para revisar', icon: 'rate_review', className: 'text-secondary' },
  draft: { label: 'Rascunho', icon: 'edit_note', className: 'text-on-surface-variant' },
}

type Lesson = LearningModule['lessons'][number]

// The answer key: the question, the options with the right one marked and why
function AnswerKey({ question }: { question: Lesson['question'] }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <span className="text-label-md text-on-surface">{question.prompt}</span>
      <ul className="flex flex-col gap-1">
        {question.options.map((option) => (
          <li
            key={option.text}
            className={`flex items-center justify-between gap-space-sm rounded-lg px-space-sm py-1.5 text-body-md ${option.correct ? 'bg-tertiary-fixed/50 text-on-surface' : 'text-on-surface-variant'}`}
          >
            <span>{option.text}</span>
            {option.correct && (
              <span className="inline-flex shrink-0 items-center gap-1 text-label-sm font-bold text-on-tertiary-fixed-variant">
                <Icon name="check" className="text-[1rem]" />
                Correta
              </span>
            )}
          </li>
        ))}
      </ul>
      {question.explanation && <p className="text-body-sm text-on-surface-variant">{question.explanation}</p>}
    </div>
  )
}

function Accuracy({ value }: { value: number | null }) {
  if (value === null) {
    return <p className="text-body-sm text-outline">Ainda sem respostas: a lição não foi publicada.</p>
  }
  return (
    <p className="flex items-center gap-space-xs text-label-md text-primary">
      <Icon name="insights" className="text-[1.125rem]" />
      {`${value}% da equipe acerta de primeira`}
    </p>
  )
}

function LessonItem({ lesson, reviewable }: { lesson: Lesson; reviewable: boolean }) {
  const [open, setOpen] = useState(false)
  const status = STATUS[lesson.status]
  const format = LESSON_FORMATS[lesson.format]
  const panelId = `lesson-${lesson.position}`

  return (
    <li className="rounded-xl bg-surface-container-low">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-space-md rounded-xl p-space-sm text-left transition-colors hover:bg-surface-container"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-label-md text-primary">
          {lesson.position}
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-label-lg text-on-surface">{lesson.title}</span>
          <span className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant">
            <Icon name={format.icon} className="text-[1rem]" />
            {`${format.label} · ${lesson.duration}`}
          </span>
        </span>
        <span className={`inline-flex items-center gap-1 text-label-sm font-bold ${status.className}`}>
          <Icon name={status.icon} className="text-[1rem]" />
          {status.label}
        </span>
        <Icon
          name={open ? 'expand_less' : 'expand_more'}
          className="text-[1.25rem] text-on-surface-variant"
        />
      </button>
      {open && (
        <section
          id={panelId}
          aria-label={`Lição ${lesson.position}: ${lesson.title}`}
          className="flex flex-col gap-space-sm px-space-md pb-space-md"
        >
          <LessonPreview lesson={lesson} />
          <AnswerKey question={lesson.question} />
          <Accuracy value={lesson.team_accuracy} />
          {reviewable && (
            <Link
              href={`/management/lesson_reviews/${lesson.position}`}
              className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
            >
              {`Revisar lição ${lesson.position}`}
              <Icon name="chevron_right" className="text-[1.125rem]" />
            </Link>
          )}
        </section>
      )}
    </li>
  )
}

// Each lesson opens to show what it teaches, its answer key and whether the team gets it right
export function LessonList({ module }: { module: LearningModule }) {
  const reviewable = module.review_from !== null
  return (
    <ol className="flex flex-col gap-space-xs">
      {module.lessons.map((lesson) => (
        <LessonItem key={lesson.position} lesson={lesson} reviewable={reviewable} />
      ))}
    </ol>
  )
}
