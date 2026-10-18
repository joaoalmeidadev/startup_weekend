import { Icon } from '@/components/Icon'
import type { JourneyOutlineItem } from '@/types/management'

function NewItem({ item }: { item: JourneyOutlineItem }) {
  return (
    <li className="flex items-center gap-space-sm rounded-lg bg-surface-container-lowest p-space-sm text-label-md text-primary">
      <Icon name="star" className="text-[1.125rem] text-secondary" />
      <span>{item.title}</span>
      <span className="rounded-full bg-primary-fixed px-space-sm py-0.5 text-label-sm">
        Novo módulo ativo!
      </span>
    </li>
  )
}

function PlainItem({ item, index }: { item: JourneyOutlineItem; index: number }) {
  const done = item.status === 'done'
  return (
    <li
      className={`flex items-center gap-space-sm text-body-sm ${done ? 'text-on-surface' : 'text-on-surface-variant'}`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-label-sm ${done ? 'bg-tertiary-container text-on-primary' : 'bg-surface-container-high'}`}
      >
        {done ? <Icon name="check" className="text-[0.875rem]" /> : index + 1}
      </span>
      <span>
        {item.title}
        {done && ' — Concluído'}
      </span>
    </li>
  )
}

// Where the published module lands in the journey (Base → Empresa → Setor)
export function JourneyOutline({ items }: { items: JourneyOutlineItem[] }) {
  return (
    <div className="flex w-full flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md text-left">
      <span className="text-label-sm font-bold tracking-wider text-on-surface-variant uppercase">
        Estrutura da jornada
      </span>
      <ul className="flex flex-col gap-space-sm">
        {items.map((item, index) =>
          item.status === 'new' ? (
            <NewItem key={item.title} item={item} />
          ) : (
            <PlainItem key={item.title} item={item} index={index} />
          ),
        )}
      </ul>
    </div>
  )
}
