import type { StretchKey } from '@/types/management'

// The three fixed stretches of every journey, in order
export const STRETCHES: { key: StretchKey; title: string; icon: string; hint: string }[] = [
  {
    key: 'base',
    title: 'Base',
    icon: 'psychology',
    hint: 'Biblioteca Nivela: matemática, português e comportamento',
  },
  { key: 'company', title: 'Empresa', icon: 'apartment', hint: 'Cultura, valores e processos da empresa' },
  { key: 'sector', title: 'Setor', icon: 'support_agent', hint: 'O trabalho da área' },
]
