import { useState } from 'react'
import { Modal } from '@/components/Modal'

type ReminderModalProps = {
  current: string
  options: string[]
  onConfirm: (time: string) => void
  onClose: () => void
}

export function ReminderModal({ current, options, onConfirm, onClose }: ReminderModalProps) {
  const [selected, setSelected] = useState(current)

  return (
    <Modal icon="schedule" title="Escolha o melhor horário" onClose={onClose}>
      <p className="text-body-lg text-on-surface-variant">
        Em qual hora do dia você prefere receber seu lembrete de aprendizado?
      </p>
      <div className="my-space-xs grid grid-cols-2 gap-space-sm">
        {options.map((time) => (
          <button
            key={time}
            type="button"
            aria-pressed={time === selected}
            onClick={() => setSelected(time)}
            className={`flex min-h-[3.5rem] items-center justify-center rounded-xl text-label-lg transition-colors ${time === selected ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
          >
            {time}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onConfirm(selected)}
        className="flex min-h-[3.5rem] w-full items-center justify-center rounded-xl bg-primary-container text-label-lg text-on-primary"
      >
        Confirmar horário
      </button>
    </Modal>
  )
}
