import { Icon } from '@/components/Icon'
import type { ContentSource } from '@/types/management'

// The three origins of a content, in the order the manager meets them
export const SOURCES: Record<ContentSource, { label: string; icon: string; className: string }> = {
  ai: { label: 'Gerado por IA', icon: 'auto_awesome', className: 'bg-violet-100 text-violet-800' },
  nivela: { label: 'Produtos Nivela', icon: 'verified', className: 'bg-primary-fixed text-on-primary-fixed' },
  company: { label: 'Produtos da empresa', icon: 'apartment', className: 'bg-orange-100 text-orange-800' },
}

export const SOURCE_ORDER: ContentSource[] = ['ai', 'nivela', 'company']

export function SourceBadge({ source }: { source: ContentSource }) {
  const style = SOURCES[source]
  return (
    <span
      data-source={source}
      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-space-sm py-0.5 text-label-sm font-bold ${style.className}`}
    >
      <Icon name={style.icon} className="text-[0.875rem]" />
      {style.label}
    </span>
  )
}
