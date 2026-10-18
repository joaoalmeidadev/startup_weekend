import type { PersonStatus } from '@/types/management'

type StatusStyle = { label: string; plural: string; hint: string; icon: string; text: string; soft: string }

// Every status pairs a color with an icon and a word, so it never depends on color alone
export const PERSON_STATUS: Record<PersonStatus, StatusStyle> = {
  leveled: {
    label: 'Nivelado',
    plural: 'Nivelados',
    hint: 'Já atingiram a meta do setor',
    icon: 'verified',
    text: 'text-tertiary-container',
    soft: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  },
  on_track: {
    label: 'No ritmo',
    plural: 'No ritmo',
    hint: 'Seguindo o prazo da jornada',
    icon: 'trending_up',
    text: 'text-primary',
    soft: 'bg-primary-fixed text-on-primary-fixed',
  },
  late: {
    label: 'Atrasado',
    plural: 'Atrasados',
    hint: 'Precisam de um empurrão',
    icon: 'schedule',
    text: 'text-secondary',
    soft: 'bg-secondary-fixed text-on-secondary-container',
  },
}

export const STATUS_ORDER: PersonStatus[] = ['leveled', 'on_track', 'late']
