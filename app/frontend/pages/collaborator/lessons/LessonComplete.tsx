import { router } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import type { MicroLesson } from '@/types/collaborator'

export function LessonComplete({ lesson }: { lesson: MicroLesson }) {
  return (
    <div className="flex flex-col items-center gap-space-lg pt-space-xl text-center">
      <span className="rounded-full bg-secondary-fixed px-space-md py-space-xs text-headline-md text-on-secondary-container">
        +{lesson.points} pontos
      </span>
      <div className="flex size-32 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed shadow-lg">
        <Icon name="military_tech" filled className="text-[4.5rem]" />
      </div>
      <div className="flex flex-col gap-space-xs">
        <h1 className="text-headline-xl text-on-surface">Parabéns!</h1>
        <p className="text-body-xl text-on-surface-variant">
          Você concluiu <strong>{lesson.module_name}</strong> e ganhou o selo deste módulo.
        </p>
      </div>
      <PrimaryButton onClick={() => router.visit('/collaborator/journeys')}>
        Voltar para a jornada
      </PrimaryButton>
    </div>
  )
}
