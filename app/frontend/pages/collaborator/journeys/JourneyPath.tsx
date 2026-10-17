import { Icon } from '@/components/Icon'
import type { Journey } from '@/types/collaborator'
import { CurrentLessonCard } from './CurrentLessonCard'
import { LessonNode } from './LessonNode'

type JourneyPathProps = Pick<Journey, 'sections' | 'badge'>

// Vertical path: sections (Base, Empresa, Setor) with their lessons, ending in the badge
export function JourneyPath({ sections, badge }: JourneyPathProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="absolute top-10 bottom-24 left-1/2 z-0 w-2 -translate-x-1/2 bg-surface-container-highest" />
      {sections.map((section, index) => {
        const upcoming = section.lessons.every((lesson) => lesson.status === 'locked')
        return (
          <section
            key={section.title}
            className="z-10 mb-space-xl flex w-full flex-col items-center gap-space-lg"
          >
            <h3 className="rounded-full bg-surface-container px-space-md py-space-xs text-center shadow-sm">
              <span
                className={`text-headline-md ${upcoming && index > 0 ? 'text-on-surface-variant' : 'text-on-surface'}`}
              >
                {section.title}
              </span>
            </h3>
            <ol className="flex w-full flex-col items-center gap-space-lg">
              {section.lessons.map((lesson) =>
                lesson.status === 'current' ? (
                  <CurrentLessonCard key={lesson.title} lesson={lesson} />
                ) : (
                  <LessonNode key={lesson.title} lesson={lesson} />
                ),
              )}
            </ol>
          </section>
        )
      })}
      <div className="z-10 flex w-full max-w-md flex-col items-center rounded-xl bg-secondary-fixed p-space-lg text-center shadow-md">
        <div className="mb-space-sm flex size-24 items-center justify-center rounded-full bg-secondary-container text-on-secondary-fixed shadow-lg">
          <Icon name="military_tech" filled className="text-[3.5rem]" />
        </div>
        <span className="text-headline-lg text-on-secondary-container">{badge.title}</span>
        <p className="mt-space-xs text-body-xl text-on-secondary-fixed">{badge.description}</p>
      </div>
    </div>
  )
}
