import type { ReactNode } from 'react'

type JourneySectionProps = { id: string; title: string; children: ReactNode }

export function JourneySection({ id, title, children }: JourneySectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-space-sm">
      <h2 id={id} className="text-label-lg text-on-surface-variant">
        {title}
      </h2>
      {children}
    </section>
  )
}
