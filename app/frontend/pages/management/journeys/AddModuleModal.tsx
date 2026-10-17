import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal'
import type { ModuleSummary, Stretch } from '@/types/management'

type AddModuleModalProps = {
  stretch: Stretch
  library: ModuleSummary[]
  onPick: (module: ModuleSummary) => void
  onCreate: (how: 'manual' | 'ai') => void
  onClose: () => void
}

function LibraryList({ library, onPick }: Pick<AddModuleModalProps, 'library' | 'onPick'>) {
  if (library.length === 0) {
    return (
      <p className="text-body-sm text-on-surface-variant">
        Todos os módulos da biblioteca já estão nesta jornada.
      </p>
    )
  }
  return (
    <ul className="flex max-h-80 flex-col gap-space-xs overflow-y-auto">
      {library.map((module) => (
        <li
          key={module.id}
          className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-sm"
        >
          <span className="flex flex-col">
            <span className="text-label-md text-on-surface">{module.name}</span>
            <span className="text-body-sm text-on-surface-variant">
              {module.competency} · {module.lessons} lições
            </span>
          </span>
          <button
            type="button"
            onClick={() => onPick(module)}
            className="rounded-lg bg-primary px-space-md py-1.5 text-label-sm text-on-primary hover:bg-primary-container"
          >
            Adicionar
          </button>
        </li>
      ))}
    </ul>
  )
}

const CREATE_OPTIONS = [
  {
    how: 'manual' as const,
    icon: 'edit_note',
    title: 'Criar manualmente',
    hint: 'Escreva as lições e a avaliação final',
  },
  {
    how: 'ai' as const,
    icon: 'auto_awesome',
    title: 'Criar com IA a partir de um arquivo',
    hint: 'Envie um manual; a IA monta as lições e você revisa',
  },
]

// Base takes modules from the Nivela catalog; Empresa and Setor are written by the company
export function AddModuleModal({ stretch, library, onPick, onCreate, onClose }: AddModuleModalProps) {
  return (
    <Modal icon="library_add" title={`Adicionar módulo em ${stretch.title}`} onClose={onClose}>
      {stretch.key === 'base' ? (
        <>
          <p className="text-body-md text-on-surface-variant">
            Escolha na Biblioteca Nivela. O conteúdo é mantido pela Nivela.
          </p>
          <LibraryList library={library} onPick={onPick} />
        </>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {CREATE_OPTIONS.map((option) => (
            <button
              key={option.how}
              type="button"
              onClick={() => onCreate(option.how)}
              className="flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-md text-left transition-colors hover:bg-surface-container"
            >
              <Icon name={option.icon} className="text-[1.5rem] text-primary" />
              <span className="flex flex-col">
                <span className="text-label-lg text-on-surface">{option.title}</span>
                <span className="text-body-sm text-on-surface-variant">{option.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}
