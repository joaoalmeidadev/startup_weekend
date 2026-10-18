import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { WizardSteps } from '@/components/WizardSteps'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { LessonReview } from '@/types/management'
import { EditingBanner, LessonEditor } from './LessonEditor'
import { LessonPreview, PreviewTopBar } from './LessonPreview'
import { ManualExcerpt } from './ManualExcerpt'
import { QuestionPreview } from './QuestionPreview'
import { DiscardConfirmBar, EditingFooter, ReviewFooter } from './ReviewFooter'
import { ReviewHeader, TaskBanner } from './ReviewHeader'
import { applyDraft, toDraft, type LessonDraft } from './lessonDraft'

const NEXT_LESSON_DELAY_MS = 900
const REVIEW_STEP = 2

// Approving and editing are local until lessons are persisted; approving walks to the next mock lesson
function LessonReviewScreen({ review }: { review: LessonReview }) {
  const notify = useMockNotice()
  const [lesson, setLesson] = useState(review.lesson)
  const [draft, setDraft] = useState<LessonDraft | null>(null)
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)

  const approve = () => {
    const next = review.final ? review.done_path : `/management/lesson_reviews/${review.position + 1}`
    notify(
      review.final
        ? `"${review.module_name}" aprovado e salvo na Biblioteca (simulação).`
        : `Lição ${review.position} aprovada! Carregando a lição ${review.position + 1}...`,
    )
    setTimeout(() => router.visit(next), NEXT_LESSON_DELAY_MS)
  }
  const saveDraft = () => {
    if (draft) setLesson(applyDraft(lesson, draft))
    setDraft(null)
  }
  const discard = () => {
    setConfirmingDiscard(false)
    notify('A IA está reprocessando a lição a partir do manual...')
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pt-4 pb-32">
        <WizardSteps current={REVIEW_STEP} />
        <ReviewHeader review={review} />
        <TaskBanner final={review.final} />
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <ManualExcerpt manual={review.manual} />
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Icon name="smartphone" className="text-[1.25rem] text-primary-container" />
              <h2 className="text-base font-bold text-ink">Como o colaborador vai ver?</h2>
            </div>
            <div className="flex min-h-[23.75rem] flex-col gap-5 rounded-2xl border-2 border-primary-container/20 bg-white p-6 shadow-sm">
              {draft && <EditingBanner />}
              <PreviewTopBar minutes={lesson.minutes} editing={Boolean(draft)} />
              {draft ? (
                <LessonEditor
                  draft={draft}
                  onChange={setDraft}
                  onCancel={() => setDraft(null)}
                  onSave={saveDraft}
                />
              ) : (
                <LessonPreview lesson={lesson} />
              )}
              <QuestionPreview
                question={review.question}
                others={review.other_questions}
                locked={Boolean(draft)}
              />
            </div>
          </section>
        </div>
      </div>

      {confirmingDiscard && (
        <DiscardConfirmBar onCancel={() => setConfirmingDiscard(false)} onConfirm={discard} />
      )}
      {draft ? (
        <EditingFooter
          onCancel={() => setDraft(null)}
          onSave={saveDraft}
          onSaveAndApprove={() => {
            saveDraft()
            approve()
          }}
        />
      ) : (
        <ReviewFooter
          total={review.total}
          final={review.final}
          onDiscard={() => setConfirmingDiscard(true)}
          onEdit={() => setDraft(toDraft(lesson))}
          onApprove={approve}
        />
      )}
    </>
  )
}

export default function LessonReviewsShow() {
  const { lesson_review: review } = usePage<{ lesson_review: LessonReview }>().props

  return (
    <ManagementLayout>
      <Head title={`Revisar lição ${review.position}`} />
      <LessonReviewScreen key={review.position} review={review} />
    </ManagementLayout>
  )
}
