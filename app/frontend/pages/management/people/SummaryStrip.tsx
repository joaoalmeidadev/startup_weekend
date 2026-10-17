import { Icon } from '@/components/Icon'
import type { PersonStatus, SummaryEntry } from '@/types/management'

const CARDS: { status: PersonStatus; label: string; icon: string; box: string; pill: string }[] = [
  {
    status: 'leveled',
    label: 'Totalmente nivelados',
    icon: 'verified',
    box: 'bg-tertiary-container text-on-tertiary-container',
    pill: 'text-tertiary-container',
  },
  {
    status: 'learning',
    label: 'Em desenvolvimento',
    icon: 'auto_stories',
    box: 'bg-primary-container text-on-primary-container',
    pill: 'text-primary',
  },
  {
    status: 'attention',
    label: 'Precisam de suporte',
    icon: 'priority_high',
    box: 'bg-secondary-container text-on-secondary-container',
    pill: 'text-secondary',
  },
]

export function SummaryStrip({ summary }: { summary: Record<PersonStatus, SummaryEntry> }) {
  return (
    <section className="grid grid-cols-1 gap-space-md md:grid-cols-3">
      {CARDS.map((card) => (
        <div
          key={card.status}
          className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
        >
          <div className="flex items-center gap-space-sm">
            <div className={`flex size-12 items-center justify-center rounded-xl ${card.box}`}>
              <Icon name={card.icon} className="text-[1.5rem]" />
            </div>
            <div className="flex flex-col">
              <span className="text-headline-md leading-tight font-bold text-on-surface">
                {summary[card.status].count}
              </span>
              <span className="text-label-sm text-on-surface-variant">{card.label}</span>
            </div>
          </div>
          <span
            className={`rounded-full bg-surface-container px-space-sm py-1 text-label-sm font-bold ${card.pill}`}
          >
            {summary[card.status].percent}%
          </span>
        </div>
      ))}
    </section>
  )
}
