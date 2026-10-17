import { useState } from 'react'
import { Modal } from '@/components/Modal'

export const AUDIENCES = [
  { value: 'sector', label: 'Um setor inteiro', hint: 'Quem entrar no setor depois também recebe' },
  { value: 'people', label: 'Pessoas específicas', hint: 'Ex.: quem vai ser promovido' },
  { value: 'newcomers', label: 'Novatos automaticamente', hint: 'Todo contratado novo começa por aqui' },
]

type NewJourneyModalProps = { onCreate: (name: string) => void; onClose: () => void }

export function NewJourneyModal({ onCreate, onClose }: NewJourneyModalProps) {
  const [name, setName] = useState('')
  const [audiences, setAudiences] = useState<string[]>(['sector'])
  const toggle = (value: string) =>
    setAudiences((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    )

  return (
    <Modal icon="route" title="Nova jornada" onClose={onClose}>
      <p className="text-body-md text-on-surface-variant">
        Toda jornada segue Base → Empresa → Setor. Depois de criar, você escolhe os módulos de cada trecho.
      </p>
      <div className="flex flex-col gap-space-xs">
        <label htmlFor="journey-name" className="text-label-lg text-on-surface">
          Nome da jornada
        </label>
        <input
          id="journey-name"
          type="text"
          value={name}
          placeholder="Ex.: Onboarding Comercial"
          onChange={(event) => setName(event.target.value)}
          className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary-container"
        />
      </div>
      <fieldset className="flex flex-col gap-space-xs">
        <legend className="mb-space-xs text-label-lg text-on-surface">Quem recebe</legend>
        {AUDIENCES.map((audience) => (
          <label
            key={audience.value}
            className="flex cursor-pointer items-start gap-space-sm rounded-xl bg-surface-container-low p-space-sm"
          >
            <input
              type="checkbox"
              checked={audiences.includes(audience.value)}
              onChange={() => toggle(audience.value)}
              className="mt-1 size-5 rounded border-outline text-primary-container focus:ring-primary-container"
            />
            <span className="flex flex-col">
              <span className="text-label-md text-on-surface">{audience.label}</span>
              <span className="text-body-sm text-on-surface-variant">{audience.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={!name.trim()}
        onClick={() => onCreate(name.trim())}
        className="flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-primary text-label-lg text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50"
      >
        Criar jornada
      </button>
    </Modal>
  )
}
