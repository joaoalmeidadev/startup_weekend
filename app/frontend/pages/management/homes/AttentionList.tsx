import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { AttentionItem } from '@/types/management'

export function AttentionList({ items }: { items: AttentionItem[] }) {
  return (
    <section className="flex flex-col gap-space-md">
      <h2 className="text-headline-md text-on-surface">Precisa da sua atenção</h2>
      <ul className="flex flex-col gap-space-sm">
        {items.map((item) => (
          <li
            key={item.text}
            className="flex items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
          >
            <div className="flex items-center gap-space-sm">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-container">
                <Icon name={item.icon} className="text-[1.375rem]" />
              </div>
              <span className="text-body-lg text-on-surface">{item.text}</span>
            </div>
            <Link
              href={item.href}
              className="inline-flex h-11 shrink-0 items-center gap-space-xs rounded-xl bg-primary px-space-md text-label-md text-on-primary hover:bg-primary-container"
            >
              {item.action}
              <Icon name="arrow_forward" className="text-[1.125rem]" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
