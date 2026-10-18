import type { AudienceOption, JourneyAudience } from '@/types/management'

export const peopleCount = (count: number) => `${count} ${count === 1 ? 'pessoa' : 'pessoas'}`

// Chips for who receives a journey: each sector by name, groups tagged, people as a count
export function audienceChips(audience: JourneyAudience, options: AudienceOption[]) {
  if (audience.type === 'people') return [peopleCount(audience.names.length)]

  const groups = new Set(options.filter((option) => option.kind === 'group').map((option) => option.name))
  return audience.names.map((name) => (groups.has(name) ? `${name} · Grupo` : name))
}
