import type { ReactNode } from 'react'
import { useState } from 'react'
import { Icon } from '@/components/Icon'
import type { KnowledgeSubmission } from '@/types/management'
import { firstName, pointsFormula } from './submissionText'

type Props = {
  submission: KnowledgeSubmission
  rewardShare: number
  // Set once approved: the card then only tells the points awarded
  awardedPoints: number | null
  children: (points: number | null) => ReactNode
}

// Points come from the hours the author informed × their own hour × the company share; the admin has the last word
export function PointsDecision({ submission, rewardShare, awardedPoints, children }: Props) {
  const [typed, setTyped] = useState(String(submission.suggested_points))
  const points = typed.trim() === '' || Number(typed) < 0 ? null : Math.round(Number(typed))
  const formula = pointsFormula({
    hours: submission.hours,
    hourly: submission.author.hourly,
    share: rewardShare,
    points: submission.suggested_points,
  })

  return (
    <section
      aria-labelledby="points-decision"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id="points-decision" className="text-headline-sm text-on-surface">
        Pontos para {firstName(submission.author.name)}
      </h2>
      <div className="flex flex-col gap-1">
        <span className="text-label-md text-on-surface-variant">Sugestão</span>
        <span className="inline-flex items-center gap-space-xs text-body-lg-bold text-primary">
          <Icon name="calculate" className="text-[1.25rem]" />
          {formula}
        </span>
      </div>
      {awardedPoints === null ? (
        <label className="flex w-fit flex-col gap-space-xs">
          <span className="text-label-lg text-on-surface">Pontos</span>
          <input
            type="number"
            min={0}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            className="h-12 w-32 rounded-xl bg-surface-container-low px-space-md text-body-lg-bold text-on-surface ring-1 ring-outline-variant focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </label>
      ) : (
        <p className="text-body-md text-on-surface">Decisão tomada: {awardedPoints} pts.</p>
      )}
      <p className="text-body-sm text-on-surface-variant">
        É a mesma conta do estudo: as horas informadas, pelo salário de quem enviou.
      </p>
      {awardedPoints === null && children(points)}
    </section>
  )
}
