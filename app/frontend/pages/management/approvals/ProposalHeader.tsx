import { Icon } from '@/components/Icon'
import type { KnowledgeSubmission, SubmissionStatus } from '@/types/management'
import { PersonAvatar } from '../people/PersonAvatar'
import { SubmissionStatusChip } from './SubmissionStatusChip'
import { hoursText } from './submissionText'

type Props = { submission: KnowledgeSubmission; status: SubmissionStatus; points: number | null }

export function ProposalHeader({ submission, status, points }: Props) {
  const { author } = submission
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-start">
        <h1 className="text-headline-lg text-on-surface">{submission.title}</h1>
        <SubmissionStatusChip status={status} points={points} />
      </div>
      <div className="flex flex-wrap items-center gap-space-md">
        <div className="flex items-center gap-space-sm">
          <PersonAvatar person={author} />
          <div className="flex flex-col">
            <span className="text-body-lg-bold text-on-surface">{author.name}</span>
            <span className="text-body-sm text-on-surface-variant">{author.sector}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-body-md text-on-surface-variant">
          <Icon name="calendar_today" className="text-[1.125rem]" />
          <span>Enviada em {submission.sent_on}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-body-md text-on-surface-variant">
          <Icon name="schedule" className="text-[1.125rem]" />
          <span>{hoursText(submission.hours)}</span>
        </span>
      </div>
    </section>
  )
}
