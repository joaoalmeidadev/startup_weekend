import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { AiReview } from '@/types/management'

export function AiReviewRow({ review }: { review: AiReview }) {
  return (
    <div className="flex items-center justify-between gap-space-md rounded-xl px-space-md py-space-sm">
      <div className="flex items-center gap-space-sm">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-container">
          <Icon name="auto_awesome" className="text-[1.25rem]" />
        </span>
        <div className="flex flex-col">
          <span className="text-body-lg-bold text-on-surface">{review.name}</span>
          <span className="text-body-sm text-on-surface-variant">
            {review.lessons === 1 ? '1 lição' : `${review.lessons} lições`}
          </span>
        </div>
      </div>
      <Link
        href={review.review_path}
        className="inline-flex h-10 items-center gap-1 rounded-xl px-space-md text-label-lg text-primary ring-1 ring-primary-fixed-dim hover:bg-surface-container"
      >
        Revisar
        <Icon name="chevron_right" className="text-[1.125rem]" />
      </Link>
    </div>
  )
}
