import { Head, Link, router, usePage } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import { PrimaryButton } from '@/components/PrimaryButton'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { CollaboratorModule, LessonStatus } from '@/types/collaborator'

const STATUS: Record<LessonStatus, { icon: string; circle: string; text: string }> = {
  done: { icon: 'check', circle: 'bg-tertiary-container text-on-primary', text: 'text-on-surface' },
  current: {
    icon: 'play_arrow',
    circle: 'bg-primary-container text-on-primary ring-4 ring-primary-container/20',
    text: 'text-on-surface font-bold',
  },
  locked: {
    icon: 'lock',
    circle: 'bg-surface-container-highest text-on-surface-variant',
    text: 'text-outline',
  },
}

export default function CollaboratorModuleShow() {
  const { learning_module: module } = usePage<{ learning_module: CollaboratorModule }>().props
  const total = module.lessons.length

  return (
    <CollaboratorLayout>
      <Head title={module.name} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-space-lg py-space-lg">
        <Link
          href="/collaborator/journey"
          className="inline-flex w-fit items-center gap-1 text-label-lg text-primary"
        >
          <Icon name="arrow_back" className="text-[1.5rem]" />
          Minha jornada
        </Link>
        <section className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-md">
          <h1 className="text-headline-lg text-on-surface">{module.name}</h1>
          <span className="text-body-lg text-on-surface-variant">
            {module.done} de {total} lições · uns 5 minutos cada
          </span>
          <div
            className="h-3 overflow-hidden rounded-full bg-surface-container-high"
            role="progressbar"
            aria-valuenow={module.done}
            aria-valuemax={total}
          >
            <div
              className="h-full rounded-full bg-tertiary-container"
              style={{ width: `${(module.done / total) * 100}%` }}
            />
          </div>
        </section>
        <ol className="flex flex-col gap-space-sm">
          {module.lessons.map((lesson, index) => {
            const style = STATUS[lesson.status]
            return (
              <li
                key={lesson.title}
                className="flex min-h-[4rem] items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full ${style.circle}`}
                >
                  <Icon name={style.icon} className="text-[1.5rem]" />
                </span>
                <span className={`text-body-lg ${style.text}`}>
                  {index + 1}. {lesson.title}
                </span>
              </li>
            )
          })}
        </ol>
        {module.continue_path && (
          <PrimaryButton onClick={() => router.visit(module.continue_path as string)}>
            Continuar lição
          </PrimaryButton>
        )}
      </div>
    </CollaboratorLayout>
  )
}
