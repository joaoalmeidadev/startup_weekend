import { Icon } from '@/components/Icon'
import { MEDIA_FILE, type ProposalFormat, type ProposalLesson } from './proposalDraft'
import { INPUT, ProposalQuestionFields } from './ProposalQuestionFields'

const FORMATS: { value: ProposalFormat; label: string; accept: string }[] = [
  { value: 'text', label: 'Texto', accept: '' },
  { value: 'video', label: 'Vídeo', accept: 'video/*' },
  { value: 'audio', label: 'Áudio', accept: 'audio/*' },
  { value: 'image', label: 'Imagem', accept: 'image/*' },
]

type LessonProps = { lesson: ProposalLesson; number: number; onChange: (lesson: ProposalLesson) => void }

// Video, audio and image ask for a file (only its name is kept in the simulation)
function MediaFields({ lesson, number, onChange }: LessonProps) {
  const format = FORMATS.find((option) => option.value === lesson.format) ?? FORMATS[0]
  return (
    <div className="flex flex-col gap-space-xs">
      <label className="flex flex-col gap-1 text-label-md text-on-surface">
        Como você vai ensinar
        <select
          aria-label={`Formato da lição ${number}`}
          value={lesson.format}
          onChange={(e) => onChange({ ...lesson, format: e.target.value as ProposalFormat, mediaName: null })}
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

type ProposalLessonFieldsProps = LessonProps & { onRemove?: () => void }

export function ProposalLessonFields({ lesson, number, onChange, onRemove }: ProposalLessonFieldsProps) {
  return (
    <li className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md">
      <div className="flex items-center justify-between">
        <span className="text-label-md text-primary">Lição {number}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover lição ${number}`}
            className="flex size-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high"
          >
            <Icon name="delete" className="text-[1.25rem]" />
          </button>
        )}
      </div>
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
        placeholder="Explique em poucas frases, do jeito que você contaria a um colega"
        rows={3}
        value={lesson.text}
        onChange={(e) => onChange({ ...lesson, text: e.target.value })}
        className="w-full rounded-xl border-0 bg-surface-container-lowest p-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container"
      />
      <ProposalQuestionFields
        question={lesson.question}
        number={number}
        onChange={(question) => onChange({ ...lesson, question })}
      />
    </li>
  )
}
