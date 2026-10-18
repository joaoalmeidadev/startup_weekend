import { FileDropzone, SAMPLE_FILE } from './FileDropzone'
import { FIELD, FormBlock } from './FormBlock'
import { LessonsEditor } from './LessonsEditor'
import { withMaterial, type ContentDraft, type Material } from './contentDraft'

const SAMPLE_NAME = 'Rotinas de atendimento'
const SAMPLE_COMPETENCY = 'Rotinas'
const MATERIALS: { value: Material; label: string }[] = [
  { value: 'file', label: 'Enviar arquivo' },
  { value: 'lessons', label: 'Escrever as lições' },
]

type BlockProps = { draft: ContentDraft; onChange: (draft: ContentDraft) => void }

function MaterialChoice({ draft, onChange }: BlockProps) {
  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="mb-space-xs text-label-lg text-on-surface">Material</legend>
      <div className="flex flex-wrap gap-space-md">
        {MATERIALS.map(({ value, label }) => (
          <label key={value} className="flex cursor-pointer items-center gap-space-xs">
            <input
              type="radio"
              name="material"
              checked={draft.material === value}
              onChange={() => onChange(withMaterial(draft, value))}
              className="size-5 text-primary-container focus:ring-primary-container"
            />
            <span className="text-body-md text-on-surface">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// What the content is: its name and the material it is made of
export function ContentBlock({ draft, onChange }: BlockProps) {
  const pickSample = () =>
    onChange({
      ...draft,
      fileName: SAMPLE_FILE,
      name: draft.name.trim() ? draft.name : SAMPLE_NAME,
      competency: draft.competency || SAMPLE_COMPETENCY,
    })

  return (
    <FormBlock id="content-block" title="Conteúdo">
      <div className="flex flex-col gap-space-xs">
        <label htmlFor="content-name" className="text-label-lg text-on-surface">
          Nome do conteúdo
        </label>
        <input
          id="content-name"
          type="text"
          value={draft.name}
          placeholder="Ex.: Rotinas de atendimento"
          onChange={(event) => onChange({ ...draft, name: event.target.value })}
          className={FIELD}
        />
      </div>
      <MaterialChoice draft={draft} onChange={onChange} />
      {draft.material === 'file' ? (
        <FileDropzone
          fileName={draft.fileName}
          onPick={(fileName) => onChange({ ...draft, fileName })}
          onSample={pickSample}
        />
      ) : (
        <LessonsEditor lessons={draft.lessons} onChange={(lessons) => onChange({ ...draft, lessons })} />
      )}
    </FormBlock>
  )
}
