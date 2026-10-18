import { Link } from '@inertiajs/react'
import { useEffect } from 'react'
import { Icon } from '@/components/Icon'
import type { NewModuleProps } from '@/types/management'

const GENERATION_MS = 2500

export function GeneratingLessons({ lessons, onDone }: { lessons: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, GENERATION_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div role="status" className="flex flex-col items-center gap-space-md p-space-xl text-center">
      <Icon name="progress_activity" className="animate-spin text-[3rem] text-primary" />
      <span className="text-headline-sm text-on-surface">A IA está criando {lessons} lições…</span>
      <span className="text-body-sm text-on-surface-variant">
        Lendo o manual, separando os assuntos e escrevendo em linguagem simples.
      </span>
    </div>
  )
}

export function LessonsCreated({ generated }: { generated: NewModuleProps['generated'] }) {
  return (
    <div className="flex flex-col items-center gap-space-md p-space-lg text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
        <Icon name="task_alt" className="text-[2.25rem]" />
      </div>
      <span className="text-headline-md text-on-surface">{generated.lessons} lições criadas!</span>
      <span className="text-body-md text-on-surface-variant">
        Revise e aprove cada uma; depois o conteúdo fica na Biblioteca, pronto para as jornadas.
      </span>
      <Link
        href={generated.review_path}
        className="inline-flex h-12 items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container"
      >
        Revisar lições
        <Icon name="arrow_forward" className="text-[1.25rem]" />
      </Link>
    </div>
  )
}
