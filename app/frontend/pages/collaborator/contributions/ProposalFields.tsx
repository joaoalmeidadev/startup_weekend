import type { ContributionForm } from '@/types/collaborator'
import type { ProposalDraft } from './proposalDraft'
import { INPUT } from './ProposalQuestionFields'

type ProposalFieldsProps = {
  draft: ProposalDraft
  sectors: ContributionForm['sectors']
  onChange: (draft: ProposalDraft) => void
}

const LABEL = 'flex flex-col gap-space-xs text-label-lg text-on-surface'

// What the journey is, who it is for and how long it would take to teach it in person
export function ProposalFields({ draft, sectors, onChange }: ProposalFieldsProps) {
  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <label className={LABEL}>
        Nome da jornada
        <input
          placeholder="Ex.: Como atender um cliente bravo"
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          className={`${INPUT} bg-surface-container-low`}
        />
      </label>
      <label className={LABEL}>
        Para quem é
        <select
          value={draft.sector}
          onChange={(e) => onChange({ ...draft, sector: e.target.value })}
          className={`${INPUT} bg-surface-container-low`}
        >
          <option value="">Escolha o setor</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </label>
      <label className={LABEL}>
        Quanto tempo levaria para ensinar isso pessoalmente? (h)
        <input
          inputMode="decimal"
          placeholder="Ex.: 2"
          value={draft.hours}
          onChange={(e) => onChange({ ...draft, hours: e.target.value })}
          className={`${INPUT} bg-surface-container-low`}
        />
      </label>
    </div>
  )
}
