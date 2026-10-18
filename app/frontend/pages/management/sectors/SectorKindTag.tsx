import type { SectorKind } from '@/types/management'

const KIND_LABELS: Record<SectorKind, string> = { sector: 'Setor de trabalho', group: 'Grupo' }

// Groups always carry their tag; work sectors only where the kind needs saying (e.g. the sector header)
export function SectorKindTag({ kind }: { kind: SectorKind }) {
  const style =
    kind === 'group'
      ? 'bg-secondary-fixed text-on-secondary-container'
      : 'bg-primary-fixed text-on-primary-fixed'
  return <span className={`rounded-full px-2 py-0.5 text-label-sm ${style}`}>{KIND_LABELS[kind]}</span>
}
