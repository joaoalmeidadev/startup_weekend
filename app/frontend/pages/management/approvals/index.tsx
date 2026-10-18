import { Head, usePage } from '@inertiajs/react'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { ApprovalsProps } from '@/types/management'
import { AiReviewRow } from './AiReviewRow'
import { ApprovalSection } from './ApprovalSection'
import { ProposalRow } from './ProposalRow'

export default function ApprovalsIndex() {
  const { submissions, ai_reviews } = usePage<ApprovalsProps>().props

  return (
    <ManagementLayout>
      <Head title="Aprovações" />
      <div className="flex w-full flex-col gap-space-lg pt-space-md">
        <section className="flex flex-col">
          <h1 className="text-headline-xl tracking-tight text-on-surface">Aprovações</h1>
          <p className="text-body-md text-on-surface-variant">
            O que a equipe enviou e espera a sua decisão.
          </p>
        </section>
        <ApprovalSection id="team-proposals" title="Jornadas enviadas pela equipe">
          <div className="flex flex-col divide-y divide-surface-container">
            {submissions.map((submission) => (
              <ProposalRow key={submission.id} submission={submission} />
            ))}
          </div>
        </ApprovalSection>
        <ApprovalSection id="ai-reviews" title="Lições da IA para revisar">
          {ai_reviews.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">Nenhuma lição da IA esperando revisão.</p>
          ) : (
            ai_reviews.map((review) => <AiReviewRow key={review.name} review={review} />)
          )}
        </ApprovalSection>
      </div>
    </ManagementLayout>
  )
}
