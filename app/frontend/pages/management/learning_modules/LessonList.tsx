import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { LearningModule, LessonStatus } from '@/types/management'

const STATUS: Record<LessonStatus, { label: string; icon: string; className: string }> = {
  approved: { label: 'Aprovada', icon: 'check_circle', className: 'text-tertiary-container' },
  pending: { label: 'Para revisar', icon: 'rate_review', className: 'text-secondary' },
  draft: { label: 'Rascunho', icon: 'edit_note', className: 'text-on-surface-variant' },
}

type Lesson = LearningModule['lessons'][number]

function LessonRow({ lesson, reviewable }: { lesson: Lesson; reviewable: boolean }) {
  const status = STATUS[lesson.status]
  const content = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-label-md text-primary">
        {lesson.position}
      </span>
      <span className="flex-1 text-label-lg text-on-surface">{lesson.title}</span>
      <span className={`inline-flex items-center gap-1 text-label-sm font-bold ${status.className}`}>
        <Icon name={status.icon} className="text-[1rem]" />
        {status.label}
      </span>
      {reviewable && <Icon name="chevron_right" className="text-[1.25rem] text-on-surface-variant" />}
    </>
  )
  const row = 'flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-sm'

  return (
    <li>
      {reviewable ? (
        <Link
          href={`/management/lesson_reviews/${lesson.position}`}
          className={`${row} transition-colors hover:bg-surface-container`}
        >
          {content}
        </Link>
      ) : (
        <div className={row}>{content}</div>
      )}
    </li>
  )
}

// Lessons of a module under review open the review screen; published or draft modules only list them
export function LessonList({ module }: { module: LearningModule }) {
  const reviewable = module.review_from !== null
  return (
    <ol className="flex flex-col gap-space-xs">
      {module.lessons.map((lesson) => (
        <LessonRow key={lesson.position} lesson={lesson} reviewable={reviewable} />
      ))}
    </ol>
  )
}
