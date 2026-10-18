import { Modal } from '@/components/Modal'
import type { CollaboratorReward } from '@/types/collaborator'

type RedeemModalProps = {
  reward: CollaboratorReward
  balance: number
  onConfirm: () => void
  onClose: () => void
}

export function RedeemModal({ reward, balance, onConfirm, onClose }: RedeemModalProps) {
  return (
    <Modal icon="redeem" title={`Trocar ${reward.points} pts por ${reward.name}?`} onClose={onClose}>
      <p className="text-body-md text-on-surface">{`Seu saldo fica em ${balance - reward.points} pts.`}</p>
      <p className="text-body-md text-on-surface-variant">
        O RH recebe o pedido e combina a entrega com você.
      </p>
      <div className="flex flex-col gap-space-sm sm:flex-row-reverse">
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary-container text-label-lg text-on-primary hover:bg-primary"
        >
          Confirmar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-surface-container text-label-lg text-primary hover:bg-surface-container-high"
        >
          Agora não
        </button>
      </div>
    </Modal>
  )
}
