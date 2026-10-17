import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { Lesson } from '@/types/collaborator'

export const CURRENT_LESSON_ID = 'aula-atual'

export function CurrentLessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <li
      id={CURRENT_LESSON_ID}
      className="relative my-space-sm flex w-full max-w-md scroll-mt-28 flex-col items-center rounded-xl bg-surface-container-high p-space-lg text-center shadow-lg"
    >
      <div className="relative mb-space-sm flex items-center justify-center">
        <span className="absolute size-28 animate-ping rounded-full bg-primary-container opacity-40" />
        <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-xl">
          <Icon name="play_arrow" className="text-[3.25rem]" />
        </div>
      </div>
      <span className="mb-space-xs rounded-full bg-primary px-space-md py-space-xs text-label-md tracking-wider text-on-primary uppercase">
        Você está aqui
      </span>
      <span className="text-headline-lg text-on-surface">{lesson.title}</span>
      <p className="mb-space-md text-body-xl text-on-surface-variant">{lesson.description}</p>
      <Link
        href={`/collaborator/lessons/${lesson.id}`}
        className="flex h-16 w-full items-center justify-center gap-space-sm rounded-xl bg-primary-container text-headline-md text-on-primary shadow-md transition-colors hover:bg-primary"
      >
        <Icon name="play_circle" className="text-[1.75rem]" />
        <span>Continuar aula ({lesson.minutes} min)</span>
      </Link>
      {lesson.module_id && (
        <Link
          href={`/collaborator/modules/${lesson.module_id}`}
          className="mt-space-sm text-label-md text-primary underline"
        >
          Ver todas as lições do módulo
        </Link>
      )}
    </li>
  )
}
