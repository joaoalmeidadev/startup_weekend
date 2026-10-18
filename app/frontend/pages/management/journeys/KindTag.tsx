import { Icon } from '@/components/Icon'
import type { JourneyKind } from '@/types/management'
import { kindOf } from './journeyKinds'

export function KindTag({ kind }: { kind: JourneyKind }) {
  const { title, icon, tone } = kindOf(kind)
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-space-sm py-0.5 text-label-sm font-bold ${tone}`}
    >
      <Icon name={icon} className="text-[0.875rem]" />
      Jornada {title}
    </span>
  )
}
