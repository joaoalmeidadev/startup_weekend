import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { formatReais, type JourneyValue } from './journeyValue'

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

function ValueTile({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-space-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
        <Icon name={icon} className="text-[1.375rem]" />
      </span>
      <div className="flex flex-col">
        <span className="text-label-lg text-on-surface">{title}</span>
        <span className="text-body-sm text-on-surface-variant">{children}</span>
      </div>
    </div>
  )
}

// What the journey saves and asks of each newcomer, recalculated while the manager edits it
export function ValueSummary({ value }: { value: JourneyValue }) {
  return (
    <section
      aria-label="Valor desta jornada"
      className="grid grid-cols-1 gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm md:grid-cols-3"
    >
      <ValueTile icon="savings" title={`Substitui ~${value.hours}h de repasse por novato`}>
        ≈ {formatReais(value.cost)} por contratação (estimativa a R$ 40/h)
      </ValueTile>
      <ValueTile
        icon="schedule"
        title={`${plural(value.modules, 'módulo', 'módulos')} · ${plural(value.lessons, 'lição', 'lições')}`}
      >
        ~{plural(value.weeks, 'semana', 'semanas')} a 5 min/dia
      </ValueTile>
      <ValueTile icon="flag" title={`Cobre ${value.covered} de ${value.total} competências da meta`}>
        Meta do setor no nível de mercado escolhido
      </ValueTile>
    </section>
  )
}
