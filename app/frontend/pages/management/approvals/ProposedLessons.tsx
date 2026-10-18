import { Icon } from '@/components/Icon'
import type { SubmissionLesson } from '@/types/management'

function LessonCard({ lesson, position }: { lesson: SubmissionLesson; position: number }) {
  const titleId = `proposed-lesson-${position}`
  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md"
    >
      <h3 id={titleId} className="text-body-lg-bold text-on-surface">
        <span aria-hidden="true" className="text-on-surface-variant">
          {position}.{' '}
        </span>
        {lesson.title}
      </h3>
      <p className="text-body-md text-on-surface">{lesson.question.prompt}</p>
      <ul className="flex flex-col gap-space-xs">
        {lesson.question.options.map((option) => (
          <li
            key={option.text}
            className={`flex items-center justify-between gap-space-sm rounded-lg px-space-md py-space-xs text-body-md ${
              option.correct
                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                : 'bg-surface-container-lowest'
            }`}
          >
            <span>{option.text}</span>
            {option.correct && (
              <span className="inline-flex items-center gap-1 text-label-sm font-bold">
                <Icon name="check_circle" className="text-[1rem]" />
                Correta
              </span>
            )}
          </li>
        ))}
      </ul>
    </article>
  )
}

export function ProposedLessons({ lessons }: { lessons: SubmissionLesson[] }) {
  return (
    <div className="flex flex-col gap-space-md">
      {lessons.map((lesson, index) => (
        <LessonCard key={lesson.title} lesson={lesson} position={index + 1} />
      ))}
    </div>
  )
}
