import type { Person } from '@/types/management'

const SIZES = { md: 'size-11 text-label-md', lg: 'size-20 text-headline-md' }

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? parts[parts.length - 1][0] : ''}`.toUpperCase()
}

// Photo when we have one, otherwise the initials in a circle
export function PersonAvatar({
  person,
  size = 'md',
}: {
  person: Pick<Person, 'name' | 'avatar_url'>
  size?: keyof typeof SIZES
}) {
  if (person.avatar_url) {
    return (
      <img src={person.avatar_url} alt="" className={`${SIZES[size]} shrink-0 rounded-full object-cover`} />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-primary-fixed font-bold text-on-primary-fixed`}
    >
      {initials(person.name)}
    </span>
  )
}
