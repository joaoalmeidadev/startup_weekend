import type { JourneyKind } from '@/types/management'

// The three kinds of journey; a person studies them in this order: Base → Empresa → Setor
// tone: the tag colors; stripe: the matching bar on the side of the journey card
export const JOURNEY_KINDS: {
  key: JourneyKind
  title: string
  icon: string
  hint: string
  tone: string
  stripe: string
}[] = [
  {
    key: 'base',
    title: 'Base',
    icon: 'psychology',
    hint: 'Habilidades gerais que todo mundo precisa',
    tone: 'bg-primary-fixed text-on-primary-fixed',
    stripe: 'bg-primary-fixed-dim',
  },
  {
    key: 'company',
    title: 'Empresa',
    icon: 'apartment',
    hint: 'Cultura, processos e o jeito da empresa',
    tone: 'bg-secondary-fixed text-on-secondary-fixed',
    stripe: 'bg-secondary-fixed-dim',
  },
  {
    key: 'sector',
    title: 'Setor',
    icon: 'support_agent',
    hint: 'O dia a dia de um setor',
    // Lilac, so it is not mistaken for the green "Ativa" status
    tone: 'bg-[#eaddff] text-[#21005e]',
    stripe: 'bg-[#cdb8f5]',
  },
]

export const kindOf = (key: JourneyKind) => JOURNEY_KINDS.find((kind) => kind.key === key) ?? JOURNEY_KINDS[0]
