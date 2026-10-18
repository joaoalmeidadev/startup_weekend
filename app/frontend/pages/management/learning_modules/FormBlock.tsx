import type { ReactNode } from 'react'

export const FIELD =
  'h-12 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container'

export function FormBlock({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id={id} className="text-headline-sm text-on-surface">
        {title}
      </h2>
      {children}
    </section>
  )
}
