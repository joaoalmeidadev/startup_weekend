import { Icon } from '@/components/Icon'
import type { PersonStatus } from '@/types/management'
import { PERSON_STATUS, STATUS_ORDER } from './personStatus'

export function StatusSummary({ summary }: { summary: Record<PersonStatus, number> }) {
  return (
    <section aria-label="Resumo" className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
      {STATUS_ORDER.map((status) => {
        const style = PERSON_STATUS[status]
        return (
          <div
            key={status}
            className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
          >
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${style.soft}`}>
              <Icon name={style.icon} className="text-[1.5rem]" />
            </div>
            <div className="flex flex-col">
              <span className={`text-headline-xl leading-none font-bold ${style.text}`}>
                {summary[status] ?? 0}
              </span>
              <span className="text-label-lg text-on-surface">{style.plural}</span>
              <span className="text-body-sm text-on-surface-variant">{style.hint}</span>
            </div>
          </div>
        )
      })}
    </section>
  )
}
