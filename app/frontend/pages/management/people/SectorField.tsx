import { Icon } from '@/components/Icon'
import type { PeopleProps } from '@/types/management'

export const NEW_SECTOR = '+ Criar setor'

type Sector = PeopleProps['sectors'][number]
type SectorFieldProps = {
  sectors: Sector[]
  selected: string
  newName: string
  onSelect: (sector: string) => void
  onNewName: (name: string) => void
}

const INPUT =
  'h-11 rounded-xl border-0 bg-surface-container-low px-space-md text-body-md text-on-surface focus:ring-2 focus:ring-primary-container'

function JourneyHint({ sector, journey }: { sector: string; journey: string | null }) {
  if (!sector) return null
  return (
    <span className="flex items-center gap-1 text-body-sm text-on-surface-variant">
      <Icon name="route" className="text-[1rem] text-primary" />
      {journey
        ? `Recebe a jornada ${journey}`
        : `${sector} ainda não tem jornada: monte uma em Jornadas depois do convite.`}
    </span>
  )
}

// Pick the sector of everyone in the invite, or create a new one right here
export function SectorField({ sectors, selected, newName, onSelect, onNewName }: SectorFieldProps) {
  const creating = selected === NEW_SECTOR
  const journey = sectors.find((sector) => sector.name === selected)?.journey ?? null

  return (
    <div className="flex flex-col gap-space-xs">
      <label className="flex flex-col gap-space-xs">
        <span className="text-label-md text-on-surface">Setor</span>
        <select value={selected} onChange={(event) => onSelect(event.target.value)} className={INPUT}>
          <option value="" disabled>
            Escolha o setor
          </option>
          {sectors.map((sector) => (
            <option key={sector.name} value={sector.name}>
              {sector.name}
            </option>
          ))}
          <option value={NEW_SECTOR}>{NEW_SECTOR}</option>
        </select>
      </label>
      {creating && (
        <input
          aria-label="Nome do novo setor"
          value={newName}
          onChange={(event) => onNewName(event.target.value)}
          placeholder="Ex.: Financeiro"
          className={INPUT}
        />
      )}
      <JourneyHint sector={creating ? newName.trim() : selected} journey={journey} />
    </div>
  )
}
