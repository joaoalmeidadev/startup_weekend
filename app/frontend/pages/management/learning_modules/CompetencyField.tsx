import type { CompetencyGroup } from '@/types/management'
import { FIELD } from './FormBlock'
import { isSingleWord, NEW_COMPETENCY, type ContentDraft } from './contentDraft'

type CompetencyFieldProps = {
  draft: ContentDraft
  groups: CompetencyGroup[]
  onChange: (draft: ContentDraft) => void
}

function NewCompetencyInput({ draft, onChange }: Omit<CompetencyFieldProps, 'groups'>) {
  const typed = draft.newCompetency.trim()
  return (
    <div className="flex flex-col gap-space-xs">
      <input
        aria-label="Nova competência"
        value={draft.newCompetency}
        onChange={(event) => onChange({ ...draft, newCompetency: event.target.value })}
        placeholder="Ex.: Pontualidade"
        className={FIELD}
      />
      {typed !== '' && !isSingleWord(typed) && (
        <p className="text-body-sm text-error">Use uma palavra só, ex.: Pontualidade.</p>
      )}
    </div>
  )
}

// Competencies come from the sector goals, so the content counts towards a goal; a new one is a single word
export function CompetencyField({ draft, groups, onChange }: CompetencyFieldProps) {
  return (
    <div className="flex flex-col gap-space-xs">
      <label htmlFor="content-competency" className="text-label-lg text-on-surface">
        Competência
      </label>
      <select
        id="content-competency"
        value={draft.competency}
        onChange={(event) => onChange({ ...draft, competency: event.target.value })}
        className={FIELD}
      >
        <option value="">Escolha a competência treinada</option>
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.competencies.map((competency) => (
              <option key={competency}>{competency}</option>
            ))}
          </optgroup>
        ))}
        <option value={NEW_COMPETENCY}>+ Nova competência</option>
      </select>
      {draft.competency === NEW_COMPETENCY && <NewCompetencyInput draft={draft} onChange={onChange} />}
    </div>
  )
}
