import { Icon } from '@/components/Icon'
import type { RedeemedReward } from '@/types/collaborator'

export function RedeemedList({ redeemed }: { redeemed: RedeemedReward[] }) {
  return (
    <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
      <h2 id="redeemed-title" className="text-headline-sm text-on-surface">
        Meus resgates
      </h2>
      {redeemed.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">Você ainda não trocou pontos por prêmios.</p>
      ) : (
        <ul aria-labelledby="redeemed-title" className="flex flex-col divide-y divide-surface-container-high">
          {redeemed.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center gap-space-sm py-space-sm">
              <Icon name="check_circle" className="text-[1.25rem] text-tertiary-container" />
              <span className="flex-1 text-label-lg text-on-surface">{item.name}</span>
              <span className="text-body-sm text-on-surface-variant">{`${item.date} · ${item.points} pts`}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
