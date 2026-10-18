import { Head, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { useMockNotice } from '@/components/MockNotice'
import { CollaboratorLayout } from '@/layouts/CollaboratorLayout'
import type { CollaboratorReward, RewardsPage } from '@/types/collaborator'
import { RedeemedList } from './RedeemedList'
import { RedeemModal } from './RedeemModal'
import { RewardCard } from './RewardCard'

// Redeeming is simulated: the balance and the list only change on this screen
function RewardsCatalog({ balance: initialBalance, rewards, redeemed: initialRedeemed }: RewardsPage) {
  const notify = useMockNotice()
  const [balance, setBalance] = useState(initialBalance)
  const [redeemed, setRedeemed] = useState(initialRedeemed)
  const [chosen, setChosen] = useState<CollaboratorReward | null>(null)

  const redeem = (reward: CollaboratorReward) => {
    setBalance(balance - reward.points)
    setRedeemed([{ name: reward.name, date: 'hoje', points: reward.points }, ...redeemed])
    setChosen(null)
    notify('Pedido enviado ao RH (simulação).')
  }

  return (
    <>
      <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <h1 className="text-headline-sm text-primary">{`Seu saldo: ${balance} pts`}</h1>
        <p className="text-body-md text-on-surface-variant">
          Você ganha pontos estudando e compartilhando o que sabe.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} balance={balance} onRedeem={() => setChosen(reward)} />
        ))}
      </div>
      <RedeemedList redeemed={redeemed} />
      {chosen && (
        <RedeemModal
          reward={chosen}
          balance={balance}
          onConfirm={() => redeem(chosen)}
          onClose={() => setChosen(null)}
        />
      )}
    </>
  )
}

export default function RewardsShow() {
  const props = usePage<RewardsPage>().props

  return (
    <CollaboratorLayout>
      <Head title="Prêmios" />
      <div className="mx-auto flex w-full max-w-[45rem] flex-col gap-space-lg py-space-lg">
        <RewardsCatalog balance={props.balance} rewards={props.rewards} redeemed={props.redeemed} />
      </div>
    </CollaboratorLayout>
  )
}
