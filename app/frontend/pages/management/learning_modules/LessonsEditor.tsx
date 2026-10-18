import { Icon } from '@/components/Icon'
import { emptyLesson, type DraftLesson } from './contentDraft'

const INPUT =
  'h-11 w-full rounded-xl border-0 bg-surface-container-lowest px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

type LessonFieldsProps = { lesson: DraftLesson; number: number; onChange: (lesson: DraftLesson) => void }

function LessonFields({ lesson, number, onChange }: LessonFieldsProps) {
  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md">
      <span className="text-label-md text-primary">Lição {number}</span>
      <input
        aria-label={`Título da lição ${number}`}
        placeholder="Título curto"
        value={lesson.title}
        onChange={(e) => onChange({ ...lesson, title: e.target.value })}
        className={INPUT}
      />
      <textarea
        aria-label={`Texto da lição ${number}`}
        placeholder="Explique em 3 frases simples"
        rows={3}
        value={lesson.text}
        onChange={(e) => onChange({ ...lesson, text: e.target.value })}
        className="w-full rounded-xl border-0 bg-surface-container-lowest p-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
      />
    </li>
  )
}

type LessonsEditorProps = { lessons: DraftLesson[]; onChange: (lessons: DraftLesson[]) => void }

export function LessonsEditor({ lessons, onChange }: LessonsEditorProps) {
  const update = (index: number, lesson: DraftLesson) =>
    onChange(lessons.map((current, i) => (i === index ? lesson : current)))

  return (
    <div className="flex flex-col gap-space-sm">
      <ol className="flex flex-col gap-space-sm">
        {lessons.map((lesson, index) => (
          <LessonFields key={index} lesson={lesson} number={index + 1} onChange={(l) => update(index, l)} />
        ))}
      </ol>
      <button
        type="button"
        onClick={() => onChange([...lessons, emptyLesson()])}
        className="inline-flex h-11 w-fit items-center gap-space-xs rounded-xl bg-surface-container px-space-md text-label-md text-primary hover:bg-surface-container-high"
      >
        <Icon name="add" className="text-[1.125rem]" />
        Adicionar lição
      </button>
    </div>
  )
}
