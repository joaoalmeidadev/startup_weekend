import { Icon } from '@/components/Icon'
import {
  emptyLesson,
  MEDIA_FILE,
  type DraftFormat,
  type DraftLesson,
  type LessonQuestion,
} from './contentDraft'

const INPUT =
  'h-11 w-full rounded-xl border-0 bg-surface-container-lowest px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

const LETTERS = ['A', 'B', 'C'] as const

type QuestionFieldsProps = {
  question: LessonQuestion
  number: number
  onChange: (question: LessonQuestion) => void
}

// The answer key: one question, three options and the right one; the explanation shows when the person gets it wrong
function QuestionFields({ question, number, onChange }: QuestionFieldsProps) {
  const setOption = (index: number, text: string) =>
    onChange({
      ...question,
      options: question.options.map((option, i) =>
        i === index ? text : option,
      ) as LessonQuestion['options'],
    })

  return (
    <fieldset className="flex flex-col gap-space-xs rounded-xl border border-surface-container-high p-space-sm">
      <legend className="px-1 text-label-md text-on-surface">Pergunta para conferir se entendeu</legend>
      <input
        aria-label={`Pergunta da lição ${number}`}
        placeholder="Ex.: O cliente quer trocar após 10 dias. O que fazer?"
        value={question.prompt}
        onChange={(e) => onChange({ ...question, prompt: e.target.value })}
        className={INPUT}
      />
      {LETTERS.map((letter, index) => (
        <div key={letter} className="flex items-center gap-space-sm">
          <input
            type="radio"
            name={`correct-${number}`}
            aria-label={`Correta: alternativa ${letter} da lição ${number}`}
            checked={question.correct === index}
            onChange={() => onChange({ ...question, correct: index as LessonQuestion['correct'] })}
            className="size-5 shrink-0 text-primary-container"
          />
          <input
            aria-label={`Alternativa ${letter} da lição ${number}`}
            placeholder={`Alternativa ${letter}`}
            value={question.options[index]}
            onChange={(e) => setOption(index, e.target.value)}
            className={INPUT}
          />
        </div>
      ))}
      <span className="text-body-sm text-on-surface-variant">Marque a bolinha da alternativa correta.</span>
      <input
        aria-label={`Explicação ao errar (opcional) da lição ${number}`}
        placeholder="Explicação ao errar (opcional)"
        value={question.explanation}
        onChange={(e) => onChange({ ...question, explanation: e.target.value })}
        className={INPUT}
      />
    </fieldset>
  )
}

const FORMATS: { value: DraftFormat; label: string; accept: string }[] = [
  { value: 'text', label: 'Texto', accept: '' },
  { value: 'video', label: 'Vídeo', accept: 'video/*' },
  { value: 'audio', label: 'Áudio', accept: 'audio/*' },
  { value: 'image', label: 'Imagem', accept: 'image/*' },
]

type MediaFieldsProps = { lesson: DraftLesson; number: number; onChange: (lesson: DraftLesson) => void }

// How the lesson is taught; video, audio and image ask for the file (only its name is kept in the simulation)
function MediaFields({ lesson, number, onChange }: MediaFieldsProps) {
  const format = FORMATS.find((option) => option.value === lesson.format) ?? FORMATS[0]
  return (
    <div className="flex flex-col gap-space-xs">
      <label className="flex flex-col gap-1 text-label-md text-on-surface">
        Formato da lição
        <select
          aria-label={`Formato da lição ${number}`}
          value={lesson.format}
          onChange={(e) => onChange({ ...lesson, format: e.target.value as DraftFormat, mediaName: null })}
          className={INPUT}
        >
          {FORMATS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {lesson.format !== 'text' && (
        <label className="flex cursor-pointer items-center gap-space-sm rounded-xl border-2 border-dashed border-primary-fixed-dim bg-surface-container-lowest p-space-sm hover:bg-surface-container">
          <Icon name="upload_file" className="text-[1.5rem] text-primary" />
          <span className="text-label-md text-on-surface">
            {lesson.mediaName ?? `Enviar ${MEDIA_FILE[lesson.format]}`}
          </span>
          <input
            type="file"
            accept={format.accept}
            className="sr-only"
            aria-label={`Enviar ${MEDIA_FILE[lesson.format]} da lição ${number}`}
            onChange={(e) => onChange({ ...lesson, mediaName: e.target.files?.[0]?.name ?? null })}
          />
        </label>
      )}
    </div>
  )
}

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
      <MediaFields lesson={lesson} number={number} onChange={onChange} />
      <textarea
        aria-label={`Texto da lição ${number}`}
        placeholder="Explique em 3 frases simples"
        rows={3}
        value={lesson.text}
        onChange={(e) => onChange({ ...lesson, text: e.target.value })}
        className="w-full rounded-xl border-0 bg-surface-container-lowest p-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
      />
      <QuestionFields
        question={lesson.question}
        number={number}
        onChange={(question) => onChange({ ...lesson, question })}
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
