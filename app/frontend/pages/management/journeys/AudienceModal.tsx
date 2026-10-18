import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { AUDIENCES, AudienceOptions } from '@/components/AudienceOptions'

// Chips shown on the journey for each kind of audience
const CHIP: Record<string, string> = { people: 'Pessoas específicas', newcomers: 'Novatos' }

export function audienceKinds(audience: string[]) {
  return AUDIENCES.map((a) => a.value).filter((kind) =>
    audience.some((chip) =>
      kind === 'sector'
        ? chip.startsWith('Setor')
        : kind === 'newcomers'
          ? chip === 'Novatos'
          : chip.includes('pessoas'),
    ),
  )
}

export function audienceChips(kinds: string[], current: string[]) {
  const sectorChip = current.find((chip) => chip.startsWith('Setor')) ?? 'Setor Atendimento'
  return kinds.map((kind) => (kind === 'sector' ? sectorChip : CHIP[kind]))
}

type AudienceModalProps = { current: string[]; onSave: (audience: string[]) => void; onClose: () => void }

export function AudienceModal({ current, onSave, onClose }: AudienceModalProps) {
  const [kinds, setKinds] = useState(audienceKinds(current))
  const toggle = (value: string) =>
    setKinds((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]))

  return (
    <Modal icon="group" title="Quem recebe esta jornada" onClose={onClose}>
      <AudienceOptions selected={kinds} onToggle={toggle} />
      <button
        type="button"
        disabled={kinds.length === 0}
        onClick={() => onSave(audienceChips(kinds, current))}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary hover:bg-primary-container disabled:opacity-50"
      >
        Salvar
      </button>
    </Modal>
  )
}
