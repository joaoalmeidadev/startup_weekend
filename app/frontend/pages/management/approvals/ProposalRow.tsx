import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { KnowledgeSubmission } from '@/types/management'
import { PersonAvatar } from '../people/PersonAvatar'
import { SubmissionStatusChip } from './SubmissionStatusChip'
import { hoursText } from './submissionText'

export function ProposalRow({ submission }: { submission: KnowledgeSubmission }) {
  const { author } = submission
  return (
    <Link
      href={`/management/approvals/${submission.id}`}
      className="flex flex-col gap-space-sm rounded-xl px-space-md py-space-sm transition-colors hover:bg-surface-container md:flex-row md:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-space-sm">
        <PersonAvatar person={author} />
        <div className="flex min-w-0 flex-col">
          <span className="text-body-lg-bold text-on-surface">{submission.title}</span>
          <span className="text-body-sm text-on-surface-variant">
            <span>{author.name}</span> · <span>{author.sector}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-space-sm text-body-sm text-on-surface-variant">
        <span>{hoursText(submission.hours)}</span>
        <span>Enviada em {submission.sent_on}</span>
        <SubmissionStatusChip status={submission.status} points={submission.awarded_points} />
        <Icon name="chevron_right" className="hidden text-[1.25rem] md:inline" />
      </div>
    </Link>
  )
}
