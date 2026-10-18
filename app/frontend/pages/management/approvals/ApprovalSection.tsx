import type { ReactNode } from 'react'

// A card with its title naming the region, like the other management pages
export function ApprovalSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
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
