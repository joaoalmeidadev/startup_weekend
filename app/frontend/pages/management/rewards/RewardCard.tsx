import { Icon } from '@/components/Icon'
import type { PointsRule, Reward } from '@/types/management'
import { brl, hoursReplaced } from './rewardValue'

const redeemedText = (count: number) => `${count} ${count === 1 ? 'resgatado' : 'resgatados'}`

// What is left after the redemptions; an unlimited reward only tells how often it was redeemed
function StockLine({ stock, redeemed }: Pick<Reward, 'stock' | 'redeemed'>) {
  let text: string
  if (stock === null) text = redeemed > 0 ? `Sem limite · ${redeemedText(redeemed)}` : 'Sem limite de estoque'
  else if (stock === 0) text = `Esgotado · ${redeemedText(redeemed)}`
  else text = redeemed > 0 ? `${stock} em estoque · ${redeemedText(redeemed)}` : `${stock} em estoque`
  return <span className={stock === 0 ? 'font-semibold text-error' : 'text-on-surface-variant'}>{text}</span>
}

export function RewardCard({ reward, rule }: { reward: Reward; rule: PointsRule }) {
  const hours = hoursReplaced(reward.points, rule)
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
        {hours && <span className="text-on-surface-variant">{`Equivale a ~${hours} h de estudo`}</span>}
        <StockLine stock={reward.stock} redeemed={reward.redeemed} />
      </div>
    </article>
  )
}
