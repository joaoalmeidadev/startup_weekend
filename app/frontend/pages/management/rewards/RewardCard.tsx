import { Icon } from '@/components/Icon'
import type { Reward, RewardRule } from '@/types/management'
import { brl, economics } from './rewardEconomics'

export function RewardCard({ reward, rule }: { reward: Reward; rule: RewardRule }) {
  const { saved, kept, keptShare } = economics(reward, rule)
  const id = `reward-${reward.id}`
  return (
    <article
      aria-labelledby={id}
      className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
    >
      <div className="flex items-start justify-between gap-space-sm">
        <span className="flex size-11 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-container">
          <Icon name={reward.icon} className="text-[1.5rem]" />
        </span>
        <span className="rounded-full bg-primary-container px-space-sm py-0.5 text-label-md font-bold text-on-primary">
          {reward.points} pts
        </span>
      </div>
      <div className="flex flex-col">
        <h3 id={id} className="text-label-lg text-on-surface">
          {reward.name}
        </h3>
        <span className="text-body-sm text-on-surface-variant">{reward.category}</span>
      </div>
      <div className="flex flex-col gap-1 border-t border-surface-container-high pt-space-xs text-body-sm">
        <span className="text-on-surface">Custa {brl(reward.cost)}</span>
        <span className="text-on-surface-variant">
          Economia de treino ~{brl(saved)} · fica {brl(kept)} ({keptShare}%)
        </span>
        {reward.stock != null && <span className="text-on-surface-variant">{reward.stock} em estoque</span>}
      </div>
    </article>
  )
}
