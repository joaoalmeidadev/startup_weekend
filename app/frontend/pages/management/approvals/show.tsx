import { Head, Link, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import { ManagementLayout } from '@/layouts/ManagementLayout'
import type { ApprovalProps, SubmissionStatus } from '@/types/management'
import { ChangesRequestForm } from './ChangesRequestForm'
import { PointsDecision } from './PointsDecision'
import { ProposalHeader } from './ProposalHeader'
import { ProposedLessons } from './ProposedLessons'
import { firstName } from './submissionText'

const PRIMARY =
  'inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-primary px-space-lg text-label-lg text-on-primary shadow-md hover:bg-primary-container disabled:opacity-50'
const SECONDARY =
  'inline-flex h-12 items-center justify-center gap-space-sm rounded-xl bg-surface-container-lowest px-space-lg text-label-lg text-primary shadow-sm ring-1 ring-primary-fixed-dim hover:bg-surface-container'

function ApprovalScreen({ submission, reward_share }: ApprovalProps) {
  const notify = useMockNotice()
  const [status, setStatus] = useState<SubmissionStatus>(submission.status)
  const [awarded, setAwarded] = useState(submission.status === 'approved' ? submission.awarded_points : null)
  const [askingChanges, setAskingChanges] = useState(false)
  const author = submission.author

  const approve = (points: number) => {
    setStatus('approved')
    setAwarded(points)
    setAskingChanges(false)
    notify(`Aprovada: ${author.name} ganhou ${points} pts e a jornada foi criada como rascunho (simulação).`)
  }

  const requestChanges = () => {
    setStatus('changes_requested')
    setAskingChanges(false)
    notify(`Pedido de ajuste enviado para ${firstName(author.name)} (simulação).`)
  }

  return (
    <div className="flex w-full flex-col gap-space-lg pt-space-md">
      <Link
        href="/management/approvals"
        aria-label="Voltar para Aprovações"
        className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
      >
        <Icon name="chevron_left" className="text-[1.125rem]" />
        Aprovações
      </Link>
      <ProposalHeader submission={submission} status={status} points={awarded} />
      <div className="grid grid-cols-1 gap-space-md xl:grid-cols-[3fr_2fr] xl:items-start">
        <section
          aria-labelledby="proposed-lessons"
          className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
        >
          <h2 id="proposed-lessons" className="text-headline-sm text-on-surface">
            Lições propostas
          </h2>
          <ProposedLessons lessons={submission.lessons} />
        </section>
        <PointsDecision submission={submission} rewardShare={reward_share} awardedPoints={awarded}>
          {(points) => (
            <div className="flex flex-col gap-space-md">
              <div className="flex flex-wrap gap-space-sm">
                <button
                  type="button"
                  disabled={points === null}
                  onClick={() => points !== null && approve(points)}
                  className={PRIMARY}
                >
                  <Icon name="check" className="text-[1.25rem]" />
                  Aprovar e criar a jornada
                </button>
                <button type="button" onClick={() => setAskingChanges(true)} className={SECONDARY}>
                  <Icon name="edit_note" className="text-[1.25rem]" />
                  Pedir ajuste
                </button>
              </div>
              {askingChanges && <ChangesRequestForm onSend={requestChanges} />}
            </div>
          )}
        </PointsDecision>
      </div>
    </div>
  )
}

export default function ApprovalsShow() {
  const props = usePage<ApprovalProps>().props
  return (
    <ManagementLayout>
      <Head title={props.submission.title} />
      <ApprovalScreen {...props} />
    </ManagementLayout>
  )
}
