import { Icon } from '@/components/Icon'
import type { LessonReview } from '@/types/management'

type PublishedModalProps = { review: LessonReview; onClose: () => void }

function OutlineItem({ item, index }: { item: LessonReview['journey_outline'][number]; index: number }) {
  if (item.status === 'new') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-primary-container/20 bg-white p-2.5 text-xs font-bold text-primary-container">
        <Icon name="star" className="text-[1.125rem] text-amber-brand" />
        <span>
          {item.title}{' '}
          <span className="ml-1 rounded-full bg-teal-soft px-2 py-0.5 text-[0.6875rem] font-semibold">
            Novo módulo ativo!
          </span>
        </span>
      </div>
    )
  }
  const done = item.status === 'done'
  return (
    <div className={`flex items-center gap-2.5 text-xs ${done ? 'text-ink' : 'text-ink-muted'}`}>
      <span
        className={`flex size-5 flex-shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold ${done ? 'bg-success-green text-white' : 'bg-surface-muted text-ink-muted'}`}
      >
        {done ? '✓' : index + 1}
      </span>
      <span className="font-medium">
        {item.title}
        {done && (
          <>
            {' '}
            — <span className="font-semibold text-success-green">Concluído</span>
          </>
        )}
      </span>
    </div>
  )
}

export function PublishedModal({ review, onClose }: PublishedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm lg:pl-72">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Módulo publicado"
        className="relative flex w-full max-w-lg flex-col items-center rounded-2xl border border-border-subtle bg-white p-8 text-center shadow-xl"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-full border-2 border-success-green/30 bg-success-bg text-success-green shadow-sm">
          <Icon name="celebration" className="text-[2.25rem]" />
        </div>
        <span className="mb-3 rounded-full bg-teal-soft px-3 py-1 text-xs font-bold tracking-wider text-primary-container uppercase">
          Jornada Atualizada
        </span>
        <h2 className="mb-2 text-2xl leading-tight font-bold text-ink">Módulo publicado com sucesso!</h2>
        <p className="mb-6 text-sm leading-relaxed font-medium text-ink-muted">
          Pronto!{' '}
          <strong className="font-semibold text-ink">{review.audience_count} pessoas do Atendimento</strong>{' '}
          já podem fazer este módulo.
        </p>
        <div className="mb-6 flex w-full flex-col gap-2.5 rounded-xl border border-border-subtle bg-surface-warm p-4 text-left">
          <span className="text-[0.6875rem] font-bold tracking-wider text-ink-muted uppercase">
            Estrutura da Jornada de Atendimento
          </span>
          {review.journey_outline.map((item, index) => (
            <OutlineItem key={item.title} item={item} index={index} />
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark"
        >
          <span>Voltar para Jornadas</span>
          <Icon name="arrow_forward" className="text-[1.125rem]" />
        </button>
      </div>
    </div>
  )
}
