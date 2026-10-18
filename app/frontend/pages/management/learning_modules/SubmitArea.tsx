import { Icon } from '@/components/Icon'
import { canSubmit, needsFileForAi, type ContentDraft } from './contentDraft'

const ACTIONS = {
  ai: { label: 'Criar lições com IA', icon: 'auto_awesome' },
  company: { label: 'Salvar na Biblioteca', icon: 'save' },
}

export function SubmitArea({ draft, onSubmit }: { draft: ContentDraft; onSubmit: () => void }) {
  const action = ACTIONS[draft.origin]
  return (
    <div className="flex flex-wrap items-center gap-space-md">
      <button
        type="button"
        disabled={!canSubmit(draft)}
        onClick={onSubmit}
        className="inline-flex h-12 w-fit items-center gap-space-xs rounded-xl bg-primary px-space-lg text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        <Icon name={action.icon} className="text-[1.25rem]" />
        {action.label}
      </button>
      {needsFileForAi(draft) && (
        <span className="text-body-sm text-on-surface-variant">
          A IA precisa de um arquivo para criar as lições.
        </span>
      )}
    </div>
  )
}
