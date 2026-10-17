import { useState } from 'react'
import { Modal } from '@/components/Modal'

type RankingNameModalProps = {
  current: string
  onSave: (name: string) => void
  onClose: () => void
}

export function RankingNameModal({ current, onSave, onClose }: RankingNameModalProps) {
  const [name, setName] = useState(current)

  const save = () => {
    const trimmed = name.trim()
    onSave(trimmed || current)
  }

  return (
    <Modal icon="badge" title="Nome no Ranking" onClose={onClose}>
      <p className="text-body-lg text-on-surface-variant">
        Como os colegas de equipe vão ver você na lista de pontos:
      </p>
      <div className="flex flex-col gap-space-xs">
        <label htmlFor="ranking-name" className="text-label-lg text-on-surface">
          Seu nome ou apelido
        </label>
        <input
          id="ranking-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="min-h-[3.5rem] w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-lg text-on-surface outline-none focus:bg-surface-container focus:ring-2 focus:ring-primary-container"
        />
      </div>
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <button
          type="button"
          onClick={save}
          className="flex min-h-[3.5rem] w-full items-center justify-center rounded-xl bg-primary-container text-label-lg text-on-primary"
        >
          Salvar nome
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex min-h-[3.5rem] w-full items-center justify-center rounded-xl bg-surface-container text-label-lg text-on-surface"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  )
}
