import { Icon } from '@/components/Icon'

const BAR =
  'fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t border-border-subtle bg-white px-8 py-3.5 shadow-lg lg:left-72'
const PRIMARY =
  'flex items-center gap-2 rounded-xl bg-primary-container px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark'

type ReviewFooterProps = {
  total: number
  final: boolean
  onDiscard: () => void
  onEdit: () => void
  onApprove: () => void
}

export function ReviewFooter({ total, final, onDiscard, onEdit, onApprove }: ReviewFooterProps) {
  return (
    <footer className={BAR}>
      <button
        type="button"
        onClick={onDiscard}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <Icon name="delete" className="text-[1.125rem]" />
        <span>Descartar lição</span>
      </button>
      <div className="hidden items-center gap-2 text-xs font-medium text-ink-muted md:flex">
        <Icon name="security" className="text-[1.125rem] text-primary-container" />
        <span>Nada vai para os colaboradores até você aprovar as {total} lições.</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-xl border border-border-subtle px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          <Icon name="edit" className="text-[1.125rem] text-ink-muted" />
          <span>Corrigir texto</span>
        </button>
        <button type="button" onClick={onApprove} className={PRIMARY}>
          {final ? (
            <span>Aprovar e escolher quem recebe 🚀</span>
          ) : (
            <>
              <span>Está certo, aprovar</span>
              <Icon name="arrow_forward" className="text-[1.125rem]" />
            </>
          )}
        </button>
      </div>
    </footer>
  )
}

type EditingFooterProps = { onCancel: () => void; onSave: () => void; onSaveAndApprove: () => void }

export function EditingFooter({ onCancel, onSave, onSaveAndApprove }: EditingFooterProps) {
  return (
    <footer className={BAR}>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
      >
        <Icon name="close" className="text-[1.125rem]" />
        <span>Cancelar edição</span>
      </button>
      <div className="flex items-center gap-2 rounded-full bg-primary-container/10 px-3 py-1.5 text-xs font-medium text-primary-container">
        <Icon name="edit_note" className="text-[1.125rem]" />
        <span>Edição de texto em andamento — salve suas alterações para continuar.</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-1.5 rounded-xl border border-primary-container px-5 py-2.5 text-xs font-bold text-primary-container transition-colors hover:bg-primary-container/10"
        >
          <Icon name="save" className="text-[1.125rem]" />
          <span>Salvar alterações</span>
        </button>
        <button type="button" onClick={onSaveAndApprove} className={PRIMARY}>
          <span>Salvar e aprovar</span>
          <Icon name="arrow_forward" className="text-[1.125rem]" />
        </button>
      </div>
    </footer>
  )
}

export function DiscardConfirmBar({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div
      role="alertdialog"
      aria-label="Descartar lição"
      className="fixed right-8 bottom-24 left-8 z-50 flex items-center justify-between gap-4 rounded-xl border-2 border-red-200 bg-white p-4 shadow-xl lg:left-80"
    >
      <div className="flex items-center gap-3">
        <Icon name="warning" className="text-[1.5rem] text-red-600" />
        <span className="text-sm font-semibold text-ink">
          A IA vai refazer esta lição a partir do manual. Deseja descartar?
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface-muted"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-red-700"
        >
          Sim, descartar
        </button>
      </div>
    </div>
  )
}
