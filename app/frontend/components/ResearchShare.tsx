import { Icon } from '@/components/Icon'

// Share of the 16 surveyed companies that named this skill as a gap of their teams
export function ResearchShare({ share }: { share: number | null }) {
  if (share === null) return null
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary-fixed px-space-sm py-0.5 text-label-sm font-bold text-on-secondary-container">
      <Icon name="trending_up" className="text-[0.875rem]" />
      Citado por {share}% das empresas
    </span>
  )
}
