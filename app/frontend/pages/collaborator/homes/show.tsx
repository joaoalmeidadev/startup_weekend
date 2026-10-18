import { Head, usePage } from '@inertiajs/react'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { Learner, Viewer } from '@/types/collaborator'
import { BadgeGrid } from './BadgeGrid'
import { JourneyList } from './JourneyList'
import { NextStepCard } from './NextStepCard'
import { PointsCard } from './PointsCard'

type HomePageProps = { learner: Learner; viewer: Viewer }

export default function HomesShow() {
  const { learner, viewer } = usePage<HomePageProps>().props

  return (
    <CollaboratorLayout>
      <Head title="Início" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-space-lg py-space-lg">
        <h1 className="text-headline-md text-on-surface">Olá, {viewer.first_name}!</h1>
        <PointsCard points={learner.points} streakDays={learner.streak_days} />
        {learner.next_step && <NextStepCard step={learner.next_step} />}
        <JourneyList journeys={learner.journeys} />
        <BadgeGrid badges={learner.badges} />
      </div>
    </CollaboratorLayout>
  )
}
