import { Icon } from '@/components/Icon'
import { useMockNotice } from '@/components/MockNotice'
import type { LessonReview } from '@/types/management'

export function ManualExcerpt({ manual }: { manual: LessonReview['manual'] }) {
  const notify = useMockNotice()

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <Icon name="menu_book" className="text-[1.25rem] text-primary-container" />
        <h2 className="text-base font-bold text-ink">O que diz o seu manual?</h2>
      </div>
      <div className="flex min-h-[23.75rem] flex-col justify-between rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-muted uppercase">
            <span className="size-2 rounded-full bg-primary-container" />
            Trecho de referência da empresa
          </div>
          <blockquote className="border-l-4 border-primary-container py-1 pl-4 text-base leading-relaxed font-normal text-ink italic">
            “{manual.before}{' '}
            <mark className="rounded bg-yellow-100 px-1 py-0.5 font-medium text-ink not-italic">
              {manual.highlight}
            </mark>
            {manual.after}”
          </blockquote>
          <p className="text-xs leading-relaxed text-ink-muted">{manual.note}</p>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4 text-xs text-ink-muted">
          <span className="font-medium">{manual.source}</span>
          <button
            type="button"
            onClick={() => notify('O documento completo abre aqui em breve.')}
            className="inline-flex items-center gap-1 font-semibold text-primary-container hover:text-primary-dark hover:underline"
          >
            Ver documento completo ↗
          </button>
        </div>
      </div>
    </section>
  )
}
