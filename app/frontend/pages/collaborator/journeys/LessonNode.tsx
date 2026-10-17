import { Link } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import type { Lesson } from '@/types/collaborator'

// A finished or locked stop on the path; the current one is CurrentLessonCard.
// Finished stops open the module so the person can review its lessons.
export function LessonNode({ lesson }: { lesson: Lesson }) {
  const done = lesson.status === 'done'
  const body: ReactNode = (
    <>
      <div
        className={`flex size-20 items-center justify-center rounded-full ${done ? 'bg-tertiary-container text-on-primary shadow-md' : 'bg-surface-container-highest text-on-surface-variant shadow-sm'}`}
      >
        <Icon name={done ? 'check' : 'lock'} className={done ? 'text-[2.75rem]' : 'text-[2.5rem]'} />
      </div>
      <div className="mt-space-sm rounded-lg bg-surface-container-low px-space-md py-space-xs">
        <span className={`text-headline-md ${done ? 'text-on-surface' : 'text-on-surface-variant'}`}>
          {lesson.title}
        </span>
        {done ? (
          <p className="text-body-lg font-bold text-tertiary-container">Aula Concluída ✓</p>
        ) : (
          <p className="text-body-lg text-outline">Bloqueado</p>
        )}
      </div>
    </>
  )

  return (
    <li className={`flex max-w-sm flex-col items-center text-center ${done ? '' : 'opacity-80'}`}>
      {done && lesson.module_id ? (
        <Link
          href={`/collaborator/modules/${lesson.module_id}`}
          className="flex flex-col items-center transition-transform hover:scale-[1.02]"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </li>
  )
}
