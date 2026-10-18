import { Icon } from '@/components/Icon'
import { SourceBadge } from '@/components/SourceBadge'
import type { CatalogGroup, ModuleSummary } from '@/types/management'

type AddModule = (module: ModuleSummary) => void

const HINTS: Record<CatalogGroup['source'], string> = {
  ai: 'Criados pela IA a partir dos seus materiais',
  nivela: 'Feitos para qualquer setor',
  company: 'Escritos pela sua empresa',
}

type CatalogItemProps = { module: ModuleSummary; added: boolean; onAdd: AddModule }

function CatalogItem({ module, added, onAdd }: CatalogItemProps) {
  return (
    <li className="flex items-center justify-between gap-space-sm py-space-sm">
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-label-lg text-on-surface">{module.name}</span>
        <span className="text-body-sm text-on-surface-variant">
          {module.lessons} lições · substitui ~{module.teaching_hours}h
        </span>
      </span>
      <button
        type="button"
        disabled={added}
        aria-label={added ? `${module.name} já está na jornada` : `Adicionar ${module.name}`}
        onClick={() => onAdd(module)}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-surface-container px-space-sm py-1.5 text-label-md text-primary transition-colors hover:bg-surface-container-high disabled:bg-transparent disabled:text-on-surface-variant"
      >
        <Icon name={added ? 'check' : 'add'} className="text-[1rem]" />
        {added ? 'Na jornada' : 'Adicionar'}
      </button>
    </li>
  )
}

type CatalogPanelProps = { catalog: CatalogGroup[]; inJourney: Set<string>; onAdd: AddModule }

export function CatalogPanel({ catalog, inJourney, onAdd }: CatalogPanelProps) {
  return (
    <section
      aria-labelledby="catalog-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <div className="flex flex-col">
        <h2 id="catalog-title" className="text-headline-sm text-on-surface">
          Biblioteca
        </h2>
        <p className="text-body-sm text-on-surface-variant">Escolha o que entra na jornada.</p>
      </div>
      {catalog.map((group) => (
        <section key={group.source} aria-label={`Biblioteca: ${group.title}`} className="flex flex-col">
          <div className="flex flex-wrap items-center gap-space-sm">
            <SourceBadge source={group.source} />
            {group.source === 'nivela' && (
              <span className="rounded-full bg-tertiary-fixed px-space-sm py-0.5 text-label-sm font-bold text-on-tertiary-fixed-variant">
                pronto para usar
              </span>
            )}
            <span className="text-body-sm text-on-surface-variant">{HINTS[group.source]}</span>
          </div>
          <ul className="flex flex-col divide-y divide-surface-container">
            {group.modules.map((module) => (
              <CatalogItem key={module.id} module={module} added={inJourney.has(module.id)} onAdd={onAdd} />
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
