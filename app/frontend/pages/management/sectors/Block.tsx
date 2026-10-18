import { Link } from '@inertiajs/react'
import { useId, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'

type BlockProps = { title: string; hint?: string; action?: ReactNode; children: ReactNode }

// A titled card section, reachable as a region named by its title
export function Block({ title, hint, action, children }: BlockProps) {
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <h2 id={id} className="text-headline-md text-on-surface">
            {title}
          </h2>
          {hint && <p className="text-body-sm text-on-surface-variant">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function BackToSectors() {
  return (
    <Link
      href="/management/sectors"
      aria-label="Voltar para Setores"
      className="inline-flex w-fit items-center gap-1 text-label-md text-primary hover:underline"
    >
      <Icon name="chevron_left" className="text-[1.125rem]" />
      Setores
    </Link>
  )
}
