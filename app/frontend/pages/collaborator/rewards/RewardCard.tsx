import { Icon } from '@/components/Icon'
import type { CollaboratorReward } from '@/types/collaborator'

type RewardCardProps = { reward: CollaboratorReward; balance: number; onRedeem: () => void }

const percentOf = (balance: number, points: number) => Math.min(100, Math.round((balance / points) * 100))

// How far the balance is from a reward she cannot afford yet
function MissingPoints({ balance, points }: { balance: number; points: number }) {
  const percent = percentOf(balance, points)
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-md text-on-surface-variant">{`Faltam ${points - balance} pts`}</span>
      <div
        role="progressbar"
        aria-label="Quanto você já tem"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
      >
        <div className="h-full rounded-full bg-outline" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function RewardAction({ reward, balance, onRedeem }: RewardCardProps) {
  if (reward.stock === 0) return <span className="text-label-md font-semibold text-error">Esgotado</span>
  if (balance < reward.points) return <MissingPoints balance={balance} points={reward.points} />
  return (
    <button
      type="button"
      onClick={onRedeem}
      className="flex h-11 w-full items-center justify-center gap-space-xs rounded-xl bg-tertiary-container text-label-lg text-on-tertiary transition hover:brightness-110 active:translate-y-px"
    >
      <Icon name="redeem" className="text-[1.25rem]" />
      Resgatar
    </button>
  )
}

// Green when the balance covers it; gray, with how much is missing, otherwise
export function RewardCard({ reward, balance, onRedeem }: RewardCardProps) {
  const affordable = reward.stock !== 0 && balance >= reward.points
  const id = `reward-${reward.id}`
  return (
    <article
      aria-labelledby={id}
      className={`flex flex-col gap-space-sm rounded-xl p-space-md shadow-sm ${affordable ? 'bg-success-bg ring-2 ring-tertiary-fixed-dim' : 'bg-surface-container-lowest'}`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <span
          className={`flex size-11 items-center justify-center rounded-xl ${affordable ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant'}`}
        >
          <Icon name={reward.icon} className="text-[1.5rem]" />
        </span>
        <span
          className={`rounded-full px-space-sm py-0.5 text-label-md font-bold ${affordable ? 'bg-tertiary-container text-on-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}
        >
          {reward.points} pts
        </span>
      </div>
      <div className="flex flex-col">
        <h3 id={id} className="text-label-lg text-on-surface">
          {reward.name}
        </h3>
        <span className="text-body-sm text-on-surface-variant">{reward.category}</span>
      </div>
      <div className="mt-auto">
        <RewardAction reward={reward} balance={balance} onRedeem={onRedeem} />
      </div>
    </article>
  )
}
