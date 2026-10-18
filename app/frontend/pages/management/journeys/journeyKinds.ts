import type { JourneyKind } from '@/types/management'

// The three kinds of journey; a person studies them in this order: Base → Empresa → Setor
export const JOURNEY_KINDS: { key: JourneyKind; title: string; icon: string; hint: string }[] = [
  { key: 'base', title: 'Base', icon: 'psychology', hint: 'Habilidades gerais que todo mundo precisa' },
  { key: 'company', title: 'Empresa', icon: 'apartment', hint: 'Cultura, processos e o jeito da empresa' },
  { key: 'sector', title: 'Setor', icon: 'support_agent', hint: 'O dia a dia de um setor' },
]

export const kindOf = (key: JourneyKind) => JOURNEY_KINDS.find((kind) => kind.key === key) ?? JOURNEY_KINDS[0]
