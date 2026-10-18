// Who receives a journey or a new content; shared by the journey editor and the publish step
export const AUDIENCES = [
  { value: 'sector', label: 'Um setor inteiro', hint: 'Quem entrar no setor depois também recebe' },
  { value: 'newcomers', label: 'Novatos automaticamente', hint: 'Todo contratado novo começa por aqui' },
  { value: 'people', label: 'Pessoas específicas', hint: 'Ex.: quem vai ser promovido' },
]

type AudienceOptionsProps = {
  selected: string[]
  onToggle: (value: string) => void
  sectorLabel?: string
}

export function AudienceOptions({ selected, onToggle, sectorLabel }: AudienceOptionsProps) {
  return (
    <div className="flex flex-col gap-space-xs">
      {AUDIENCES.map((audience) => (
        <label
          key={audience.value}
          className="flex cursor-pointer items-start gap-space-sm rounded-xl bg-surface-container-low p-space-sm"
        >
          <input
            type="checkbox"
            checked={selected.includes(audience.value)}
            onChange={() => onToggle(audience.value)}
            className="mt-1 size-5 rounded border-outline text-primary-container focus:ring-primary-container"
          />
          <span className="flex flex-col">
            <span className="text-label-md text-on-surface">
              {audience.value === 'sector' && sectorLabel ? sectorLabel : audience.label}
            </span>
            <span className="text-body-sm text-on-surface-variant">{audience.hint}</span>
          </span>
        </label>
      ))}
    </div>
  )
}
