import { Link } from '@inertiajs/react'
import { Icon } from '@/components/Icon'
import type { PointsRule } from '@/types/management'
import type { JourneyStep } from './journeyEditing'
import { hourCostFormula, ruleSource, savedFormula } from './journeyFormula'
import { formatHours, formatReais, type JourneyValue } from './journeyValue'

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

function Figure({ icon, figure, label }: { icon: string; figure: string; label: string }) {
  return (
    <div className="flex items-center gap-space-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
        <Icon name={icon} className="text-[1.375rem]" />
      </span>
      <p className="flex flex-col">
        <span className="text-headline-sm text-on-surface">{figure}</span>{' '}
        <span className="text-body-sm text-on-surface-variant">{label}</span>
      </p>
    </div>
  )
}

// The arithmetic behind the big figures, so the admin sees how hours become reais
function MathList({ steps, rule }: { steps: JourneyStep[]; rule: PointsRule }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 id="calculator-math" className="text-label-md text-on-surface">
        Como chegamos nesses números
      </h3>
      <ul
        aria-labelledby="calculator-math"
        className="flex flex-col gap-0.5 text-body-sm text-on-surface-variant"
      >
        <li>{savedFormula(steps, rule)}</li>
        <li>{hourCostFormula(rule)}</li>
      </ul>
    </div>
  )
}

function SourceLine({ source }: { source: string }) {
  return (
    <p className="text-body-sm text-on-surface-variant">
      {ruleSource(source)} ·{' '}
      <Link href="/management/sectors" className="font-semibold text-primary hover:underline">
        Ajustar em Setores
      </Link>
    </p>
  )
}

function StudyLine({ value }: { value: JourneyValue }) {
  const goal =
    value.total > 0
      ? `Cobre ${value.covered} de ${value.total} competências da meta`
      : 'Sem meta de setor para comparar'

  return (
    <p className="text-body-sm text-on-surface-variant">
      {plural(value.modules, 'módulo', 'módulos')} · {plural(value.lessons, 'lição', 'lições')} · ~
      {plural(value.weeks, 'semana', 'semanas')} a 5 min/dia · {goal}
    </p>
  )
}

type JourneyCalculatorProps = { value: JourneyValue; rule: PointsRule; source: string; steps: JourneyStep[] }

// What the journey is worth in hours of in-person training and the reais they save, by the hour cost of
// who receives it, recalculated on every change to the path
export function JourneyCalculator({ value, steps, rule, source }: JourneyCalculatorProps) {
  return (
    <section
      aria-labelledby="calculator-title"
      className="flex flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm"
    >
      <h2 id="calculator-title" className="text-label-lg text-on-surface">
        Calculadora da jornada
      </h2>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <Figure icon="schedule" figure={`${formatHours(value.hours)} h`} label="de treino substituídas" />
        <Figure icon="savings" figure={formatReais(value.saved)} label="economizados" />
      </div>
      <div className="flex flex-col gap-1 border-t border-surface-container-high pt-space-sm">
        <MathList steps={steps} rule={rule} />
        <SourceLine source={source} />
        <StudyLine value={value} />
      </div>
    </section>
  )
}
